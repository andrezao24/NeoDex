import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import admin from "firebase-admin";

//lê o ficheiro json com as minhas credenciais da firebase
const credenciasAdmin = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf8")
);

//inicia o Firebase Admin SDK com as credenciais
admin.initializeApp({
    credential: admin.credential.cert(credenciasAdmin)
});

const db = admin.firestore();

//cria o servidor Express
const app = express();
const PORT = 5000; //na porta 5000
app.use(cors());

//a PokeApi tem endpoints diferentes para alguns pokemons e esta função 
//faz o pedido e se o primeiro der errado tenta com a segunda forma
async function pedidoPokeApi(url) {
    try {
        let res = await fetch(url.replace(/\/$/, "")); //tenta sem barra final
        if (!res.ok) throw new Error(); //lança erro se der erro
        return await res.json(); // retorna o JSON

    } catch (err) {
        try {
            let res = await fetch(url.replace(/\/?$/, "/")); // tenta com barra final
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return await res.json();

        } catch (err) {
            throw new Error(err); //lança erro final se falhar
        }
    }
}

//processa os dados de um Pokémon individual
async function processarPokemon(p) {
    try {
        const especie = await pedidoPokeApi(p.url);
        const pokemon = await pedidoPokeApi(`https://pokeapi.co/api/v2/pokemon/${especie.id}`);
        const evolucaoDados = await pedidoPokeApi(especie.evolution_chain.url);

        //monta lista de evoluções
        const evolui = [];
        const loop = (chain) => {
            evolui.push(chain.species.name);
            chain.evolves_to.forEach(loop); //percorre todas as evoluções
        };
        loop(evolucaoDados.chain);

        //geração
        let geracao = null;
        if (especie.generation) {
            geracao = especie.generation.name.replace("generation-", "");
        }

        //raridade
        let raridade;
        if (especie.is_legendary) raridade = "Legendary";
        else if (especie.is_mythical) raridade = "Mythical";
        else raridade = "Common";

        //retorna o objeto com todas as informações relevantes
        return {
            id: pokemon.id,
            name: especie.name,
            types: pokemon.types.map(t => t.type.name),
            generation: geracao,
            rarity: raridade,
            height: pokemon.height,
            weight: pokemon.weight,
            sprite: pokemon.sprites.front_default,
            stats: pokemon.stats.map(p => ({ name: p.stat.name, value: p.base_stat })),
            moves: pokemon.moves.map(m => m.move.name),
            abilities: pokemon.abilities.map(a => a.ability.name),
            evolutions: evolui,
        };

    } catch (err) {
        console.log("Erro", p.name, err.message);
        return null;
    }
}

//gera todos os Pokémon e salva no Firestore
async function gerarPokemons() {
    console.log("A obter Pokémons...");
    const especieDados = await pedidoPokeApi("https://pokeapi.co/api/v2/pokemon-species?limit=1025");

    const batchSize = 5;  //processa em lotes de 5 para não sobrecarregar a API
    const resultado = [];

    //Pokémon em batches
    for (let i = 0; i < especieDados.results.length; i += batchSize) {
        const batch = especieDados.results.slice(i, i + batchSize);
        const dadosBatch = await Promise.all(batch.map(p => processarPokemon(p))); //processa simultaneamente
        resultado.push(...dadosBatch.filter(Boolean)); // filtra Pokémon nulos
        console.log(`Progresso: ${resultado.length}/${especieDados.results.length}`);
    }

    //cria batch para inserir no Firestore
    const batch = db.batch();
    const collection = db.collection("pokemons");

    for (const p of resultado) {
        const doc = collection.doc(String(p.id)); // cria documento com ID do Pokémon
        batch.set(doc, p);
    }

    try {
        await batch.commit(); //salva todos os Pokémon no Firestore
    } catch (err) {
        console.log("erro", err.message);
    }

    console.log("Pokémons gravados");

    return resultado
}

//endpoint para iniciar gerarPokemons()
app.get("/gerar", (req, res) => {
    res.json({ status: "ok", msg: "Iniciado" });
    gerarPokemons().catch(err => console.log("Erro", err));
});

//inicia servidor
app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}/gerar`);
});

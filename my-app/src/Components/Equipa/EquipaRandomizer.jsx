import React, { useContext } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";
import Button from "../UI/Button/Button";

export default function EquipaRandomizer() {
    const { pokemonList, setEquipa, setEquipaNome,
        slotsEquipa = 6, mostrarMensagem, cap
    } = useContext(EquipaContext); //dados pelo contexto

    //com base nos tipos dos pokemons da equipa, procura palavras para montar um nome para a equipa 
    const palavrasRandom = async (tipo) => {
        try {
            const nomesResposta = await fetch(`https://api.datamuse.com/words?rel_jjb=${tipo}`);
            const nomesDados = await nomesResposta.json();
            return cap(nomesDados[Math.floor(Math.random() * nomesDados.length)].word);
        } catch {
            return cap(tipo); // fallback se API falhar
        }
    };

    const gerarNome = async (tipos) => {
        const tiposEquipa = [];

        for (const t of tipos) {
            if (!tiposEquipa.includes(t)) tiposEquipa.push(t);
        } // tipos únicos na equipa 

        const tiposParaNome = tiposEquipa.slice(0, 2); // usa no máximo 2 tipos

        // gera os adjetivos aleatórios para cada tipo da equipa e aguarda todos acabarem
        const adjetivos = await Promise.all(
            tiposParaNome.map(palavrasRandom)
        );

        return adjetivos.join(" "); // nome final
    };

    // preenche cada slot da equipa com um Pokémon aleatório, evita tipos repetidos e seleciona até 4 movimentos
    const gerarEquipaRandom = async () => {
        let copiaListaPokemon = [...pokemonList];
        const novaEquipa = [];
        const tiposEscolhidos = [];

        for (let i = 0; i < slotsEquipa; i++) {
            const filtrados = copiaListaPokemon.filter(p =>
                !p.types.some(t => tiposEscolhidos.includes(t))
            );

            let equipa;
            if (filtrados.length > 0) {
                equipa = filtrados; // usa só Pokémon com tipos não repetidos
            } else {
                equipa = copiaListaPokemon; // se não houver, permite repetir tipos
            }

            //escolhe um pokemon aleatório do array
            const idx = Math.floor(Math.random() * equipa.length);
            const pokemon = equipa[idx];

            //evita que o mesmo pokemon seja selecionado novamente
            copiaListaPokemon = copiaListaPokemon.filter(p => p.name !== pokemon.name);

            //atualiza os tipos
            pokemon.types.forEach(t => {
                if (!tiposEscolhidos.includes(t)) tiposEscolhidos.push(t);
            });

            // seleciona aleatoriamente até 4 movimentos únicos do Pokémon
            const movesDisponiveis = pokemon.moves || [];
            const selectedMoves = [];
            while (selectedMoves.length < 4 && movesDisponiveis.length > 0) {
                const m = movesDisponiveis[Math.floor(Math.random() * movesDisponiveis.length)];
                if (!selectedMoves.includes(m)) selectedMoves.push(m);
            }

            // adiciona uma cópia do Pokémon com os movimentos selecionados à equipa final
            novaEquipa.push({ ...pokemon, selectedMoves });
        }

        setEquipa(novaEquipa); //salva a nova equipa no estado geral
        
        //gera então o nome com base nos tipos
        try {
            const nome = await gerarNome(tiposEscolhidos);
            setEquipaNome(nome);

        } catch (error) {
            console.log("Erro", err)
            setEquipaNome("Team Rocket"); //fallback
            mostrarMensagem("Name randomly generated due to API error.");
        }
    };

    return (
        <Button onClick={gerarEquipaRandom} className="btn-random">
            Make Random Team
        </Button>
    );
}

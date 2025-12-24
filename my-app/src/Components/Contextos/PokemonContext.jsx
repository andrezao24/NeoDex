import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const PokemonContext = createContext();

export default function PokemonProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [carregar, setCarregar] = useState(false);

    //carregar dados pokemons
    const [pokemonsDados, setPokemonsDados] = useState({});
    const [selecaoPokemon, setSelecaoPokemon] = useState(null);

    //manipulação de pokemons e cartas favoritas
    const [favoritos, setPokemonsFavoritos] = useState([]);
    const [cartasFavoritas, setCartasFavoritas] = useState([]);

    //paginação e listas
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);

    // filtros independetes para as componentes da Pokedex
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroGeracao, setFiltroGeracao] = useState("");
    const [filtroRaridade, setFiltroRaridade] = useState("");
    const [tipos, setTipos] = useState([]);
    const [geracoes, setGeracoes] = useState([]);
    const raridades = ["Legendary", "Mythical", "Common"];

    const redirecionar = useNavigate();
    const cap = s => s && s.charAt(0).toUpperCase() + s.slice(1);

    // carregar lista de Pokémon - setPokemonList && ListaFiltrada
    useEffect(() => {
        const carregarDados = async () => {
            setCarregar(true);
            try {
                const pokemonQuery = await getDocs(collection(db, "pokemons"));
                const lista = pokemonQuery.docs.map(doc => doc.data());

                lista.sort((a, b) => a.id - b.id);

                setPokemonList(lista);
                setListaFiltrada(lista);

            } catch (err) {
                console.error("Erro", err);

            } finally {
                setCarregar(false);
            }
        };
        carregarDados();
    }, []);

    // Cria listas de tipos e gerações únicas - lista usada nos filtros
    useEffect(() => {
        if (pokemonList.length === 0) return;

        const tiposUnicos = [];
        const geracoesUnicas = [];

        //percorre cada Pokemon da Lista
        pokemonList.forEach(p => {
            (p.types || []).forEach(type => {
                if (tiposUnicos.indexOf(type) === -1) tiposUnicos.push(type);
            });

            const gen = p.generation || "";
            if (geracoesUnicas.indexOf(gen) === -1) geracoesUnicas.push(gen);
        });

        setTipos(tiposUnicos);
        setGeracoes(geracoesUnicas);
    }, [pokemonList]);

    // esta função carrega as informações todas de um pokemon e permite a manipulação dessa informação
    const carregarPokemon = async (nome) => {
        if (pokemonsDados[nome]) return pokemonsDados[nome];

        const pokemon = pokemonList.find(p => p.name === nome);
        if (!pokemon) return null;

        const dadosCompletos = {
            id: pokemon.id,
            nome: pokemon.name,
            sprite: pokemon.sprite,
            altura: pokemon.height,
            peso: pokemon.weight,
            raridade: pokemon.rarity,
            tipos: pokemon.types || [],
            habilidades: pokemon.abilities || [],
            estatisticas: pokemon.stats || [],
            evolucoes: pokemon.evolutions || [],
            generation: pokemon.generation || ""
        }; //todas as informações do pokemons descontruídas

        setPokemonsDados(prev => ({ ...prev, [nome]: dadosCompletos }));
        return dadosCompletos;
    };

    //função que trata de carregar os pokemons favoritos do utilizador - firestore
    useEffect(() => {
        const carregarFavoritos = async () => {
            if (!user) {
                setPokemonsFavoritos([]);
                return;
            }

            //se o utilizador tiver favoritos da set desses pokemons
            try {
                const userDoc = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    //se o documento existir, seta os Pokémon favoritos
                    setPokemonsFavoritos(docSnap.data().favoritos || []);
                } else {
                    //cria o documento com favoritos vazios
                    await setDoc(userDoc, { favoritos: [] }, { merge: true });
                    setPokemonsFavoritos([]);
                }
            } catch (err) {
                console.log("Erro", err);
            }
        };

        carregarFavoritos();
    }, [user]); //sempre que o user mudar, atualiza

    //função que permite marcar um pokemon como favorito
    const toggleFavorito = async (nome) => {
        if (!user) return;

        try {
            const userDoc = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDoc);
            let favoritosAtuais = []; // array que vai armazenar os favoritos existentes

            if (docSnap.exists()) {
                favoritosAtuais = docSnap.data().favoritos || [];
            } //se houver favoritos dá set ao que já existem

            //determina a nova lista de favoritos - adiciona ou remove
            let novosFavoritos = [];
            if (favoritosAtuais.includes(nome)) {
                novosFavoritos = favoritosAtuais.filter(f => f !== nome);
            } else {
                novosFavoritos = [...favoritosAtuais, nome];
            }

            setPokemonsFavoritos(novosFavoritos);

            //atualiza a bd com os novos favoritos, o merge protege os favoritos antigos não dando overwrite 
            await setDoc(userDoc, { favoritos: novosFavoritos }, { merge: true });
        } catch (err) {
            console.log("Erro ", err);
        }
    };

    //função que trata de carregar as cartas favoritas do utilizador - firestore
    useEffect(() => {
        if (!user) {
            setCartasFavoritas([]);
            return;
        }

        //faz exatamente o mesmo que o anterior so que para as cartas
        const carregarCartasFavoritas = async () => {
            try {
                const userDoc = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setCartasFavoritas(docSnap.data().cartasFavoritas || []);
                } else {
                    await setDoc(userDoc, { cartasFavoritas: [] }, { merge: true });
                    setCartasFavoritas([]);
                }
            } catch (err) {
                console.log("Erro", err);
            }
        };

        carregarCartasFavoritas();
    }, [user]);

    // carta favorita
    const toggleCartaFavorita = async (carta) => {
        if (!user) return;

        try {
            const userDoc = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDoc);
            let favoritosAtuais = [];
            if (docSnap.exists()) {
                favoritosAtuais = docSnap.data().cartasFavoritas || [];
            }

            //identificador único: id + lingua
            //garante que cada carta tenha uma key diferente
            const cartaKey = `${carta.id}_${carta.lingua}`;
            const existe = favoritosAtuais.some(c => `${c.id}_${c.lingua}` === cartaKey);

            let novosFavoritos;
            if (existe) {
                //remover
                novosFavoritos = favoritosAtuais.filter(c => `${c.id}_${c.lingua}` !== cartaKey);
            } else {
                //adicionar
                novosFavoritos = [...favoritosAtuais, carta];
            }

            setCartasFavoritas(novosFavoritos);
            await setDoc(userDoc, { cartasFavoritas: novosFavoritos }, { merge: true });
        } catch (err) {
            console.log("Erro ", err);
        }
    };

    // Abre e fecha detalhes do Pokémon selecionado
    const abrirDetalhes = async (nome) => {
        const dados = await carregarPokemon(nome);
        setSelecaoPokemon(dados);
    };
    const fecharDetalhes = () => setSelecaoPokemon(null);


    //navegar para o próximo Pokémon na lista
    const handleNextPokemon = async (pokemonAtual) => {
        //encontra o índice do pokemon
        const index = pokemonList.findIndex(p => p.name === pokemonAtual.nome);

        //se for o último ou não existir desativa
        if (index === -1 || index === pokemonList.length - 1) return;

        //seleciona o próximo e carrega os seus dados
        const proximo = pokemonList[index + 1];
        const dadosProximo = await carregarPokemon(proximo.name);

        setSelecaoPokemon(dadosProximo);
    };

    //faz exatamente o mesmo só que para o pokemon anterior
    const handlePrevPokemon = async (pokemonAtual) => {
        const index = pokemonList.findIndex(p => p.name === pokemonAtual.nome);
        if (index <= 0) return;
        const anterior = pokemonList[index - 1];
        const dadosAnterior = await carregarPokemon(anterior.name);
        setSelecaoPokemon(dadosAnterior);
    };

    //filtros da lista - tipos, rarides e ger
    const aplicarFiltros = () => {
        let filtrado = [...pokemonList];

        if (pesquisa) {
            const pesquisaLower = pesquisa.toLowerCase();
            filtrado = filtrado.filter(p =>
                p.name.toLowerCase().includes(pesquisaLower) ||
                p.id.toString().includes(pesquisaLower)
            );
        }

        if (filtroTipo)
            filtrado = filtrado.filter(p => (p.types || []).includes(filtroTipo));

        if (filtroGeracao)
            filtrado = filtrado.filter(p => p.generation.toUpperCase() === filtroGeracao.toUpperCase());

        if (filtroRaridade)
            filtrado = filtrado.filter(p => (p.rarity || "Common") === filtroRaridade);

        setListaFiltrada(filtrado);
        setPaginaAtual(1);
    };

    //aplica o filtros e sempre que um atualiza esta também atualiza
    useEffect(() => {
        aplicarFiltros();
    }, [pesquisa, filtroTipo, filtroGeracao, filtroRaridade]);

    //limpa os filtros
    const limparFiltros = () => {
        setFiltroTipo("");
        setFiltroGeracao("");
        setFiltroRaridade("");
        setPesquisa("");
    };

    return (
        <PokemonContext.Provider value={{
            // dados principais
            user, pokemonList, selecaoPokemon,
            pokemonsDados, favoritos, cartasFavoritas,
            listaFiltrada, paginaAtual, tipos,
            geracoes, raridades, carregar,

            // filtros e pesquisa
            pesquisa, filtroTipo, filtroGeracao, filtroRaridade,

            // setters
            setPokemonList, setSelecaoPokemon, setListaFiltrada,
            setPokemonsFavoritos, setCartasFavoritas, setPesquisa,
            setFiltroTipo, setFiltroGeracao, setFiltroRaridade, setPaginaAtual,

            // ações principais
            carregarPokemon, abrirDetalhes, fecharDetalhes,
            toggleFavorito, toggleCartaFavorita, aplicarFiltros, limparFiltros,

            // complementos
            handleNextPokemon, handlePrevPokemon, cap, redirecionar
        }}>
            {children}
        </PokemonContext.Provider>

    );
}

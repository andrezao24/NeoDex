import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { AuthContext } from "./AuthContext";

export const EquipaContext = createContext();

export default function EquipaProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [mensagemErro, setMensagemErro] = useState("");
    const [pokemonList, setPokemonList] = useState([]);

    //manipulação de construção da equipa
    const slotsEquipa = 6; //slots possiveis numa equipa
    const [equipa, setEquipa] = useState(Array(slotsEquipa).fill(null));
    const [slotSelecionado, setSlotSelecionado] = useState(null);
    const [overlayAberta, setOverlayAberta] = useState(false);
    const [pokemonSelecionado, setPokemonSelecionado] = useState(null);
    const [equipaNome, setEquipaNome] = useState("");
    const [equipasGuardadas, setEquipasGuardadas] = useState([]);

    // filtros independetes para as componentes da Equipa
    const [pesquisaEquipa, setPesquisaEquipa] = useState("");
    const [filtroTipoEquipa, setFiltroTipoEquipa] = useState("");
    const [filtroGeracaoEquipa, setFiltroGeracaoEquipa] = useState("");
    const [filtroRaridadeEquipa, setFiltroRaridadeEquipa] = useState("");
    const [tipos, setTipos] = useState([]);
    const [geracoes, setGeracoes] = useState([]);
    const raridades = ["Common", "Legendary", "Mythical"];

    const cap = s => s && s.charAt(0).toUpperCase() + s.slice(1);
    const redirecionar = useNavigate();

    //todos os Pokémon estão na Firestore e armazena no array pokemonList.
    useEffect(() => {
        async function fetchPokemons() {
            try {
                const pokemonQuery = await getDocs(collection(db, "pokemons"));
                const dados = pokemonQuery.docs.map(doc => doc.data());
                dados.sort((a, b) => a.id - b.id);
                setPokemonList(dados);

            } catch (err) {
                console.log("Erro", err);
            }
        }

        fetchPokemons();
    }, []);

    //carrega as equipas salvas do Utilizador, 
    useEffect(() => {
        if (!user) {
            setEquipaNome("");
            setEquipasGuardadas([]);
            return;
        }

        async function carregarEquipas() {
            try {
                const userDoc = doc(db, "users", user.uid);
                const snap = await getDoc(userDoc);

                if (snap.exists()) {
                    const data = snap.data();
                    if (data.equipasGuardadas) {
                        setEquipasGuardadas(data.equipasGuardadas);
                    }
                }

            } catch (err) {
                console.log("Erro", err);
            }
        }

        carregarEquipas();
    }, [user]); //atualiza sempre que o utilizador muda

    //timer para possíveis mensagens 
    const mostrarMensagem = (texto) => {
        setMensagemErro(texto);
        setTimeout(() => setMensagemErro(""), 3000);
    };

    //abre uma componente overlay para escolher um Pokémon e armazena o slot selecionado.
    const abrirOverlay = (slotIndex) => {
        setSlotSelecionado(slotIndex);
        setOverlayAberta(true);
        setPokemonSelecionado(null);
    };

    //esta fecha a componente overlay - Equipa Lista / Equipa Details
    const fecharOverlay = () => {
        setOverlayAberta(false);
        setSlotSelecionado(null);
        setPokemonSelecionado(null);
    };

    //limpa os filtros da pesquisa da Equipa - EquipaFilters
    const limparFiltros = () => {
        setPesquisaEquipa("");
        setFiltroTipoEquipa("");
        setFiltroGeracaoEquipa("");
        setFiltroRaridadeEquipa("");
    };

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
    }, [pokemonList]); //é executado quando o pokemonList altera

    // confirma o slot selecionado pelo utilizador e permite adicionar pokemons a essa slot
    const adicionarAoSlot = (pokemonName, moves) => {
        if (slotSelecionado === null) return; // impede execução se nenhum slot tiver selecionado

        const p = pokemonList.find(x => x.name === pokemonName); //procura o nome do pokemon para o adicionar
        if (!p) return;

        //pega na equipa atual, faz uma cópia e retorna a equipa atualizada
        setEquipa(prev => {
            const copia = [...prev];
            copia[slotSelecionado] = { ...p, selectedMoves: moves };
            return copia;
        });

        setPokemonSelecionado(null); //limpa a seleção
    };

    const removerDoSlot = (slotIndex) => {
        //copia da equipa atual 
        setEquipa(prev => {
            const copia = [...prev];
            const removido = copia[slotIndex]; //guarda o pokemon que foi removido
            copia[slotIndex] = null; //define como slot vazio

            if (pokemonSelecionado && removido && removido.name === pokemonSelecionado.name) {
                setPokemonSelecionado(null);
            }

            return copia;
        });
    };

    //percorre todos os slots da equipa e limpa-os
    const limparSlots = () => {
        const novaEquipa = [];
        for (let i = 0; i < slotsEquipa; i++) {
            novaEquipa.push(null);
        }
        setEquipa(novaEquipa);
        setEquipaNome("");
    };

    //guarda equipa na firestore
    const guardarEquipa = async () => {
        //so permite guardar a equipa se tiver nome
        if (!equipaNome.trim()) {
            mostrarMensagem("You cannot save the team without a name.");
            return;
        }

        //so permite guardar a equipa se tiver todos os slots preenchidos
        if (equipa.some(p => p === null)) {
            mostrarMensagem("The team needs to have all 6 Pokémon before saving.");
            return;
        }

        try {
            //encontra os documentos do utilizador e usa equipasGuardadas se exister se não um array vazio
            const userDoc = doc(db, "users", user.uid);
            const snap = await getDoc(userDoc);
            const equipasAtuais = (snap.exists() && snap.data().equipasGuardadas) || [];

            //cria e guarda uma equipa nova
            const novaEquipa = { nome: equipaNome, slots: [...equipa] };
            const indexExistente = equipasAtuais.findIndex(e => e.nome === equipaNome); //verifica equipa com o mesmo nome
            const novasEquipas = [];

            //se a equipa já existe substitui 
            for (let i = 0; i < equipasAtuais.length; i++) {
                if (i === indexExistente) {
                    novasEquipas.push(novaEquipa);
                } else {
                    novasEquipas.push(equipasAtuais[i]);
                }
            }
            //se não existir equipa, adiciona a nova
            if (indexExistente === -1) {
                novasEquipas.push(novaEquipa);
            }

            //guarda a equipa
            await setDoc(userDoc, { equipasGuardadas: novasEquipas }, { merge: true });
            setEquipasGuardadas(novasEquipas);

            limparSlots(); //depois de guardar a equipa limpa os slots todos
        } catch (err) {
            console.log("Erro", err);
            mostrarMensagem("Error saving the team. Please try again.");
        }
    };

    //apaga equipa específica da lista local e também da Firestore.
    const eliminarEquipa = async (index) => {

        //cria uma cópia e remove e retorna a lista vazia
        setEquipasGuardadas(prev => {
            const copia = [...prev];
            copia.splice(index, 1);
            return copia;
        });

        try {
            const userDoc = doc(db, "users", user.uid);
            const snap = await getDoc(userDoc);

            //se existir - a equipa - lê o array e cria um array sem a equipa e atualiza o doc
            if (snap.exists()) {
                const data = snap.data();
                const novasEquipas = []; //novo array
                const equipas = data.equipasGuardadas || [];

                for (let i = 0; i < equipas.length; i++) {
                    if (i !== index) {
                        novasEquipas.push(equipas[i]);
                    }
                }
                await setDoc(userDoc, { equipasGuardadas: novasEquipas }, { merge: true });
            }

        } catch (err) {
            console.log("Erro", err);
        }
    };

    return (
        <EquipaContext.Provider value={{
            // dados principais
            user, pokemonList, equipa,
            equipasGuardadas, equipaNome,
            pokemonSelecionado, slotSelecionado,
            overlayAberta, mensagemErro,

            // filtros
            pesquisaEquipa, filtroTipoEquipa,
            filtroGeracaoEquipa, filtroRaridadeEquipa,
            tipos, geracoes, raridades,

            // setters
            setEquipa, setEquipasGuardadas, setEquipaNome,
            setPokemonSelecionado, setSlotSelecionado,
            setOverlayAberta, setMensagemErro,

            setPesquisaEquipa, setFiltroTipoEquipa,
            setFiltroGeracaoEquipa, setFiltroRaridadeEquipa,

            // ações principais
            adicionarAoSlot, removerDoSlot,
            limparSlots, eliminarEquipa, guardarEquipa,

            // complementos
            mostrarMensagem, redirecionar,
            cap, abrirOverlay, fecharOverlay,
            limparFiltros
        }}>
            {children}
        </EquipaContext.Provider>
    );
}

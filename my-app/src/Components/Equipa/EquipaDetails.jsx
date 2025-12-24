import React, { useContext, useState, useEffect } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";
import { PokemonContext } from "../Contextos/PokemonContext";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input"
import "./Equipa.css";

export default function EquipaDetails() {
    const {
        pokemonSelecionado: pokemon, adicionarAoSlot,
        removerDoSlot, equipa, slotSelecionado,
        setOverlayAberta, setPokemonSelecionado,
        mensagemErro, setMensagemErro, mostrarMensagem,
        setEquipa, cap, redirecionar
    } = useContext(EquipaContext); //controla os slots, a equipa, a overlay e as ações

    const { carregarPokemon } = useContext(PokemonContext); //permite carregar os dados de um pokemon

    //trata dos moves - seleção e procura
    const [selecionados, setSelecionados] = useState([]);
    const [searchMove, setSearchMove] = useState("");

    //dá load aos detalhes do pokemon e redireciona para a pokedex
    const handleClickPokemon = async (nome) => {
        await carregarPokemon(nome);
        redirecionar("/pokedex", { state: { pokemonSelecionado: nome } });
        setPokemonSelecionado(null);
    };

    //formata nome do move
    const formatarNomeMove = (m) => {
        return m.replace(/-/g, " ") //substitui - por um espaço
            .split(" ")
            .map(cap).join(" ");
    };

    //true se o Pokémon selecionado está no slot atual
    const equipaEditada = equipa[slotSelecionado] && equipa[slotSelecionado].name === pokemon.name;

    //true se o Pokémon já existe em outro slot. percorre todo o array
    let pokemonNaEquipa = false;
    for (let i = 0; i < equipa.length; i++) {
        if (i !== slotSelecionado && equipa[i] && equipa[i].name === pokemon.name) {
            pokemonNaEquipa = true;
            break;
        }
    }

    //selecionar ou retirar movimento 
    const toggleMove = (move) => {
        //se pokemon estiver na equipa não permite adicionar
        if (pokemonNaEquipa) {
            mostrarMensagem("Pokemon is already on the team.");
            return;
        }

        setMensagemErro("");

        //cria uma lista nova
        let novo;
        if (selecionados.includes(move)) {
            novo = selecionados.filter((m) => m !== move); //retira o selecionado
        } else {
            if (selecionados.length >= 4) return; //seleciona - no máximo 4 moves
            novo = [...selecionados, move];
        }
        setSelecionados(novo); //atualiza a lista de moves selecionados

        // atualiza o slot que corresponde na equipa
        setEquipa((prev) => {
            const copia = [...prev];
            if (slotSelecionado !== null && copia[slotSelecionado]) {
                copia[slotSelecionado] = {
                    ...copia[slotSelecionado],
                    selectedMoves: novo,
                };
            }
            return copia;
        });
    };

    //adiciona o pokemon ao slot
    const handleAdicionar = () => {

        //apenas adiciona se tiver os 4 moves selecionados
        if (selecionados.length !== 4) {
            mostrarMensagem("Select exactly 4 moves before adding them.");
            return;
        }

        if (slotSelecionado !== null) {
            adicionarAoSlot(pokemon.name, selecionados);
        }
    };

    // selecionados - movimentos já escolhidos para ele ou inicia como vazio
    useEffect(() => {
        if (pokemon) setSelecionados(pokemon.selectedMoves || []);
    }, [pokemon]); // sempre que o Pokémon selecionado muda, atualiza o estado local

    if (!pokemon) return null;

    return (
        <div className="overlay">
            <Button className="close-btn"
                onClick={() => {
                    setPokemonSelecionado(null);
                    setOverlayAberta(true);
                }}>
                Close
            </Button>

            <div className="details-container">
                <div className="details-section">
                    <div className="sprite-container">
                        <img
                            className="sprite"
                            src={pokemon.sprite}
                            onClick={() => handleClickPokemon(pokemon.name)} //redireciona para a pokedex
                            title="Click to learn more about this Pokemon" />

                        {/*listagem de tipos */}
                        <div className="tipos">
                            {pokemon.types && pokemon.types.map((t, i) => (
                                <img
                                    key={i}
                                    className="tipo-icone"
                                    src={`/Assets/Icones/${t}.png`}
                                    title={cap(t)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="nome-e-botao">
                        <h2>{cap(pokemon.name)}</h2>

                        {/* remove se o Pokémon estiver no slot atual */}
                        {equipaEditada && (
                            <Button className="remove-pokemon-team" onClick={() => removerDoSlot(slotSelecionado)}>
                                Remove
                            </Button>
                        )}

                        {/* adiciona se o slot estiver vazio e o Pokémon não estiver em outro slot */}
                        {!equipaEditada && !pokemonNaEquipa && slotSelecionado !== null && (
                            <Button className="add-pokemon-team" onClick={handleAdicionar}>
                                Add to Slot {slotSelecionado + 1}
                            </Button>
                        )}

                        {/* nenhum botão se o Pokémon já está em outro slot */}
                        {pokemonNaEquipa && !equipaEditada && <p></p>}
                    </div>
                        
                    <div className="erro-mov">
                        {mensagemErro && <p className="erro-moves">{mensagemErro}</p>}
                    </div>

                    {/*lista de informações */}
                    <p>ID: {pokemon.id}</p>
                    <p>Height: {(pokemon.height / 10).toFixed(1)} m</p>
                    <p>Weight: {(pokemon.weight / 10).toFixed(1)} kg</p>
                    <p>Weight: {pokemon.rarity} </p>
                    <p>Abilities: {(pokemon.abilities || []).map(cap).join(", ")}</p>
                    <h3>Stats</h3>
                    {pokemon.stats && pokemon.stats.map((stat) => (
                        <p key={stat.name}>
                            <span>{cap(stat.name)} - </span>
                            <span>{stat.value}</span>
                        </p>
                    ))}
                </div>

                <div className="moves-section">
                    {/* pequisa de moves*/}
                    <div className="moves-header">
                        <h3>Moves</h3>
                        <Input
                            type="text"
                            placeholder="Search move..."
                            value={searchMove}
                            onChange={(e) => setSearchMove(e.target.value)}
                            className="search-move-input" />
                    </div>

                    {/* lista de moves (filtrados ou não) - selecionáveis */}
                    <ul className="moves-list">
                        {pokemon.moves
                            .filter((m) => m.toLowerCase().includes(searchMove.toLowerCase()))
                            .map((m, i) => (
                                <li
                                    key={i}
                                    className={`move-item ${selecionados.includes(m) && "selected"}`}
                                    onClick={() => toggleMove(m)} >
                                    {formatarNomeMove(m)}
                                </li>))
                        }
                    </ul>
                </div>

            </div>
        </div>
    );
}

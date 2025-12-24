import React, { useContext, useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import { PokemonContext } from "../Contextos/PokemonContext";
import PokemonTCGSlide from "./PokemonTCGSlide";

export default function PokemonDetails({ pokemon, onBack, onSelect }) {
    const {
        toggleFavorito, favoritos, carregarPokemon,
        handleNextPokemon, handlePrevPokemon,
        fecharDetalhes, cap
    } = useContext(PokemonContext);

    //estados para as cartas 
    const [cartas, setCartas] = useState([]);
    const [carregarCartas, setCarregarCartas] = useState(false);
    const [lingua, setLingua] = useState("en");

    // useEffect para buscar cartas TCG
    useEffect(() => {
        const fetchCartas = async () => {
            if (!pokemon.id) return;
            setCarregarCartas(true);

            try {
                const pedidoCartas = await fetch(`https://api.tcgdex.net/v2/${lingua}/dex-ids/${pokemon.id}`);
                const respostaCartas = await pedidoCartas.json();

                let cartasArray = [];

                //verifica se o endpoint retorna "cards" e se é um array
                if (respostaCartas.cards && Array.isArray(respostaCartas.cards)) {
                    cartasArray = respostaCartas.cards;
                }

                //filtra cartas que possuem imagem
                const cards = cartasArray.filter(carta => carta.image);

                //aualiza estado com cartas válidas
                setCartas(cards);

            } catch (err) {
                console.error("Erro", err);
                setCartas([]);

            } finally {
                setCarregarCartas(false); // termina o carregamento
            }
        };

        fetchCartas();
    }, [pokemon, lingua]); //atualiza sempre que o pokemon ou a lingua escolhida mudar

    //define a imagem da estrela de favorito
    let estrelaSrc = "Assets/Favoritos/estrela.png";
    if (favoritos.includes(pokemon.nome)) {
        estrelaSrc = "Assets/Favoritos/estrela_hover.png";
    }

    //eventos de teclado - navegação
    useEffect(() => {
        const handleKey = e => {
            //proximo pokemon
            if (e.key === "ArrowRight")
                handleNextPokemon(pokemon);

            //pokemon anterior
            if (e.key === "ArrowLeft")
                handlePrevPokemon(pokemon);

            //fecha os detalhes 
            if (e.key === "Escape")
                fecharDetalhes();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey); //remove listener ao desmontar
    }, [pokemon]);

    return (
        <div className="pokemon-detalhes">
            {/* botão de voltar */}
            <div className="botao-container">
                <Button className="btn-simples-1" onClick={onBack}> Back </Button>
            </div>

            {/* navegação entre Pokémon */}
            <div className="flow-container">
                <p onClick={() => handlePrevPokemon(pokemon)}> Previous </p>
                <p onClick={() => handleNextPokemon(pokemon)}> Next </p>
            </div>

            {/* informações do Pokémon */}
            <div className="detalhes-grid">
                <div className="infos">
                    <p className="id"> #{pokemon.id}</p>

                    <div className="nome-favorito-container">
                        <h2>{cap(pokemon.nome)}</h2>
                        <img
                            src={estrelaSrc}
                            onClick={() => toggleFavorito(pokemon.nome)}
                        />
                    </div>

                    <p>Generation: {pokemon.generation.toUpperCase()}</p>
                    <p>Height: {(pokemon.altura / 10).toFixed(1)} m</p>
                    <p>Weight: {(pokemon.peso / 10).toFixed(1)} kg</p>
                    <p>Rarity: {cap(pokemon.raridade)}</p>
                    <p>Abilities: {pokemon.habilidades.map(h => cap(h)).join(", ")}</p>

                    <div className="estatisticas">
                        <h3>Stats</h3>
                        <ul>
                            {pokemon.estatisticas.map(stat => (
                                <li key={stat.name}>
                                    <span>{cap(stat.name)}</span>
                                    <span>{stat.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* sprite do Pokémon */}
                <div className="sprite-central">
                    <img className="main-sprite" src={pokemon.sprite} title={cap(pokemon.nome)} />
                </div>

                {/*evoluções e tipos */}
                <div className="evolucoes">
                    <h3>Evolutions</h3>
                    <ul>
                        {pokemon.evolucoes.map(evo => (
                            <li key={evo}>
                                <Button
                                    className="evolucao-btn"
                                    onClick={() => {
                                        carregarPokemon(evo);
                                        onSelect(evo);
                                    }}
                                    disabled={evo === pokemon.nome}
                                >
                                    {cap(evo)}
                                </Button>
                            </li>
                        ))}
                    </ul>

                    <div className="tipos-lista">
                        <h3>Types</h3>
                        <ul>
                            {pokemon.tipos.map((t, i) => (
                                <li key={i} className="tipo-item">
                                    <img src={`/Assets/Icones/${t}.png`} title={cap(t)} />
                                    <span className="tipo-nome">{cap(t)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* componente que mostra as cartas */}
            {<PokemonTCGSlide
                cartas={cartas}
                carregarCartas={carregarCartas}
                lingua={lingua}
                setLingua={setLingua} />}
        </div>
    );
}

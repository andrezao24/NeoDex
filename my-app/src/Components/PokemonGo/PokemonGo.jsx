import React, { useState, useContext, useEffect } from "react";
import ObterLocalizacao from "./ObterLocalizacao";
import ObterClima from "./ObterClima";
import { PokemonContext } from "../Contextos/PokemonContext";
import PokemonCard from "../Pokedex/PokemonCard";
import Button from "../UI/Button/Button";
import "./PokemonGo.css";

export default function PokemonGO() {
    const [countdown, setCountdown] = useState(3);

    //estado do output mostrado ao utilizador
    const [output, setOutput] = useState(["Click the button to start"]);

    //controla os pokemons mostrados com base nos que estão com boost de tempo
    const [tiposBoost, setTiposBoost] = useState([]);

    //controla o estado do slider
    const [currentIndex, setCurrentIndex] = useState(0);

    const {
        user, pokemonList, abrirDetalhes,
        selecaoPokemon, carregarPokemon,
        redirecionar
    } = useContext(PokemonContext);

    //obter localização
    const { obterPosicao } = ObterLocalizacao();

    //obter climar
    const { obterClima, obterTempo, obterBoosts } = ObterClima();

    //controlador de carrossel
    const pokemonVisivel = 5;
    const pokemonMostra = [];

    useEffect(() => {
        if (!user) {
            const interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                redirecionar("/login");
            }, 3000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [user, redirecionar]);

    //obtém a localização, os climas e os tipos com boost
    const getTempoInfo = async () => {
        //atualiza o estado do output
        setOutput(["Obtaining location, please wait..."]);

        try {
            //obtem latitude e longitude
            const posicao = await obterPosicao();
            const { latitude, longitude } = posicao.coords;

            //passa como parametros para esta função que manipula o pedido à API OpenMeteo
            const dadosClima = await obterClima(latitude, longitude);

            //converte weather code para clima do Pokémon GO
            const tempoPoke = obterTempo(dadosClima.current_weather.weathercode);

            //obtém tipos de Pokémon com boost
            const boostPokemon = await obterBoosts(tempoPoke) || [];

            const texto = [
                `Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                `Pokemon Go Weather - ${tempoPoke}`,
                `Types that have Boost right now: ${boostPokemon.join(", ")}`
            ];

            //atualiza estado do output com os dados
            setOutput(texto);

            //seta os pokemons com boost
            setTiposBoost(boostPokemon);

        } catch (err) {
            setOutput('Erro', err);
        }
    };

    //ao selecionar um pokemon abre a página de detalhes do mesmo
    //location na Pokedex faz com que este redirecionamente funcione corretamente
    const handleClickPokemon = async (nome) => {
        await carregarPokemon(nome);
        abrirDetalhes(nome);
        redirecionar("/pokedex");
    };


    //filtra Pokémon que têm tipos com boost
    let pokemonsComBoost = pokemonList.filter(p =>
        p.types.some(t =>
            tiposBoost.some(bt => bt.toLowerCase() === t.toLowerCase())
        )
    );

    //define quais Pokémon aparecem no carrossel
    for (let i = 0; i < pokemonVisivel; i++) {
        if (pokemonsComBoost.length === 0) break;
        const index = (currentIndex + i) % pokemonsComBoost.length;
        pokemonMostra.push(pokemonsComBoost[index]);
    }

    //controlo do carrossel
    const nextSlide = (e) => {
        e.preventDefault();
        setCurrentIndex(prev => (prev + 1) % pokemonsComBoost.length);
    };

    const prevSlide = (e) => {
        e.preventDefault();
        setCurrentIndex(prev => (prev - 1 + pokemonsComBoost.length) % pokemonsComBoost.length);
    };

    if (!user) {
        return (
            <div className="pokedex-pag">
                <p className="fav">You need to be logged in to see your favorites.</p>
                <p className="fav">Redirecting to the login page in {countdown}...</p>
            </div>
        );
    }

    return (
        <>
            <div className="pokemon-go-container">
                <div className="pokemon-go-info">
                    <h1>Pokémon GO Weather</h1>
                    <p>
                        Discover the current weather and see which Pokémon are boosted under the corresponding weather conditions.
                        Click the button below to start the application and get your location and weather information.
                    </p>
                    <Button
                        onClick={getTempoInfo}
                        className="btn-simples-1">
                        Get Weather
                    </Button>
                </div>

                {/* Output textual */}
                <div className="pokemon-go-output">
                    {output.map((linha, i) => (
                        <p key={i}> {linha} </p>
                    ))}
                </div>
            </div>

            {/* Lista de Pokémon com boost */}
            {!selecaoPokemon && tiposBoost.length > 0 && (
                <div className="pokemon-boost-list">
                    <h2>Pokémon with boosted types:</h2>

                    {/* Controlo do carrossel */}
                    <div className="flow">
                        <Button
                            onClick={prevSlide}
                            className="btn-simples-2">
                            Back
                        </Button>

                        <Button
                            onClick={nextSlide}
                            className="btn-simples-2">
                            Next
                        </Button>
                    </div>

                    {/* Carrossel */}
                    <div className="carousel-container">
                        <div className="carousel-track">
                            {pokemonMostra.map(p => (
                                <PokemonCard
                                    key={p.name}
                                    nome={p.name}
                                    onClick={() => handleClickPokemon(p.name)} />
                            ))}
                        </div>
                    </div>

                    {pokemonsComBoost.length === 0 && (
                        <p className="sem-pokemon"> No Pokémon found for boosted types. </p>
                    )}
                </div>
            )}
        </>
    );
}

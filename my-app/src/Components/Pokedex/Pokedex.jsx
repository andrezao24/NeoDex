import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PokemonContext } from "../Contextos/PokemonContext";
import PokemonList from "./PokemonList";
import PokemonDetails from "./PokemonDetails";
import PokedexFilters from "./PokedexFilters";
import Button from "../UI/Button/Button";
import "./Pokedex.css";

const pokemonsPorPagina = 100;

export default function Pokedex() {
    const [countdown, setCountdown] = useState(3);

    const {
        selecaoPokemon, abrirDetalhes, fecharDetalhes,
        paginaAtual, setPaginaAtual, carregar, 
        listaFiltrada, user, redirecionar
    } = useContext(PokemonContext);

    const location = useLocation(); //permite acessar dados passados na navegação

    //abre automaticamente o Pokémon pelo state
    useEffect(() => {
        // verifica se a navegação trouxe um Pokémon no state
        if (location.state && location.state.pokemonSelecionado) {
            // abre automaticamente os detalhes desse Pokémon
            abrirDetalhes(location.state.pokemonSelecionado);
        }
    }, [location.state]); // corre sempre que o state da rota mudar

    //calcula quais Pokémon serão exibidos em cada página
    const getPokemonsPagina = () => {
        const inicio = (paginaAtual - 1) * pokemonsPorPagina;
        const fim = inicio + pokemonsPorPagina;
        return listaFiltrada.slice(inicio, fim);
    };

    //math ceill permite arrendondar para cima ficando 11 páginas ao contrário do uso de floor que ficaria 10 páginas
    const totalPaginas = Math.max(1, Math.ceil(listaFiltrada.length / pokemonsPorPagina));

    //trata de abrir os detalhes do pokemon
    const handleSelecionarPokemon = (nome) => {
        abrirDetalhes(nome);
    };

    //redireciona, como nos restantes componentes
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

    if (!user) {
        return (
            <div className="pokedex-pag">
                <p className="fav">You need to be logged in to see the Pokedex.</p>
                <p className="fav">Redirecting to the login page in {countdown}...</p>
            </div>
        );
    }

    return (
        <div className="pokedex-pag">
            {carregar && <p className="carregar-mensagem">Loading...</p>}

            {/*detalhes de um Pokémon selecionado */}
            {!carregar && selecaoPokemon && (
                <PokemonDetails
                    pokemon={selecaoPokemon}
                    onBack={fecharDetalhes}
                    onSelect={handleSelecionarPokemon}
                />
            )}

            {/*lista de Pokémon - filtros e paginação */}
            {!carregar && !selecaoPokemon && (
                <>
                    <PokedexFilters />

                    <PokemonList
                        pokemonList={getPokemonsPagina()}
                        onSelect={handleSelecionarPokemon}
                    />

                    <div className="paginas">
                        <Button
                            onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                            disabled={paginaAtual === 1}
                            className="btn-simples-1">
                            Back
                        </Button>

                        <span className="paginas-texto"> Page {paginaAtual} of {totalPaginas} </span>

                        <Button
                            onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                            disabled={paginaAtual === totalPaginas}
                            className="btn-simples-1">
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

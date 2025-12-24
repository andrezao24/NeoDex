import React from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonList({ pokemonList, onSelect }) {

    // se a lista não existir ou estiver vazia, mostra mensagem de erro
    if (!pokemonList || pokemonList.length === 0) {
        return (
            <div className="pokemon-lista">
                <p className="sem-pokemon">No Pokemon was found.</p>
            </div>
        );
    }

    return (
        <div className="pokemon-lista">
            {/* percorre a lista de Pokémon e cria um card para cada um */}
            {pokemonList.map(p => (
                <PokemonCard
                    key={p.name}
                    nome={p.name}
                    onClick={() => onSelect(p.name)}
                />
            ))}
        </div>
    );
}

import React, { useEffect, useState, useContext } from "react";
import { PokemonContext } from "../Contextos/PokemonContext";

export default function PokemonCard({ nome, onClick }) {
    const {
        carregarPokemon, favoritos,
        toggleFavorito, cap
    } = useContext(PokemonContext);
    const [dados, setDados] = useState(null);

    // carrega os dados do Pokémon - sprite, tipos, nome
    useEffect(() => {
        const carregar = async () => {
            const dadosPokemon = await carregarPokemon(nome);
            setDados(dadosPokemon);
        };
        carregar();
    }, [nome]);

    // handler do clique no card
    const handleClick = () => {
        if (onClick) onClick();
    };

    //carrega a sprite do pokemon
    let spriteConteudo;
    if (dados && dados.sprite) {
        spriteConteudo = (
            <img
                src={dados.sprite}
                className="sprite"
                title={cap(nome)}
            />
        );
    } else {
        spriteConteudo = <p> Loading image...</p>;
    }

    //define a imagem da estrela de favorito
    let imagem = "Assets/Favoritos/estrela.png";
    if (favoritos.includes(nome)) {
        imagem = "Assets/Favoritos/estrela_hover.png";
    }

    return (
        <div className="pokemon-card" onClick={handleClick}>
            {/* estrela favoritos */}
            <img
                src={imagem}
                className="favorito-estrela"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(nome);
                }}
            />

            {/* tipos do Pokémon */}
            <div className="tipos">
                {dados && dados.tipos && dados.tipos.map((t, i) => (
                    <img
                        key={i}
                        src={`/Assets/Icones/${t}.png`}
                        className="tipo-icone" 
                        title={cap(t)}/>))
                }
            </div>

            {/* info pokemon */}
            <div className="card-body">
                {spriteConteudo}
                <h3 className="nome-pokemon">{cap(nome)}</h3>
            </div>
        </div>
    );
}

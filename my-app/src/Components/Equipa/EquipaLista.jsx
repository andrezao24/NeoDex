import React, { useContext } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";
import Button from "../UI/Button/Button";
import EquipaFilters from "./EquipaFilters";

export default function EquipaList() {
    const {
        pokemonList, setOverlayAberta, setPokemonSelecionado, pesquisaEquipa,
        filtroTipoEquipa, filtroGeracaoEquipa, filtroRaridadeEquipa
    } = useContext(EquipaContext); //dados pelo contexto

    // aplica os diversos filtros
    let pokemonFiltradoEquipa = pokemonList.filter(p =>
        (!pesquisaEquipa.trim() ||
            p.name.toLowerCase().includes(pesquisaEquipa.toLowerCase()) || //pelo nome do pokemon
            p.id.toString().includes(pesquisaEquipa.toLowerCase()) //ou pelo id da pokedex nacional
        ) &&
        (!filtroTipoEquipa || (p.types || []).includes(filtroTipoEquipa)) && //por tipo
        (!filtroGeracaoEquipa || (p.generation && p.generation.toUpperCase() === filtroGeracaoEquipa.toUpperCase())) && //por geração
        (!filtroRaridadeEquipa || ((p.rarity || "Common") === filtroRaridadeEquipa)) //e raridade
    );

    return (
        <div className="overlay">
            {/* fechar o overlay */}
            <Button
                className="close-btn"
                onClick={() => setOverlayAberta(false)}>
                Close
            </Button>

            {/* filtros aplicáveis */}
            <EquipaFilters />

            <div className="lista-pokemon-overlay">
                {pokemonFiltradoEquipa.map(p => (
                    <div
                        key={p.name}
                        className="equipa-card-pokemon"
                        onClick={() => {
                            setPokemonSelecionado(p); // seleciona o Pokémon
                            setOverlayAberta(false);  // fecha o overlay
                        }}>

                        {/* icone dos tipos */}
                        <div className="equipa-tipos">
                            {(p.types && p.types.map((t, i) =>
                                <img key={i} className="equipa-tipo-icone" src={`/Assets/Icones/${t}.png`} />
                            ))}
                        </div>

                        {/* sprite e nome do Pokémon */}
                        <img className="sprite" src={p.sprite} />
                        <p>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</p>
                    </div>
                ))}
            </div>
        </div>
    );

}

import React, { useContext } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";
import EquipaRandomizer from "./EquipaRandomizer";
import Button from "../UI/Button/Button";

export default function EquipaAcoes() {
    const {
        equipa, equipaNome, mostrarMensagem, guardarEquipa
    } = useContext(EquipaContext); //dados pelo contexto

    const partilharEquipa = async () => {
        //apenas partilha se tiver nome
        if (!equipaNome.trim()) {
            mostrarMensagem("The team needs a name before sharing.");
            return;
        }

        //apenas partilha se tiver os 6 pokemons
        if (equipa.some(p => !p)) {
            mostrarMensagem("The team needs to have all 6 Pokémon in order to be shared.");
            return;
        }

        //monta o texto que será partilhado
        const texto = `My Pokemon Team: ${equipaNome}\n\n` + equipa.map((p, i) => `${i + 1}. ${p.name}`).join("\n");

        //partilha a equipa
        try {
            if (navigator.share) {
                await navigator.share({ title: "My Pokemon Team", text: texto });
            } else {
                await navigator.clipboard.writeText(texto); //copia a equipa para a área de transferência
                mostrarMensagem("Team copied to clipboard.");
            }
        } catch (err) {
            mostrarMensagem("Failed to share the team.");
        }
    };

    return (
        <div className="equipa-footer-actions">
            <Button onClick={guardarEquipa} className="btn-simples-2">
                Save Team
            </Button>
            <Button onClick={partilharEquipa} className="btn-simples-2">
                Share Team
            </Button>

            <EquipaRandomizer /> {/* componente que monta uma equipa Random*/}
        </div>
    );
}

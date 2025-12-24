import React, { useContext } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";

export default function EquipaInfo() {
    const { equipa } = useContext(EquipaContext);

    const tipos = [];
    const rarities = [];

    for (const p of equipa) {
        if (!p) continue;

        if (p.types) {
            for (const tipo of p.types) {
                if (!tipos.includes(tipo)) tipos.push(tipo);
            }
        }

        if (p.rarity && !rarities.includes(p.rarity)) {
            rarities.push(p.rarity);
        }
    }

    if (!equipa.some(p => p)) return null;

    return (
        <div className="equipa-info">
            <h3>Team Info</h3>

            {/* slots ocupados */}
            <p>Occupied slots: {equipa.filter(p => p).length} / 6 </p>

            {/* lista de Pokémon na equipa com os moves selecionados */}
            <p>Pokemon in the team:</p>
            <ul>
                {equipa
                    .filter(p => p)
                    .map((p, i) => (
                        <li key={i}>
                            <strong> {p.name.charAt(0).toUpperCase() + p.name.slice(1)} </strong>
                            {p.selectedMoves && p.selectedMoves.length > 0 && (
                                <ul>
                                    {p.selectedMoves.map((m, idx) => (
                                        <li key={idx}>{m.charAt(0).toUpperCase() + m.slice(1)}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))
                }
            </ul>

            {/* lista de tipos na equipa */}
            <p>Types in the team:</p>
            <ul>
                {tipos.map((t, i) => (
                    <li key={i}>{t.charAt(0).toUpperCase() + t.slice(1)}</li>
                ))}
            </ul>

            {/* lista de tipos na equipa */}
            <p>Rarities in the team:</p>
            <ul>
                {rarities.map((t, i) => (
                    <li key={i}>{t.charAt(0).toUpperCase() + t.slice(1)}</li>
                ))}
            </ul>
        </div>
    );
}

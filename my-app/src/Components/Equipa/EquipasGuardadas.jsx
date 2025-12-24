import React, { useContext } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";

export default function EquipaGuardadas() {
    const {
        equipasGuardadas, setEquipa,
        setEquipaNome, eliminarEquipa
    } = useContext(EquipaContext); //dados do contexto

    // se não tiver equipas guardadas
    if (!equipasGuardadas || equipasGuardadas.length === 0) {
        return <p className="sem-equipas-msg"> You don't have any team saved up. </p>;
    }

    // equipas guardadas
    return (
        <div className="equipa-guardada">
            {equipasGuardadas.map((e, idx) => (
                // cada equipa guardada como um cartão clicável
                <div
                    key={idx}
                    className="equipa-guardada-item"
                    onClick={() => {
                        setEquipa([...e.slots]);
                        setEquipaNome(e.nome);
                    }}>

                    {/* botão para eliminar a equipa*/}
                    <h4
                        className="btn-eliminar-equipa"
                        onClick={(event) => {
                            event.stopPropagation(); //evita disparar o click do cartão 
                            eliminarEquipa(idx)
                        }}>
                        Clear Team
                    </h4>

                    {/* nome da equipa */}
                    <h3>{e.nome}</h3>

                    {/* ver os Pokémon nos slots da equipa */}
                    <div className="equipa-guardada-slots">
                        {e.slots.map((p, i) =>
                            p && (
                                <div key={i} className="slot-guardada">
                                    <img src={p.sprite} alt={p.name} className="sprite-guardada" />
                                </div>
                            )
                        )}

                    </div>
                </div>
            ))}
        </div>
    );
}

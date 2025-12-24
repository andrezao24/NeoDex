import React, { useContext } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";
import Button from "../UI/Button/Button"

export default function EquipaSlots() {
    const {
        equipa, abrirOverlay, removerDoSlot,
        setPokemonSelecionado, setSlotSelecionado, cap
    } = useContext(EquipaContext);

    return (
        <div className="equipa-slots">
            {equipa.map((p, i) => (
                // Cada slot individual
                <div
                    key={i}
                    className="slot"
                    onClick={() => {
                        if (p) {
                            setPokemonSelecionado(p); // seleciona o Pokémon para detalhes
                            setSlotSelecionado(i); // marca o slot selecionado
                        } else {
                            abrirOverlay(i);
                        }
                    }}>

                    {p && (
                        <>
                            {/* sprite e nome do Pokémon */}
                            <img className="sprite" src={p.sprite} />
                            <p>{cap(p.name)}</p>

                            {/* botão para remover Pokémon do slot */}
                            <Button
                                className="remove-slot-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // evita disparar o clique do slot
                                    removerDoSlot(i);
                                }}>
                                ×
                            </Button>
                        </>
                    )}

                    {/* slot vazio */}
                    {!p && <p> Empty </p>}
                </div>
            ))}
        </div>
    );
}

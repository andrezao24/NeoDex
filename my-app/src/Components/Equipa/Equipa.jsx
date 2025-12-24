import React, { useContext, useState, useEffect } from "react";
import { EquipaContext } from "../Contextos/EquipaContext";
import EquipaSlots from "./EquipaSlots";
import EquipaGuardadas from "./EquipasGuardadas";
import EquipaList from "./EquipaLista";
import EquipaDetails from "./EquipaDetails";
import EquipaInfo from "./EquipaInfo";
import EquipaAcoes from "./EquipaAcoes";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input"
import "./Equipa.css";

export default function Equipa() {
    const [countdown, setCountdown] = useState(3);

    const {
        overlayAberta, pokemonSelecionado,
        equipaNome, mensagemErro, setEquipaNome,
        limparSlots, redirecionar, user
    } = useContext(EquipaContext); //dados pelo contexto

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
    //se não tiver logado começa countdown e sempre que user e redirecionar atualizar recomeça

    //render condicional - não logado
    if (!user) {
        return (
            <div className="pokedex-pag">
                <p className="fav">You need to be logged in to create or manage teams.</p>
                <p className="fav">Redirecting to the login page in {countdown}...</p>
            </div>
        );
    }

    //render principal
    return (
        <div className="equipa-page">
            <h2> Build your Team </h2>
            {mensagemErro && <p className="erro-msg">{mensagemErro}</p>}

            {/* input de nome de equipa e botão de função que limpa slots*/}
            <div className="equipa-header">
                <Input
                    type="text"
                    placeholder="Nome da equipa..."
                    value={equipaNome}
                    onChange={e => setEquipaNome(e.target.value)}
                    className="equipa-nome-input"
                />

                <Button onClick={limparSlots} className="btn-simples-2">
                    Limpar Slots
                </Button>
            </div>

            {/* componente que monta as slots*/}
            <EquipaSlots />

            {/* componente que utiliza - guardar, partilhar e também o componente EquipaRandomizer*/}
            <EquipaAcoes />

            {/* lista os pokemons e os moves de cada um*/}
            <EquipaInfo />

            {/* mostra as equipas guardadas do utilizador */}
            <EquipaGuardadas />

            {/* quando overlayaberta - componente EquipaList abre*/}
            {overlayAberta && <EquipaList />}

            {/* quando pokemonSelecionado - abre os detalhes */}
            {pokemonSelecionado && <EquipaDetails />}
        </div>
    );
}

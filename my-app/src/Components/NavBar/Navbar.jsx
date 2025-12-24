import React, { useContext } from 'react';
import Button from "../UI/Button/Button";
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from "../../firebase";
import { AuthContext } from "../Contextos/AuthContext";
import './Navbar.css';

export default function Navbar () {
    const { user } = useContext(AuthContext);
    const redirecionar = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            redirecionar('/');
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };

    const classeNome = (isActive, paginaAberta) => {
        let className = "nav-item " + paginaAberta;
        if (isActive) className += " active";
        return className;
    };

    let botaoLogIn = null;
    if (!user) {
        botaoLogIn = (
            <Button className="sign-in-button" onClick={() => redirecionar('/login')}>
                Log In
            </Button>
        );
    }

    let botaoLogOut = null;
    if (user) {
        botaoLogOut = (
            <Button className="log-out-button" onClick={handleLogout}>
                Log Out
            </Button>
        );
    }

    return (
        <nav className="navbar">
            <Link to="/">
                <img src="Assets/Navbar/logo_neodex_completo.png" alt="Logo" className="logo" />
            </Link>

            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => classeNome(isActive, "pagina-inicial")}>
                    <img src="Assets/Navbar/pagina_inicial.png" alt="Página Inicial" />
                    <span> Home </span>
                </NavLink>

                <NavLink to="/pokedex" className={({ isActive }) => classeNome(isActive, "pokedex")}>
                    <img src="Assets/Navbar/pokedex.png" alt="Pokédex" />
                    <span> Pokédex </span>
                </NavLink>

                <NavLink to="/ace" className={({ isActive }) => classeNome(isActive, "favoritos")}>
                    <img src="Assets/Navbar/favoritos.png" alt="Ace's" />
                    <span> Ace's </span>
                </NavLink>

                <NavLink to="/equipa" className={({ isActive }) => classeNome(isActive, "equipa")}>
                    <img src="Assets/Navbar/equipa.png" alt="Team" />
                    <span> Team </span>
                </NavLink>

                <NavLink to="/tcg" className={({ isActive }) => classeNome(isActive, "tcg")}>
                    <img src="Assets/Navbar/tcg.png" alt="TCG" />
                    <span> TCG </span>
                </NavLink>

                <NavLink to="/go" className={({ isActive }) => classeNome(isActive, "go")}>
                    <img src="Assets/Navbar/go.png" alt="GO!" />
                    <span> GO! </span>
                </NavLink>
            </div>

            {botaoLogOut}

            {botaoLogIn}
        </nav>
    );
};

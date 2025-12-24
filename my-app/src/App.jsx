import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/NavBar/Navbar';
import PaginaInicial from './Components/PaginaInicial/PaginaInicial';
import Pokedex from './Components/Pokedex/Pokedex';
import Equipa from './Components/Equipa/Equipa';
import Favoritos from './Components/Favoritos/Favoritos';
import PokemonGo from './Components/PokemonGo/PokemonGo';
import TCG from './Components/TCG/TCG';
import Login from './Components/LogIn/Login';
import CriarConta from './Components/CriarConta/CriarConta';
import './firebase';

function App() {
    return (
        <div className='container'>
            <Navbar />

            <Routes>
                <Route path="/" element={<PaginaInicial />} />
                <Route path="/pokedex" element={<Pokedex />} />
                <Route path="/equipa" element={<Equipa />} />
                <Route path="/ace" element={<Favoritos />} />
                <Route path="/go" element={<PokemonGo />} />
                <Route path="/tcg" element={<TCG />} />
                <Route path="/login" element={<Login />} />
                <Route path="/criar" element={<CriarConta />} />
            </Routes>
        </div>
    );
}

export default App;

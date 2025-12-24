import React from 'react';
import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom';
import './PaginaInicial.css';

export default function PaginaInicial() {
    return (
        <>
            <div>
                <div className='primeira-div'>
                    <div className="col-container">
                        <div className="col-text">
                            <h1>Welcome to NeoDex</h1>
                            <h3>The new generation of the Pokédex</h3>

                            <p className='p-1'>
                                NeoDex is the next generation of the Pokédex, an interactive and
                                modern experience, completely reimagined from a true Pokémon fan to
                                true Pokémon fans. Explore NeoDex and enjoy this real Pokémon experience!
                            </p>

                            <Link to="/pokedex">
                                <Button className="btn-1"> Explore the Pokédex </Button>
                            </Link>
                        </div>

                        <div className="col-image">
                            <img src="Assets/Pagina_Inicial/charizard.png" alt="Pokédex" />
                        </div>
                    </div>
                </div>

                <div className='segunda-div'>
                    <div className="col-container">
                        <div className="col-text">
                            <h1>Build Your Team</h1>
                            <p className='p-2'>
                                Choose your favorite Pokémon and assemble a team capable of defeating
                                the 7 gyms, overcoming Victory Road, and destroying the Elite Four!
                                Rise to the top of the Pokémon League in any region, from Kanto to Alola.
                            </p>

                            <Link to="/equipa">
                                <Button className="btn-2"> Build Your Team </Button>
                            </Link>
                        </div>

                        <div className="col-image-left">
                            <img src="Assets/Pagina_Inicial/team.png" alt="Team" />
                        </div>
                    </div>
                </div>

                <div className='terceira-div'>
                    <div className="col-container">
                        <div className="col-text">
                            <h1>Search for your favorite Pokemon Cards</h1>
                            <p className='p-2'>
                                Discover every Pokémon card and explore the world of the Pokémon
                                TCG! Uncover rare and hidden cards, dive into every set and
                                expansion, and uncover the stories behind each collectible. Explore,
                                collect, and become the ultimate TCG adventurer!
                            </p>

                            <Link to="/tcg">
                                <Button className="btn-3"> Discover TCG </Button>
                            </Link>
                        </div>

                        <div className="col-image">
                            <img src="Assets/Pagina_Inicial/tcg.png" alt="Team" />
                        </div>
                    </div>
                </div>

                <div className='quarta-div'>
                    <div className="col-container">
                        <div className="col-text">
                            <h1>Pokémon GO Insights</h1>
                            <p className='p-4'>
                                Get real-time information about Pokémon GO! Find out which Pokémon types
                                are boosted by the current weather and see examples of each one!
                            </p>

                            <Link to="/go">
                                <Button className="btn-4"> GO! </Button>
                            </Link>
                        </div>

                        <div className="col-image-left">
                            <img src="Assets/Pagina_Inicial/go.png" alt="Pokémon GO" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


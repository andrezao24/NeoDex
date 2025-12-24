import { useContext } from "react";
import { PokemonContext } from "../Contextos/PokemonContext";
import "./TCG.css";

export default function TCGGrid({ cartas }) {
    const { toggleCartaFavorita, cartasFavoritas } = useContext(PokemonContext);

    if (!cartas || cartas.length === 0) return null;

    const cartasComEstrela = cartas
        .filter(carta => carta.image) // só cartas com imagem
        .map(carta => {
            let estrela = null;

            //verifica se a carta está nas favoritas
            const isFavorito = cartasFavoritas.some(
                fav => fav.id === carta.id && fav.lingua === carta.lingua
            );

            //define a imagem da estrela
            let imagem = "/Assets/Favoritos/estrela.png";
            if (isFavorito) {
                imagem = "/Assets/Favoritos/estrela_hover.png";
            }

            //elemento estrela manipulável
            estrela = (
                <img
                    src={imagem}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCartaFavorita(carta);
                    }}
                    className="estrela-tcgslider"
                />
            );

            return { ...carta, estrela };
        });

    return (
        <div className="card-grid">
            {cartasComEstrela.map(carta => (
                <div
                    key={`${carta.id}_${carta.lingua}`} //garante que cada carta tenha uma key diferente
                    className="card-item"
                >

                    <img
                        className="card-image"
                        src={`${carta.image}/high.png`}
                        title={carta.name}
                    />

                    <div className="card-meta">
                        <div className="nome-e-estrela">
                            <span className="nome-carta">{carta.name}</span>
                            {carta.estrela}
                        </div>
                        <p className="meta-row">Card ID: {carta.id}</p>
                    </div>
                    
                </div>
            ))}
        </div>
    );
}

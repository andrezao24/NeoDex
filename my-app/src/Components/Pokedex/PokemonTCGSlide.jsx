import { useRef, useState, useContext } from "react";
import Button from "../UI/Button/Button";
import { PokemonContext } from "../Contextos/PokemonContext";
import "./Pokedex.css"

export default function PokemonTCGSlide({ cartas, carregarCartas, setLingua, lingua }) {
    const { toggleCartaFavorita, cartasFavoritas } = useContext(PokemonContext);

    //controlo do carrossel de cartas
    const carrosselRef = useRef(null);
    const [indice, setIndice] = useState(0);

    //definição das línguas e bandeiras - manipular pedido à api
    const langs = [
        {
            code: "en",
            flag: "https://flagsapi.com/US/flat/64.png",
            label: "English"
        },
        {
            code: "ja",
            flag: "https://flagsapi.com/JP/flat/64.png",
            label: "Japanese"
        },
        {
            code: "pt",
            flag: "https://flagsapi.com/PT/flat/64.png",
            label: "Portuguese"
        },
        {
            code: "zh-tw",
            flag: "https://flagsapi.com/CN/flat/64.png",
            label: "Chinese"
        }
    ];


    //índice da língua selecionada - manipular o slide das bandeiras
    const selectedIndex = langs.findIndex(l => l.code === lingua);

    //controla movimento carrossel
    const slide = (direcao) => {
        if (!carrosselRef.current || cartas.length === 0) return;

        const totalSlides = cartas.length;
        const passos = 3; //cartas movidas por clique
        let novoIndice = indice + direcao * passos;

        //ajusta o índice 
        if (novoIndice < 0)
            novoIndice = totalSlides + (novoIndice % totalSlides);

        if (novoIndice >= totalSlides)
            novoIndice = novoIndice % totalSlides;

        //atualiza estado
        setIndice(novoIndice);

        const container = carrosselRef.current; //utiliza o Ref para manipular diretamente o DOM do carrossel
        if (!container.firstChild) return; //verifica se tem pelo menos UMA carta

        //define o quanto o carrossel anda em cada movimento
        const slideWidth = container.firstChild.offsetWidth + 16;

        //controla como o slider anda
        container.scrollTo({ left: novoIndice * slideWidth, behavior: "smooth" });
    };

    const cartasComEstrela = cartas.map(carta => {
        let estrela = null;

        //verifica se a carta está nas favoritas
        const isFavorito = cartasFavoritas.some(
            fav => fav.id === carta.id && fav.lingua === carta.lingua
        );

        //define a imagem da estrela de favorito
        let imagem = "/Assets/Favoritos/estrela.png";
        if (isFavorito) {
            imagem = "/Assets/Favoritos/estrela_hover.png";
        }

        //elemento do like manipulavel 
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

        return { ...carta, estrela }; //retorna cartas com estrela
    });

    return (
        <div className="carrossel-container">
            {carregarCartas && <p className="loading-msg">Loading cards...</p>}

            {!carregarCartas && (
                <div className="carrossel-div">
                    <div className="flow">
                        {/* Botão voltar slides */}
                        <Button onClick={() => slide(-1)} className="btn-simples-2">
                            &laquo;
                        </Button>

                        {/* Slider de línguas */}
                        <div className="slider-bg-details">
                            <div
                                className="slider-indicator"
                                style={{ transform: `translateX(${selectedIndex * 100}%)` }}
                            />
                            {langs.map(l => (
                                <Button
                                    key={l.code}
                                    className="flag-btn"
                                    onClick={() => setLingua(l.code)}
                                >
                                    <img src={l.flag} title={l.label} />
                                </Button>
                            ))}
                        </div>

                        {/* Botão avançar slides */}
                        <Button onClick={() => slide(1)} className="btn-simples-2">
                            &raquo;
                        </Button>
                    </div>

                    {/* Conteúdo principal do carrossel */}
                    {cartas.length === 0 && (
                        <p className="sem-pokemon">No Cards were found</p>
                    )}

                    {cartas.length > 0 && (
                        <div className="carrossel-cartas" ref={carrosselRef}>
                            {cartasComEstrela.map(carta => (
                                <div
                                    key={`${carta.id}_${carta.lingua}`}
                                    className="carta-slide"
                                >
                                    <img
                                        src={`${carta.image}/high.png`}
                                        title={carta.name}
                                        className="carta-pokemon"
                                    />
                                    <div className="carta-info">
                                        <span className="nome-da-carta">{carta.name}</span>
                                        {carta.estrela}
                                    </div>
                                    <p className="carta-id-tcgslider">Card ID: {carta.id}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

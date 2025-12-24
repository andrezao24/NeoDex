import React, { useContext, useEffect, useState } from "react";
import './TCG.css';
import TCGFilters from "./TCGFilters.jsx";
import Button from "../UI/Button/Button.jsx";
import TCGGrid from "./TCGGrid";
import { PokemonContext } from "../Contextos/PokemonContext.jsx";

export default function ty6kk() {
    //cartas
    const [todasCartas, setTodasCartas] = useState([]);
    const [carregar, setCarregar] = useState(false);
    const [erro, setErro] = useState(null);
    const cartasPorPagina = 100;
    const [pagina, setPagina] = useState(1);

    //filtros e seleção
    const [filtros, setFiltros] = useState({ nome: "" });
    const [lingua, setLingua] = useState("en");

    const [countdown, setCountdown] = useState(3);
    const { redirecionar, user } = useContext(PokemonContext);

    //useEffect que atualiza sempre que a linguagem escolhida mudar
    //faz pedidos à api TCGDex com base no idioma escolhido
    useEffect(() => {
        const carregarTCG = async () => {
            setCarregar(true);
            setErro(null);

            try {
                const resp = await fetch(`https://api.tcgdex.net/v2/${lingua}/cards`);
                const dados = await resp.json();

                //garante que cards é um array - ou de dados.cards ou de dados diretamente
                let cards = [];
                if (dados.cards && dados.cards.length) {
                    cards = dados.cards;
                } else if (dados && dados.length) {
                    cards = dados;
                }

                //faz set às cartas recebidas para as listar
                setTodasCartas(cards);

            } catch (err) {
                setErro(err.message);

            } finally {
                setCarregar(false);
            }
        };

        carregarTCG();
    }, [lingua]); //sempre que o idioma muda

    //filtro que possibilita procurar por nome do pokemon, localID - id da carta - ou id - no set que origina;
    //se o filtro estiver vazio, retorna todas as cartas
    const nomeLower = filtros.nome.trim().toLowerCase();
    let cartasFiltradas = [];

    if (todasCartas) {
        cartasFiltradas = todasCartas.filter(c => {
            return !nomeLower ||
                (c.name && c.name.toLowerCase().includes(nomeLower)) ||
                (c.localId && String(c.localId).toLowerCase().includes(nomeLower)) ||
                (c.id && String(c.id).toLowerCase().includes(nomeLower));
        });
    }

    //100 cartas por página
    //é falho visto que a api retorna muitas cartas sem uma imagem (não listo essas)
    const totalPaginas = Math.max(1, Math.ceil(cartasFiltradas.length / cartasPorPagina));

    useEffect(() => {
        setPagina(1);
    }, [filtros.nome]); //quando filtros.nome mudar é chamado e atualiza a página para 1

    //calcula o indice da página
    const indiceAtual = (pagina - 1) * cartasPorPagina;
    const cartasPagina = [];
    for (let i = indiceAtual; i < indiceAtual + cartasPorPagina && i < cartasFiltradas.length; i++) {
        cartasPagina.push(cartasFiltradas[i]);
    }

    //redireciona, como nos restantes componentes
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

    if (!user) {
        return (
            <div className="pokedex-pag">
                <p className="fav">You need to be logged in to see the Pokedex.</p>
                <p className="fav">Redirecting to the login page in {countdown}...</p>
            </div>
        );
    }

    return (
        <div className="tcg-tracker">

            {/* passagem de props para atualizar filtros e lingua conforme escolhido*/}
            <TCGFilters
                filtros={filtros}
                atualizarFiltro={valor => setFiltros({ nome: valor })}
                lingua={lingua}
                mudarLingua={setLingua}
            />

            <div>
                {carregar && <p> Loading cards...</p>}
                {erro && <p className="error">Error: {erro}</p>}

                {/* listagem cartas*/}
                <TCGGrid
                    cartas={cartasPagina}
                />

                {/* paginação */}
                <div className="paginas">
                    <Button
                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                        disabled={pagina === 1}
                        className="btn-simples-1">
                        Back
                    </Button>

                    <span className="paginas-texto"> Page {pagina} of {totalPaginas} </span>

                    <Button
                        onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                        disabled={pagina === totalPaginas}
                        className="btn-simples-1">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

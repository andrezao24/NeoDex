import React, { useContext } from "react";
import Input from "../UI/Input/Input";
import Select from "../UI/Select/Select";
import Button from "../UI/Button/Button";
import { PokemonContext } from "../Contextos/PokemonContext";

export default function PokedexFilters() {
    const {
        pesquisa, setPesquisa, filtroTipo, setFiltroTipo,
        filtroGeracao, setFiltroGeracao, filtroRaridade, setFiltroRaridade,
        tipos, geracoes, raridades, limparFiltros
    } = useContext(PokemonContext);

    return (
        <div className="filtros">
            {/* pesquisa por nome */}
            <Input
                className="pesquisar"
                value={pesquisa}
                onChange={e => setPesquisa(e.target.value)}
                placeholder="Search"
            />

            {/* filtro por tipo */}
            <Select
                className="filtro-tipos"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                options={tipos}
                placeholder="All Types"
            />

            {/* filtro por geração */}
            <Select
                className="filtro-geracao"
                value={filtroGeracao}
                onChange={e => setFiltroGeracao(e.target.value)}
                options={geracoes.map(g => g.toUpperCase())}
                placeholder="All Generations"
            />

            {/* filtro por raridade */}
            <Select
                className="filtro-raridade"
                value={filtroRaridade}
                onChange={e => setFiltroRaridade(e.target.value)}
                options={raridades}
                placeholder="All Rarities"
            />

            {/* limpa todos os filtros */}
            <Button className="limpar-filtros" onClick={limparFiltros}>
                Clear Filters
            </Button>
        </div>
    );
}

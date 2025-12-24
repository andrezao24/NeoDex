import React, { useContext } from "react";
import Input from "../UI/Input/Input";
import Select from "../UI/Select/Select";
import Button from "../UI/Button/Button";
import { EquipaContext } from "../Contextos/EquipaContext";

export default function EquipaFilters() {
    const {
        pesquisaEquipa, setPesquisaEquipa,
        filtroTipoEquipa, setFiltroTipoEquipa,
        filtroGeracaoEquipa, setFiltroGeracaoEquipa,
        filtroRaridadeEquipa, setFiltroRaridadeEquipa,
        limparFiltros, tipos, geracoes, raridades
    } = useContext(EquipaContext); //dados pelo contexto

    return (
        <div className="filtros">
            {/* pesquisa por nome */}
            <Input
                className="pesquisar"
                value={pesquisaEquipa}
                onChange={e => setPesquisaEquipa(e.target.value)}
                placeholder="Search Pokémon..."
            />

            {/* filtro por tipo */}
            <Select
                className="filtro-tipos"
                value={filtroTipoEquipa}
                onChange={e => setFiltroTipoEquipa(e.target.value)}
                options={tipos}
                placeholder="All Types"
            />

            {/* filtro por geração */}
            <Select
                className="filtro-geracao"
                value={filtroGeracaoEquipa}
                onChange={e => setFiltroGeracaoEquipa(e.target.value)}
                options={geracoes.map(g => g.toUpperCase())}
                placeholder="All Generations"
            />

            {/* filtro por raridade */}
            <Select
                className="filtro-raridade"
                value={filtroRaridadeEquipa}
                onChange={e => setFiltroRaridadeEquipa(e.target.value)}
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

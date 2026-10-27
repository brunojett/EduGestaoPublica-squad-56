import { useState } from "react";
import MatrizCard from "../components/MatrizCard.jsx";
import Icone from "../components/Icone.jsx";
import { cursos, matrizes } from "../data/matrizes.js";
import "../styles/matrizes.css";

export default function ListagemMatrizesScreen() {
  const [cursoSelecionado, setCursoSelecionado] = useState("todos");
  const matrizesFiltradas = matrizes.filter(
    (matriz) =>
      cursoSelecionado === "todos" || matriz.cursoId === cursoSelecionado,
  );

  return (
    <main className="matrizes-page" id="conteudo-principal">
      <header className="matrizes-header">
        <div>
          <p className="matrizes-header__categoria">GESTÃO ACADÊMICA</p>
          <h1>Matrizes Curriculares</h1>
        </div>
        <button
          type="button"
          className="adicionar-matriz"
          disabled
          aria-label="Adicionar matriz indisponível"
          title="Cadastro de matrizes indisponível nesta entrega"
        >
          +
        </button>
      </header>

      <div className="filtro-curso">
        <label htmlFor="curso">Filtrar por curso</label>
        <select
          id="curso"
          value={cursoSelecionado}
          onChange={(event) => setCursoSelecionado(event.target.value)}
        >
          <option value="todos">Todos os cursos</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.nome}
            </option>
          ))}
        </select>
      </div>

      <div
        className="matrizes-contador"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <h2>Matrizes cadastradas</h2>
        <span>{matrizesFiltradas.length}</span>
      </div>

      {matrizesFiltradas.length > 0 ? (
        <ul className="matrizes-lista" aria-label="Matrizes cadastradas">
          {matrizesFiltradas.map((matriz) => (
            <MatrizCard
              key={matriz.id}
              matriz={matriz}
              curso={cursos.find((curso) => curso.id === matriz.cursoId)}
            />
          ))}
        </ul>
      ) : (
        <section className="matrizes-vazio" aria-label="Resultado da pesquisa">
          <span className="matrizes-vazio__icone">
            <Icone nome="vazio" />
          </span>
          <p>Nenhuma matriz cadastrada</p>
        </section>
      )}
    </main>
  );
}

import Icone from "./Icone.jsx";

export default function MatrizCard({ matriz, curso }) {
  const quantidade = matriz.quantidadeDisciplinas;

  return (
    <li>
      <button
        type="button"
        className="matriz-card"
        onClick={() => console.log("Matriz selecionada:", matriz)}
      >
        <span className="matriz-card__topo">
          <span className="matriz-card__simbolo">
            <Icone nome="camadas" />
          </span>
          <Icone nome="seta" className="matriz-card__seta" />
        </span>
        <span className="matriz-card__nome">{matriz.nome}</span>
        <span className="matriz-card__curso">{curso.nome}</span>
        <span className="matriz-card__disciplinas">
          <Icone nome="livro" />
          {quantidade} {quantidade === 1 ? "disciplina" : "disciplinas"}
        </span>
      </button>
    </li>
  );
}

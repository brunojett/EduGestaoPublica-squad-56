import React, { useState } from "react";
import FormularioTurmaScreen from "./pages/FormularioTurmaScreen.jsx";
import Icone from "./components/Icone.jsx";
import ListagemMatrizesScreen from "./pages/ListagemMatrizesScreen.jsx";

const navegacao = [
  { nome: "Início", icone: "inicio" },
  { nome: "Agenda", icone: "calendario" },
  { nome: "Pedidos", icone: "pedidos" },
  { nome: "Mais", icone: "mais" },
];

export default function App() {
  const [tela, setTela] = useState("matrizes");
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="marca" aria-label="RiseUP">
          <span className="marca__icone" aria-hidden="true">
            r
          </span>
          <span>
            rise<span className="marca__azul">up •</span>
          </span>
        </div>
        <div className="avatar" aria-label="Marina Costa">
          MC
        </div>
      </header>
      <nav className="turma-navegacao" aria-label="Gestão acadêmica">
        <button type="button" aria-current={tela === "matrizes" ? "page" : undefined}
          onClick={() => setTela("matrizes")}>Matrizes curriculares</button>
        <button type="button" aria-current={tela === "turma" ? "page" : undefined}
          onClick={() => setTela("turma")}>Cadastrar turma</button>
      </nav>
      {tela === "turma" ? (
        <FormularioTurmaScreen onCancelar={() => setTela("matrizes")} />
      ) : (
        <ListagemMatrizesScreen />
      )}
      <nav className="app-rodape" aria-label="Navegação do protótipo">
        {navegacao.map((item) => (
          <button
            key={item.nome}
            type="button"
            className={
              item.nome === "Mais"
                ? "app-rodape__item app-rodape__item--atual"
                : "app-rodape__item"
            }
            disabled
            title="Navegação para outros módulos fora desta entrega"
          >
            <Icone nome={item.icone} />
            <span>{item.nome}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

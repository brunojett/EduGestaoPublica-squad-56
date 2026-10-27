import Icone from "./components/Icone.jsx";
import FilaSolicitacoesScreen from "./pages/FilaSolicitacoesScreen.js";

const navegacao = [
  { nome: "Início", icone: "inicio" },
  { nome: "Agenda", icone: "calendario" },
  { nome: "Pedidos", icone: "pedidos" },
  { nome: "Mais", icone: "mais" },
];

export default function App() {
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
      <FilaSolicitacoesScreen />
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

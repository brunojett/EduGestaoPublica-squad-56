import React, { useState } from "react";
import FlatList from "../components/FlatList.jsx";
import "../styles/fila-solicitacoes.css";

const h = React.createElement;

const propostas = [
  {
    id: 1,
    professor: "Ana Paula Ribeiro",
    tipo: "Declaração de vínculo",
    dados: "Nome completo, matrícula e período letivo",
    data: "12/08/2024",
  },
  {
    id: 2,
    professor: "Carlos Henrique Souza",
    tipo: "Histórico escolar",
    dados: "Matrícula, curso e disciplinas concluídas",
    data: "19/08/2024",
  },
  {
    id: 3,
    professor: "Mariana Oliveira Santos",
    tipo: "Comprovante de frequência",
    dados: "Turma, disciplina e percentual de presença",
    data: "28/08/2024",
  },
  {
    id: 4,
    professor: "Lucas Mendes Costa",
    tipo: "Solicitação de aproveitamento",
    dados: "Disciplina de origem, instituição e ementa",
    data: "04/09/2024",
  },
];

function PropostaCard({ proposta, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(proposta);
    }
  };

  return h(
    "article",
    {
      className: "solicitacao-card solicitacao-card--clicavel",
      role: "button",
      tabIndex: 0,
      onClick: () => onSelect(proposta),
      onKeyDown: handleKeyDown,
      "aria-label": `Abrir detalhes da solicitação de ${proposta.professor}`,
    },
    h(
      "div",
      { className: "solicitacao-card__cabecalho" },
      h(
        "span",
        { className: "solicitacao-card__indice", "aria-hidden": "true" },
        String(proposta.id).padStart(2, "0"),
      ),
      h(
        "time",
        { className: "solicitacao-card__data", dateTime: "2024-08-12" },
        proposta.data,
      ),
    ),
    h(
      "div",
      { className: "solicitacao-card__conteudo" },
      h(
        "div",
        { className: "solicitacao-card__titulo" },
        h(
          "div",
          null,
          h("h2", null, proposta.professor),
          h("p", { className: "solicitacao-card__tipo" }, proposta.tipo),
        ),
        h("span", { className: "solicitacao-card__status" }, "Pendente"),
      ),
      h(
        "div",
        { className: "solicitacao-card__dados" },
        h("span", null, "Dados solicitados"),
        h("strong", null, proposta.dados),
      ),
    ),
  );
}

function ListaVazia() {
  return h(
    "section",
    { className: "solicitacoes-vazia", "aria-live": "polite" },
    h("span", { className: "solicitacoes-vazia__icone", "aria-hidden": "true" }, "—"),
    h("p", null, "Nenhuma solicitação pendente"),
  );
}

function DetalheSolicitacao({ proposta, onBack }) {
  return h(
    "main",
    { className: "fila-page detalhe-page", id: "conteudo-principal" },
    h(
      "button",
      { type: "button", className: "detalhe-voltar", onClick: onBack },
      "← Voltar para solicitações",
    ),
    h(
      "header",
      { className: "detalhe-header" },
      h("p", { className: "fila-header__categoria" }, "DETALHE DA SOLICITAÇÃO"),
      h("h1", null, proposta.tipo),
      h("span", { className: "solicitacao-card__status" }, "Pendente"),
    ),
    h(
      "section",
      { className: "detalhe-card", "aria-label": "Detalhes da solicitação" },
      h(
        "div",
        { className: "detalhe-card__identificacao" },
        h("span", { className: "solicitacao-card__indice", "aria-hidden": "true" }, String(proposta.id).padStart(2, "0")),
        h("div", null, h("span", null, "Professor"), h("strong", null, proposta.professor)),
      ),
      h(
        "dl",
        { className: "detalhe-dados" },
        h("div", null, h("dt", null, "Tipo de solicitação"), h("dd", null, proposta.tipo)),
        h("div", null, h("dt", null, "Dados solicitados"), h("dd", null, proposta.dados)),
        h("div", null, h("dt", null, "Data de envio"), h("dd", null, proposta.data)),
      ),
    ),
  );
}

export default function FilaSolicitacoesScreen() {
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  if (solicitacaoSelecionada) {
    return h(DetalheSolicitacao, {
      proposta: solicitacaoSelecionada,
      onBack: () => setSolicitacaoSelecionada(null),
    });
  }

  return h(
    "main",
    { className: "fila-page", id: "conteudo-principal" },
    h(
      "header",
      { className: "fila-header" },
      h(
        "div",
        null,
        h("p", { className: "fila-header__categoria" }, "GESTÃO ACADÊMICA"),
        h("h1", null, "Solicitações pendentes"),
        h(
          "p",
          { className: "fila-header__descricao" },
          "Acompanhe as propostas que aguardam análise.",
        ),
      ),
      h(
        "span",
        {
          className: "fila-header__contador",
          "aria-label": `${propostas.length} solicitações pendentes`,
        },
        String(propostas.length).padStart(2, "0"),
      ),
    ),
    h("p", { className: "fila-ordem" }, "Ordenadas da mais antiga para a mais recente"),
    h(FlatList, {
      data: propostas,
      renderItem: ({ item }) => h(PropostaCard, { proposta: item, onSelect: setSolicitacaoSelecionada }),
      keyExtractor: (item) => item.id,
      className: "solicitacoes-lista",
      "aria-label": "Solicitações pendentes",
      ListEmptyComponent: h(ListaVazia),
    }),
  );
}

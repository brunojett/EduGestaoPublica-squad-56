import React from "react";
import "../styles/fila-solicitacoes.css";

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

function PropostaCard({ proposta }) {
  return React.createElement(
    "li",
    { className: "solicitacao-card" },
    React.createElement(
      "div",
      { className: "solicitacao-card__cabecalho" },
      React.createElement(
        "span",
        { className: "solicitacao-card__indice", "aria-hidden": "true" },
        String(proposta.id).padStart(2, "0"),
      ),
      React.createElement(
        "time",
        { className: "solicitacao-card__data", dateTime: "2024-08-12" },
        proposta.data,
      ),
    ),
    React.createElement(
      "div",
      { className: "solicitacao-card__conteudo" },
      React.createElement("h2", null, proposta.professor),
      React.createElement(
        "p",
        { className: "solicitacao-card__tipo" },
        proposta.tipo,
      ),
      React.createElement(
        "div",
        { className: "solicitacao-card__dados" },
        React.createElement("span", null, "Dados solicitados"),
        React.createElement("strong", null, proposta.dados),
      ),
    ),
  );
}

export default function FilaSolicitacoesScreen() {
  return React.createElement(
    "main",
    { className: "fila-page", id: "conteudo-principal" },
    React.createElement(
      "header",
      { className: "fila-header" },
      React.createElement(
        "div",
        null,
        React.createElement("p", { className: "fila-header__categoria" }, "GESTÃO ACADÊMICA"),
        React.createElement("h1", null, "Solicitações pendentes"),
        React.createElement(
          "p",
          { className: "fila-header__descricao" },
          "Acompanhe as propostas que aguardam análise.",
        ),
      ),
      React.createElement(
        "span",
        { className: "fila-header__contador", "aria-label": "4 solicitações pendentes" },
        "04",
      ),
    ),
    React.createElement(
      "p",
      { className: "fila-ordem" },
      "Ordenadas da mais antiga para a mais recente",
    ),
    React.createElement(
      "ol",
      { className: "solicitacoes-lista", "aria-label": "Solicitações pendentes" },
      propostas.map((proposta) =>
        React.createElement(PropostaCard, { key: proposta.id, proposta }),
      ),
    ),
  );
}

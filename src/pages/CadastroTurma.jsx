
import { useState } from "react";
import "../styles/cadastroTurma.css";

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

const cursos = [
  "Administração Pública",
  "Gestão Pública",
  "Direito",
  "Contabilidade",
];

const disciplinas = [
  "Políticas Públicas",
  "Gestão de Pessoas",
  "Orçamento Público",
  "Ética no Serviço Público",
];

const professores = [
  "Ana Souza",
  "Carlos Lima",
  "Mariana Costa",
  "Rafael Santos",
];

const turnos = ["Manhã", "Tarde", "Noite"];

const formularioVazio = {
  codigo: "",
  vagas: "",
  curso: "",
  disciplina: "",
  professor: "",
  turno: "",
  dias: [],
};

export default function CadastroTurma() {
  const [formulario, setFormulario] = useState(formularioVazio);
  const [turmas, setTurmas] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function atualizarCampo(evento) {
    const { name, value } = evento.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));

    setErro("");
    setSucesso("");
  }

  function alternarDia(dia) {
    setFormulario((atual) => ({
      ...atual,
      dias: atual.dias.includes(dia)
        ? atual.dias.filter((item) => item !== dia)
        : [...atual.dias, dia],
    }));

    setErro("");
    setSucesso("");
  }

  function cancelar() {
    setFormulario({ ...formularioVazio, dias: [] });
    setErro("");
    setSucesso("");
  }

  function salvar(evento) {
    evento.preventDefault();

    if (
      !formulario.codigo.trim() ||
      formulario.vagas === "" ||
      !formulario.curso ||
      !formulario.disciplina ||
      !formulario.professor ||
      !formulario.turno ||
      formulario.dias.length === 0
    ) {
      setErro("Preencha todos os campos e selecione pelo menos um dia.");
      setSucesso("");
      return;
    }

    const vagas = Number(formulario.vagas);

    if (!Number.isInteger(vagas) || vagas <= 0) {
      setErro("O limite de vagas deve ser um inteiro maior que zero.");
      setSucesso("");
      return;
    }

    const codigo = formulario.codigo.trim();

    if (
      turmas.some(
        (turma) => turma.codigo.toLowerCase() === codigo.toLowerCase()
      )
    ) {
      setErro("Já existe uma turma cadastrada com esse código.");
      setSucesso("");
      return;
    }

    const novaTurma = {
      ...formulario,
      codigo,
      vagas,
      dias: [...formulario.dias],
    };

    setTurmas((atuais) => [...atuais, novaTurma]);
    setFormulario({ ...formularioVazio, dias: [] });
    setErro("");
    setSucesso("Turma cadastrada com sucesso!");
  }

  return (
    <main className="cadastro-turma">
      <header className="turma-cabecalho">
        <div className="turma-logo">EP</div>

        <div>
          <span className="turma-identificacao">EDUGESTÃO PÚBLICA</span>
          <h1>Gestão Acadêmica</h1>
        </div>

        <span className="turma-etiqueta">Sprint 5</span>
      </header>

      <section className="turma-card">
        <div className="turma-titulo">
          <div>
            <span className="turma-identificacao">CADASTRO</span>
            <h2>Formulário de Turma</h2>
            <p>Informe os dados para cadastrar uma nova turma.</p>
          </div>

          <span className="turma-obrigatorio">* Obrigatório</span>
        </div>

        {erro && (
          <div className="turma-mensagem turma-erro" role="alert">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="turma-mensagem turma-sucesso" role="status">
            {sucesso}
          </div>
        )}

        <form onSubmit={salvar}>
          <div className="turma-grade">
            <label className="turma-campo">
              Código da turma *
              <input
                name="codigo"
                value={formulario.codigo}
                onChange={atualizarCampo}
                placeholder="Ex.: TUR-001"
                maxLength={30}
                required
              />
            </label>

            <label className="turma-campo">
              Limite de vagas *
              <input
                name="vagas"
                type="number"
                min="1"
                step="1"
                value={formulario.vagas}
                onChange={atualizarCampo}
                placeholder="Ex.: 30"
                required
              />
            </label>

            <label className="turma-campo">
              Curso *
              <select
                name="curso"
                value={formulario.curso}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione um curso</option>
                {cursos.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="turma-campo">
              Disciplina *
              <select
                name="disciplina"
                value={formulario.disciplina}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="turma-campo">
              Professor *
              <select
                name="professor"
                value={formulario.professor}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione um professor</option>
                {professores.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="turma-campo">
              Turno *
              <select
                name="turno"
                value={formulario.turno}
                onChange={atualizarCampo}
                required
              >
                <option value="">Selecione um turno</option>
                {turnos.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="turma-dias">
            <legend>Dias da semana *</legend>
            <p>Selecione um ou mais dias de aula.</p>

            <div className="turma-lista-dias">
              {diasSemana.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  aria-pressed={formulario.dias.includes(dia)}
                  className={
                    formulario.dias.includes(dia)
                      ? "turma-dia ativo"
                      : "turma-dia"
                  }
                  onClick={() => alternarDia(dia)}
                >
                  {formulario.dias.includes(dia) ? "✓ " : ""}
                  {dia}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="turma-acoes">
            <button
              type="button"
              className="turma-botao turma-botao-secundario"
              onClick={cancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="turma-botao turma-botao-principal"
            >
              Salvar turma
            </button>
          </div>
        </form>
      </section>

      <section className="turma-card turma-listagem">
        <div className="turma-titulo">
          <div>
            <h2>Turmas cadastradas</h2>
            <p>Lista temporária para testar o formulário.</p>
          </div>

          <span className="turma-contador">{turmas.length}</span>
        </div>

        {turmas.length === 0 ? (
          <div className="turma-vazio">
            Nenhuma turma cadastrada. Utilize o formulário acima.
          </div>
        ) : (
          <div className="turma-tabela-container">
            <table className="turma-tabela">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Curso / Disciplina</th>
                  <th>Professor</th>
                  <th>Turno</th>
                  <th>Dias</th>
                  <th>Vagas</th>
                </tr>
              </thead>

              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.codigo}>
                    <td>{turma.codigo}</td>
                    <td>
                      {turma.curso}
                      <br />
                      {turma.disciplina}
                    </td>
                    <td>{turma.professor}</td>
                    <td>{turma.turno}</td>
                    <td>{turma.dias.join(", ")}</td>
                    <td>{turma.vagas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="turma-rodape">
        EduGestão Pública • Protótipo da Sprint 5
      </footer>
    </main>
  );
}

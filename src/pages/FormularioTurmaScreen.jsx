import React, { useRef, useState } from 'react';
import {
  cursos, disciplinas, professores, turnos, diasSemana,
  criarFormularioVazio, validarTurma,
} from '../data/turmas.js';
import '../styles/turmas.css';

export default function FormularioTurmaScreen({ onCancelar }) {
  const [formulario, setFormulario] = useState(criarFormularioVazio);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const formRef = useRef(null);

  function alterar(campo, valor) {
    setFormulario(atual => ({ ...atual, [campo]: valor }));
    setErros(atuais => ({ ...atuais, [campo]: undefined }));
    setMensagem('');
  }

  function alternarDia(dia) {
    setFormulario(atual => ({
      ...atual,
      dias: atual.dias.includes(dia)
        ? atual.dias.filter(item => item !== dia)
        : [...atual.dias, dia],
    }));
    setErros(atuais => ({ ...atuais, dias: undefined }));
    setMensagem('');
  }

  function salvar(event) {
    event.preventDefault();
    const novosErros = validarTurma(formulario);
    setErros(novosErros);
    setMensagem('');
    const primeiroCampo = Object.keys(novosErros)[0];
    if (primeiroCampo) {
      formRef.current.querySelector(`[data-campo="${primeiroCampo}"]`)?.focus();
      return;
    }
    // Salvamento simulado, conforme a tarefa #368. Não persiste os dados.
    setFormulario(criarFormularioVazio());
    setMensagem('Turma cadastrada com sucesso');
  }

  function cancelar() {
    setFormulario(criarFormularioVazio());
    setErros({});
    setMensagem('');
    onCancelar?.();
  }

  function erro(campo) {
    return erros[campo] && <span id={`erro-${campo}`} className="turma-erro">{erros[campo]}</span>;
  }

  function atributos(campo) {
    return {
      id: `turma-${campo}`,
      'data-campo': campo,
      'aria-invalid': Boolean(erros[campo]),
      'aria-describedby': erros[campo] ? `erro-${campo}` : undefined,
    };
  }

  function seletor(campo, titulo, opcoes) {
    return (
      <div className="turma-campo">
        <label htmlFor={`turma-${campo}`}>{titulo} *</label>
        <select {...atributos(campo)} required value={formulario[campo]}
          onChange={event => alterar(campo, event.target.value)}>
          <option value="">Selecione</option>
          {opcoes.map(opcao => {
            const valor = typeof opcao === 'string' ? opcao : opcao.id;
            const nome = typeof opcao === 'string' ? opcao : opcao.nome;
            return <option key={valor} value={valor}>{nome}</option>;
          })}
        </select>
        {erro(campo)}
      </div>
    );
  }

  return (
    <main className="turma-page">
      <header>
        <p className="turma-categoria">GESTÃO ACADÊMICA</p>
        <h1>Cadastro de turma</h1>
        <p>Preencha os dados da nova turma. Todos os campos são obrigatórios.</p>
      </header>
      <p className="turma-demo">Demonstração: o salvamento é simulado, sem banco de dados.</p>
      <div role="status" aria-live="polite" aria-atomic="true">
        {mensagem && <p className="turma-sucesso">{mensagem}</p>}
      </div>
      <form ref={formRef} className="turma-form" onSubmit={salvar} noValidate>
        {Object.values(erros).some(Boolean) && (
          <p role="alert" className="turma-erro">Revise os campos indicados antes de salvar.</p>
        )}
        <div className="turma-grade">
          {seletor('curso', 'Curso', cursos)}
          {seletor('disciplina', 'Disciplina', disciplinas)}
          <div className="turma-campo">
            <label htmlFor="turma-codigo">Código da turma *</label>
            <input {...atributos('codigo')} required type="text" value={formulario.codigo}
              placeholder="Ex.: MAT-2026-01" onChange={event => alterar('codigo', event.target.value)} />
            {erro('codigo')}
          </div>
          <div className="turma-campo">
            <label htmlFor="turma-vagas">Limite de vagas *</label>
            <input {...atributos('vagas')} required type="number" min="1" step="1" value={formulario.vagas}
              placeholder="Ex.: 30" onChange={event => alterar('vagas', event.target.value)} />
            {erro('vagas')}
          </div>
          {seletor('professor', 'Professor', professores)}
          {seletor('turno', 'Turno', turnos)}
        </div>
        <fieldset className="turma-dias" aria-describedby={erros.dias ? 'erro-dias' : undefined}>
          <legend>Dias da semana *</legend>
          <p>Selecione um ou mais dias.</p>
          <div className="turma-dias-botoes">
            {diasSemana.map((dia, indice) => (
              <button key={dia} type="button" data-campo={indice === 0 ? 'dias' : undefined}
                aria-pressed={formulario.dias.includes(dia)}
                aria-describedby={erros.dias ? 'erro-dias' : undefined}
                onClick={() => alternarDia(dia)}>{dia}</button>
            ))}
          </div>
          {erro('dias')}
        </fieldset>
        <div className="turma-acoes">
          <button type="button" className="turma-cancelar" onClick={cancelar}>Cancelar</button>
          <button type="submit" className="turma-salvar">Salvar</button>
        </div>
      </form>
    </main>
  );
}

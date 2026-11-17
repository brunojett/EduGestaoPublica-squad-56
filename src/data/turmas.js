// Dados fixos de demonstração. Não há consulta a uma API.
export { cursos } from './matrizes.js';
export const disciplinas = ['Matemática', 'Língua Portuguesa', 'História', 'Geografia'];
export const professores = ['Ana Silva', 'Carlos Souza', 'Mariana Santos'];
export const turnos = ['Manhã', 'Tarde', 'Noite'];
export const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

export function criarFormularioVazio() {
  return { curso: '', disciplina: '', codigo: '', vagas: '', professor: '', dias: [], turno: '' };
}

export function validarTurma(formulario) {
  const erros = {};
  if (!formulario.curso) erros.curso = 'Selecione o curso.';
  if (!formulario.disciplina) erros.disciplina = 'Selecione a disciplina.';
  if (!formulario.codigo.trim()) erros.codigo = 'Informe o código da turma.';
  if (!formulario.professor) erros.professor = 'Selecione o professor.';
  if (!formulario.dias.length) erros.dias = 'Selecione pelo menos um dia.';
  if (!formulario.turno) erros.turno = 'Selecione o turno.';
  const vagas = Number(formulario.vagas);
  if (!Number.isSafeInteger(vagas) || vagas <= 0) {
    erros.vagas = 'Informe uma quantidade inteira de vagas maior que zero.';
  }
  return erros;
}

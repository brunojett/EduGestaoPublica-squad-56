import test from 'node:test';
import assert from 'node:assert/strict';
import { criarFormularioVazio, validarTurma } from '../src/data/turmas.js';
const valido = () => ({ curso: 'c1', disciplina: 'Matemática', codigo: 'MAT-01', vagas: '30', professor: 'Ana Silva', dias: ['Seg', 'Qua'], turno: 'Manhã' });
test('formulário vazio aponta os sete campos obrigatórios', () => {
  assert.equal(Object.keys(validarTurma(criarFormularioVazio())).length, 7);
});
test('formulário completo aceita múltiplos dias', () => {
  assert.deepEqual(validarTurma(valido()), {});
});
test('código composto apenas de espaços é inválido', () => {
  assert.ok(validarTurma({ ...valido(), codigo: '  ' }).codigo);
});
for (const vagas of ['', '0', '-1', '1.5', 'texto', 'Infinity']) {
  test(`rejeita vagas inválidas: ${JSON.stringify(vagas)}`, () => {
    assert.ok(validarTurma({ ...valido(), vagas }).vagas);
  });
}
test('um único dia e uma vaga são suficientes', () => {
  assert.deepEqual(validarTurma({ ...valido(), vagas: '1', dias: ['Sex'] }), {});
});
test('não permite salvar sem nenhum dia', () => {
  assert.ok(validarTurma({ ...valido(), dias: [] }).dias);
});
test('reinicializações produzem estados independentes', () => {
  const a = criarFormularioVazio(); a.dias.push('Seg');
  assert.deepEqual(criarFormularioVazio().dias, []);
});

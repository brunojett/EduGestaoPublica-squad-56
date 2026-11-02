// Dados de exemplo (fixos, sem banco de dados)
export const alunos = [
  { matricula: '20260001', nome: 'Ana Beatriz Lima' },
  { matricula: '20260002', nome: 'Bruno Costa' },
  { matricula: '20260003', nome: 'Carla Menezes' },
  { matricula: '20260004', nome: 'Diego Santos' },
  { matricula: '20260005', nome: 'Eduarda Alves' },
  { matricula: '20260006', nome: 'Felipe Rocha' },
]

export const avaliacoes = ['Prova 1', 'Trabalho 1', 'Atividade 1']

// Uma avaliação enviada, uma em rascunho e uma sem lançamento
export const inicial = {
  'Prova 1': {
    status: 'Enviado',
    notas: { '20260001': '8,0', '20260002': '6,0', '20260003': '9,5', '20260004': '7,5' },
  },
  'Trabalho 1': {
    status: 'Rascunho',
    salvoEm: '06/10/2026 14:32',
    notas: { '20260001': '9,0' },
  },
}

// ---------- Funções auxiliares ----------
export const paraNumero = (texto) => Number(texto.replace(',', '.'))
export const formata = (numero) => numero.toFixed(1).replace('.', ',')

// Vazio é válido (nota ainda não lançada). Fora isso: número de 0 a 10.
export function valida(texto) {
  const t = texto.trim()
  return t === '' || (/^\d+([.,]\d+)?$/.test(t) && paraNumero(t) <= 10)
}

export function agora() {
  return new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// Média só com notas enviadas (rascunho e alunos sem nota não entram)
export function calcularMedia(lancamento) {
  if (lancamento?.status !== 'Enviado') return null
  const numeros = Object.values(lancamento.notas).map(paraNumero)
  if (numeros.length === 0) return null
  const soma = numeros.reduce((total, n) => total + n, 0)
  return { valor: formata(soma / numeros.length), quantidade: numeros.length }
}

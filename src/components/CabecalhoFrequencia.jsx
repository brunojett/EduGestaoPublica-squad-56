import React from 'react';

export default function CabecalhoFrequencia({ turma, data, presentes, faltas }) {
  return (
    <header>
      <h1 style={estilos.turma}>{turma}</h1>
      <p style={estilos.data}>{data}</p>
      <p style={estilos.contador}>
        Presentes: {presentes} · Faltas: {faltas}
      </p>
    </header>
  );
}

const estilos = {
  turma: { fontSize: 22, margin: 0 },
  data: { margin: '4px 0' },
  contador: { fontWeight: 600, margin: '8px 0 16px' },
};

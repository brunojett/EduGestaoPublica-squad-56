import { useState } from 'react';


const TURMA = '8º A · Matemática';

const ALUNOS_INICIAIS = [
  { id: 1, nome: 'Ana Beatriz Souza', presente: true },
  { id: 2, nome: 'Bruno Henrique Lima', presente: true },
  { id: 3, nome: 'Carla Fernanda Alves', presente: true },
  { id: 4, nome: 'Diego Martins Rocha', presente: true },
  { id: 5, nome: 'Eduarda Santos Pereira', presente: true },
  { id: 6, nome: 'Felipe Augusto Costa', presente: true },
  { id: 7, nome: 'Gabriela Ribeiro Dias', presente: true },
  { id: 8, nome: 'Henrique Barbosa Nunes', presente: true },
];

export default function RegistroFrequencia() {
  const [alunos, setAlunos] = useState(ALUNOS_INICIAIS);
  const [topicos, setTopicos] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Data
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // Contadores
  const presentes = alunos.filter((a) => a.presente).length;
  const faltas = alunos.length - presentes;


  function alternarPresenca(id) {
    setAlunos((lista) =>
      lista.map((a) => (a.id === id ? { ...a, presente: !a.presente } : a))
    );
    setSucesso('');
  }

  function salvarFrequencia() {
    if (topicos.trim() === '') {
      setErro('Informe os tópicos ministrados na aula.');
      setSucesso('');
      return;
    }

    setErro('');
   
    console.log('Frequência salva:', { turma: TURMA, data: dataHoje, alunos, topicos });
    setSucesso('Frequência salva com sucesso');
  }

  return (
    <main style={estilos.tela}>
      {}
      <header>
        <h1 style={estilos.turma}>{TURMA}</h1>
        <p style={estilos.data}>{dataHoje}</p>
        <p style={estilos.contador}>
          Presentes: {presentes} · Faltas: {faltas}
        </p>
      </header>

      {}
      <ul style={estilos.lista}>
        {alunos.map((aluno) => (
          <li key={aluno.id}>
            <label style={estilos.linhaAluno}>
              <span>{aluno.nome}</span>
              <span style={estilos.controle}>
                {aluno.presente ? 'Presente' : 'Falta'}
                <input
                  type="checkbox"
                  checked={aluno.presente}
                  onChange={() => alternarPresenca(aluno.id)}
                />
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* Tópicos ministrados */}
      <label htmlFor="topicos" style={estilos.rotulo}>
        Tópicos ministrados na aula
      </label>
      <textarea
        id="topicos"
        style={estilos.campoTopicos}
        value={topicos}
        onChange={(e) => {
          setTopicos(e.target.value);
          setErro('');
          setSucesso('');
        }}
        placeholder="Ex: Equações do 1º grau"
      />
      {erro && <p style={estilos.erro}>{erro}</p>}

      <button style={estilos.botao} onClick={salvarFrequencia}>
        Salvar frequência
      </button>

      {sucesso && <p style={estilos.sucesso}>{sucesso}</p>}
    </main>
  );
}


const estilos = {
  tela: { maxWidth: 480, margin: '0 auto', padding: 16, fontFamily: 'sans-serif' },
  turma: { fontSize: 22, margin: 0 },
  data: { margin: '4px 0' },
  contador: { fontWeight: 600, margin: '8px 0 16px' },
  lista: { listStyle: 'none', padding: 0, margin: 0 },
  linhaAluno: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
  },
  controle: { display: 'flex', alignItems: 'center', gap: 8 },
  rotulo: { display: 'block', fontWeight: 600, margin: '16px 0 6px' },
  campoTopicos: {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 80,
    padding: 10,
    border: '1px solid #999',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
  botao: { marginTop: 12, padding: '12px 16px', minHeight: 44, cursor: 'pointer' },
  erro: { color: 'red', fontSize: 13, margin: '6px 0 0' },
  sucesso: { color: 'green', fontWeight: 600 },
};

<RegistroFrequencia />
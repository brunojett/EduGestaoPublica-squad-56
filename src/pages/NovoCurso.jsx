
import { useState } from 'react';
import './NovoCurso.css';

function NovoCurso() {
  const [nomeCurso, setNomeCurso] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [modalidade, setModalidade] = useState('Presencial');

  function salvarCurso(event) {
    event.preventDefault();

    const curso = {
      nome: nomeCurso,
      cargaHoraria: Number(cargaHoraria),
      modalidade: modalidade
    };

    console.log('Curso cadastrado:', curso);
    alert('Curso cadastrado com sucesso!');
  }

  function cancelar() {
    setNomeCurso('');
    setCargaHoraria('');
    setModalidade('Presencial');
  }

  return (
    <main className="novo-curso">
      <header className="novo-curso-header">
        <button
          type="button"
          className="botao-voltar"
          onClick={() => window.history.back()}
        >
          ‹
        </button>

        <div>
          <span className="identificacao">MATRIZES CURRICULARES</span>
          <h1>Novo curso</h1>
        </div>
      </header>

      <form className="formulario-curso" onSubmit={salvarCurso}>
        <section className="dados-curso">
          <h2>Dados do curso</h2>

          <p className="descricao">
            Preencha as informações para adicionar o curso à matriz curricular.
          </p>

          <div className="campo">
            <label htmlFor="nomeCurso">
              Nome do curso <span>*</span>
            </label>

            <input
              id="nomeCurso"
              type="text"
              placeholder="Ex: Matemática Aplicada"
              value={nomeCurso}
              onChange={(event) => setNomeCurso(event.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="cargaHoraria">
              Carga horária (horas) <span>*</span>
            </label>

            <input
              id="cargaHoraria"
              type="number"
              min="1"
              placeholder="Ex: 80"
              value={cargaHoraria}
              onChange={(event) => setCargaHoraria(event.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Modalidade</label>

            <div className="seletor-modalidade">
              <button
                type="button"
                className={modalidade === 'Presencial' ? 'ativo' : ''}
                onClick={() => setModalidade('Presencial')}
              >
                Presencial
              </button>

              <button
                type="button"
                className={modalidade === 'EAD' ? 'ativo' : ''}
                onClick={() => setModalidade('EAD')}
              >
                EAD
              </button>
            </div>
          </div>
        </section>

        <div className="acoes-curso">
          <button type="submit" className="botao-salvar">
            Salvar
          </button>

          <button
            type="button"
            className="botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

export default NovoCurso;

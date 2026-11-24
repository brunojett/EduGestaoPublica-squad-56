import React, { useState } from 'react';
import { Award, Save, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import StatCard from '../../components/common/StatCard';
import StudentReportModal from '../../components/common/StudentReportModal';

/**
 * ============================================================================
 * TELA PROFESSOR (DIÁRIO ELETRÔNICO): LANÇAMENTO DE NOTAS DAS AVALIAÇÕES
 * ============================================================================
 * Atende ao requisito:
 * "Criar a tela de lançamento de notas das avaliações."
 */
export default function GradesEntry() {
  const { classes, disciplines, students, updateStudentGrades, showToast } = useAcademic();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'tur-1');
  const [selectedDiscId, setSelectedDiscId] = useState(disciplines[2]?.id || 'disc-3');
  const [selectedUnit, setSelectedUnit] = useState('u4');
  const [reportStudent, setReportStudent] = useState(null);

  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Função pura que calcula a Média da Unidade segundo a regra pedagógica SEDUC-SE:
  // Média Parcial = (AV1 + AV2 + Qualitativa) / 3.
  // Se houver nota de Recuperação Paralela (REC) maior que a menor nota ou média parcial,
  // substitui para compor a nota final da unidade.
  const calculateUnitAverage = (unitGrades) => {
    if (!unitGrades) return 0;
    const av1 = Number(unitGrades.av1) || 0;
    const av2 = Number(unitGrades.av2) || 0;
    const qual = Number(unitGrades.qual) || 0;
    const baseAvg = (av1 + av2 + qual) / 3;

    if (unitGrades.rec !== null && unitGrades.rec !== '' && unitGrades.rec !== undefined) {
      const recVal = Number(unitGrades.rec);
      if (!Number.isNaN(recVal) && recVal > baseAvg) {
        return Number(((baseAvg + recVal) / 2).toFixed(1));
      }
    }
    return Number(baseAvg.toFixed(1));
  };

  const handleGradeChange = (studentId, field, rawValue) => {
    if (rawValue === '') {
      updateStudentGrades(studentId, selectedUnit, { [field]: null });
      return;
    }
    const num = Math.min(10, Math.max(0, Number(rawValue)));
    updateStudentGrades(studentId, selectedUnit, { [field]: num });
  };

  // Estatísticas da turma na unidade atual
  const averages = classStudents.map((s) => calculateUnitAverage(s.grades[selectedUnit]));
  const classMean =
    averages.length > 0
      ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1)
      : '0.0';
  const approvedCount = averages.filter((avg) => avg >= 6.0).length;
  const recoveryCount = averages.filter((avg) => avg < 6.0).length;

  return (
    <div className="page-container">
      <div className="page-hero">
        <div>
          <div className="page-hero-tag">
            <Award size={15} />
            Diário Eletrônico SEDUC-SE • Avaliação da Aprendizagem
          </div>
          <h2>Lançamento de Notas das Avaliações e Recuperação Paralela</h2>
          <p>
            Lance as notas de Avaliação 1 (AV1), Avaliação 2 (AV2), Qualitativa (QUAL) e Recuperação
            Paralela (REC). O cálculo da média da unidade é atualizado instantaneamente.
          </p>
        </div>

        {/* Seletor de Unidade Bimestral */}
        <div className="subtabs-bar">
          {[
            { id: 'u1', label: '1ª Unidade' },
            { id: 'u2', label: '2ª Unidade' },
            { id: 'u3', label: '3ª Unidade' },
            { id: 'u4', label: '4ª Unidade (Atual)' },
          ].map((u) => (
            <button
              key={u.id}
              type="button"
              className={`subtab-btn ${selectedUnit === u.id ? 'active' : ''}`}
              onClick={() => setSelectedUnit(u.id)}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs de Rendimento da Turma */}
      <div className="stats-grid">
        <StatCard
          label="Média Geral da Turma"
          value={classMean}
          subtitle="Escala de 0,0 a 10,0 pontos"
          icon={Calculator}
          variant="blue"
        />
        <StatCard
          label="Estudantes na Média (>= 6,0)"
          value={`${approvedCount}/${classStudents.length}`}
          subtitle="Desempenho satisfatório na unidade"
          icon={CheckCircle2}
          variant="green"
        />
        <StatCard
          label="Em Recuperação Paralela (< 6,0)"
          value={recoveryCount}
          subtitle="Elegíveis para reavaliação da unidade"
          icon={AlertCircle}
          variant={recoveryCount > 0 ? 'gold' : 'green'}
        />
      </div>

      {/* Planilha Interativa de Lançamento de Notas */}
      <section className="section-card">
        <div className="section-card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.73rem' }}>
                Turma Selecionada
              </label>
              <select
                className="form-control"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.73rem' }}>
                Disciplina
              </label>
              <select
                className="form-control"
                value={selectedDiscId}
                onChange={(e) => setSelectedDiscId(e.target.value)}
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              showToast('Pauta de notas consolidada e sincronizada no Diário Eletrônico SEDUC-SE!')
            }
          >
            <Save size={16} />
            Consolidar Notas da Unidade
          </button>
        </div>

        <div className="section-card-body table-responsive">
          <table className="seduc-table">
            <thead>
              <tr>
                <th>Matrícula / Estudante</th>
                <th style={{ textAlign: 'center' }}>Avaliação 1 (AV1)</th>
                <th style={{ textAlign: 'center' }}>Avaliação 2 (AV2)</th>
                <th style={{ textAlign: 'center' }}>Qualitativa (QUAL)</th>
                <th style={{ textAlign: 'center' }}>Recuperação (REC)</th>
                <th style={{ textAlign: 'center' }}>Média da Unidade</th>
                <th>Situação Pedagógica</th>
                <th>Boletim</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.map((stu) => {
                const uGrades = stu.grades[selectedUnit] || {
                  av1: 0,
                  av2: 0,
                  qual: 0,
                  rec: null,
                };
                const avg = calculateUnitAverage(uGrades);
                const isApproved = avg >= 6.0;

                return (
                  <tr key={stu.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{stu.name}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--seduc-text-muted)' }}>
                        Matrícula: {stu.enrollment}
                      </div>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="grade-input"
                        value={uGrades.av1 ?? ''}
                        onChange={(e) => handleGradeChange(stu.id, 'av1', e.target.value)}
                      />
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="grade-input"
                        value={uGrades.av2 ?? ''}
                        onChange={(e) => handleGradeChange(stu.id, 'av2', e.target.value)}
                      />
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="grade-input"
                        value={uGrades.qual ?? ''}
                        onChange={(e) => handleGradeChange(stu.id, 'qual', e.target.value)}
                      />
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="grade-input"
                        placeholder="—"
                        value={uGrades.rec ?? ''}
                        onChange={(e) => handleGradeChange(stu.id, 'rec', e.target.value)}
                      />
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '1.02rem',
                          fontWeight: 800,
                          color: isApproved
                            ? 'var(--seduc-blue-primary)'
                            : 'var(--seduc-danger)',
                        }}
                      >
                        {avg.toFixed(1)}
                      </span>
                    </td>

                    <td>
                      {isApproved ? (
                        <span className="badge badge-green">
                          <CheckCircle2 size={13} /> Atingiu a Média
                        </span>
                      ) : (
                        <span className="badge badge-gold">
                          <AlertCircle size={13} /> Em Recuperação Paralela
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setReportStudent(stu)}
                      >
                        Ver Boletim Completo
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {reportStudent && (
        <StudentReportModal
          student={reportStudent}
          calculateUnitAverage={calculateUnitAverage}
          onClose={() => setReportStudent(null)}
        />
      )}
    </div>
  );
}

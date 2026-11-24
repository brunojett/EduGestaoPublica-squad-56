import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  CheckCheck,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  History,
  Search,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

/**
 * ============================================================================
 * TELA PROFESSOR (DIÁRIO ELETRÔNICO): FREQUÊNCIA POR CHAMADA & TÓPICOS
 * ============================================================================
 * Atende ao requisito:
 * "Implementar interfaces ágeis para o registro diário de frequência por chamada
 * e preenchimento dos tópicos ministrados."
 */
export default function AttendanceDiary() {
  const {
    classes,
    disciplines,
    students,
    diaryLogs,
    activeTeacherId,
    registerAttendanceAndTopic,
  } = useAcademic();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'tur-1');
  const [selectedDiscId, setSelectedDiscId] = useState(disciplines[2]?.id || 'disc-3');
  const [lessonDate, setLessonDate] = useState(new Date().toISOString().slice(0, 10));
  const [lessonsCount, setLessonsCount] = useState(2);
  const [topic, setTopic] = useState('');
  const [methodology, setMethodology] = useState(
    'Aula expositiva dialogada com resolução de atividades práticas.'
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Mapa de presença da chamada atual: { [studentId]: 'P' | 'F' | 'FJ' }
  const [attendanceMap, setAttendanceMap] = useState({});

  // Filtra alunos da turma selecionada
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return classStudents;
    const q = searchTerm.toLowerCase();
    return classStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.enrollment.toLowerCase().includes(q)
    );
  }, [classStudents, searchTerm]);

  const getStudentStatus = (studentId) => attendanceMap[studentId] || 'P';

  const handleSetStatus = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAllPresent = () => {
    const nextMap = {};
    classStudents.forEach((stu) => {
      nextMap[stu.id] = 'P';
    });
    setAttendanceMap(nextMap);
  };

  const handleSaveDiary = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    registerAttendanceAndTopic({
      date: lessonDate,
      classId: selectedClassId,
      disciplineId: selectedDiscId,
      teacherId: activeTeacherId,
      lessonsCount,
      topic,
      methodology,
      attendanceMap,
    });

    setTopic('');
    setAttendanceMap({});
  };

  // Resumo rápido da chamada atual
  const presentToday = classStudents.filter((s) => getStudentStatus(s.id) === 'P').length;
  const absentToday = classStudents.filter((s) => getStudentStatus(s.id) === 'F').length;
  const justifiedToday = classStudents.filter((s) => getStudentStatus(s.id) === 'FJ').length;

  return (
    <div className="page-container">
      <div className="page-hero">
        <div>
          <div className="page-hero-tag">
            <ClipboardCheck size={15} />
            Diário Eletrônico SEDUC-SE • Registro Docente
          </div>
          <h2>Chamada Diária Ágil e Registro de Tópicos Ministrados</h2>
          <p>
            Realize a chamada com um clique, acompanhe o percentual de assiduidade (mínimo 75% LDB)
            e registre o conteúdo programático trabalhado em sala.
          </p>
        </div>

        <div role="status" aria-live="polite" aria-atomic="true" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-green">Presentes: {presentToday}</span>
          <span aria-hidden="true">·</span>
          <span className="badge badge-danger">Faltas: {absentToday}</span>
          <span aria-hidden="true">·</span>
          <span className="badge badge-gold">Justificadas: {justifiedToday}</span>
        </div>
      </div>

      {/* Barra de Seleção de Turma, Disciplina e Data da Aula */}
      <section className="section-card">
        <div className="section-card-body">
          <div className="form-grid">
            <div className="form-group col-4">
              <label className="form-label">Turma</label>
              <select
                className="form-control"
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setAttendanceMap({});
                }}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-4">
              <label className="form-label">Componente Curricular (Disciplina)</label>
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

            <div className="form-group col-2">
              <label className="form-label">Data da Aula</label>
              <input
                type="date"
                className="form-control"
                value={lessonDate}
                onChange={(e) => setLessonDate(e.target.value)}
              />
            </div>

            <div className="form-group col-2">
              <label className="form-label">Tempos (Aulas)</label>
              <select
                className="form-control"
                value={lessonsCount}
                onChange={(e) => setLessonsCount(Number(e.target.value))}
              >
                <option value={1}>1 Tempo (50 min)</option>
                <option value={2}>2 Tempos Geminados</option>
                <option value={3}>3 Tempos</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSaveDiary} className="two-col-grid">
        {/* Coluna 1: Preenchimento dos Tópicos Ministrados */}
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <div className="section-card-title">
                <BookOpen size={19} color="#164194" />
                Tópicos Ministrados na Aula
              </div>
              <div className="section-card-subtitle">
                Descreva o conteúdo programático e a metodologia aplicada
              </div>
            </div>
          </div>

          <div className="section-card-body">
            <div className="form-grid">
              <div className="form-group col-12">
                <label className="form-label">
                  Conteúdo / Tópicos Ministrados <span className="required">*</span>
                </label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '110px' }}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Introdução aos Hooks do React (useState e useEffect); construção prática de componentes reutilizáveis..."
                  required
                />
              </div>

              <div className="form-group col-12">
                <label className="form-label">Procedimentos Metodológicos / Recursos</label>
                <textarea
                  className="form-control"
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  placeholder="Ex: Aula prática em laboratório, resolução de lista de exercícios..."
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <CheckCircle2 size={18} />
                  Salvar Chamada e Tópico no Diário Eletrônico
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Coluna 2: Lista Ágil de Chamada por Aluno */}
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <div className="section-card-title">
                <ClipboardCheck size={19} color="#164194" />
                Lista de Chamada Rápida ({classStudents.length} Alunos)
              </div>
              <div className="section-card-subtitle">
                Clique em P (Presente), F (Falta) ou FJ (Falta Justificada)
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleMarkAllPresent}
            >
              <CheckCheck size={15} />
              Marcar Todos Presentes
            </button>
          </div>

          <div className="section-card-body">
            {/* Busca Rápida */}
            <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--seduc-text-muted)',
                }}
              />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2rem' }}
                placeholder="Buscar estudante por nome ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="seduc-table">
                <thead>
                  <tr>
                    <th>Matrícula / Estudante</th>
                    <th>Assiduidade Acumulada</th>
                    <th style={{ textAlign: 'right' }}>Registro de Hoje</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu) => {
                    const currentStatus = getStudentStatus(stu.id);
                    const attendancePercent = Math.round(
                      ((stu.totalClassesHeld - stu.absences) / stu.totalClassesHeld) * 100
                    );
                    const isRisk = attendancePercent < 78;

                    return (
                      <tr key={stu.id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{stu.name}</div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--seduc-text-muted)' }}>
                            Matrícula: {stu.enrollment}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${isRisk ? 'badge-danger' : 'badge-green'}`}
                          >
                            {isRisk && <AlertTriangle size={12} />}
                            {attendancePercent}% ({stu.absences} faltas)
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="attendance-toggle-group">
                            <button
                              type="button"
                              className={`att-btn ${currentStatus === 'P' ? 'active-P' : ''}`}
                              onClick={() => handleSetStatus(stu.id, 'P')}
                              title="Presente"
                            >
                              P
                            </button>
                            <button
                              type="button"
                              className={`att-btn ${currentStatus === 'F' ? 'active-F' : ''}`}
                              onClick={() => handleSetStatus(stu.id, 'F')}
                              title="Falta"
                            >
                              F
                            </button>
                            <button
                              type="button"
                              className={`att-btn ${currentStatus === 'FJ' ? 'active-FJ' : ''}`}
                              onClick={() => handleSetStatus(stu.id, 'FJ')}
                              title="Falta Justificada"
                            >
                              FJ
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </form>

      {/* Histórico de Aulas Ministradas no Diário Eletrônico */}
      <section className="section-card">
        <div className="section-card-header">
          <div className="section-card-title">
            <History size={19} color="#164194" />
            Histórico Recente de Aulas e Tópicos Registrados ({diaryLogs.length})
          </div>
        </div>
        <div className="section-card-body table-responsive">
          <table className="seduc-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Turma / Disciplina</th>
                <th>Tópicos Ministrados & Metodologia</th>
                <th>Frequência</th>
              </tr>
            </thead>
            <tbody>
              {diaryLogs.map((log) => {
                const cls = classes.find((c) => c.id === log.classId);
                const disc = disciplines.find((d) => d.id === log.disciplineId);
                return (
                  <tr key={log.id}>
                    <td>
                      <span className="badge badge-blue">
                        <Calendar size={12} /> {log.date}
                      </span>
                      <div style={{ fontSize: '0.72rem', marginTop: '3px' }}>
                        {log.lessonsCount} tempo(s)
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{cls?.code}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--seduc-text-secondary)' }}>
                        {disc?.name}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.topic}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--seduc-text-muted)' }}>
                        {log.methodology}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-green">{log.presentCount} P</span>{' '}
                      <span className="badge badge-danger">{log.absentCount} F</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

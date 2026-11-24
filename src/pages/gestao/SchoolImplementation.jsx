import React, { useState } from 'react';
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  Layers,
  CalendarPlus,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import StatCard from '../../components/common/StatCard';

/**
 * ============================================================================
 * TELA ADM (GESTÃO ACADÊMICA): IMPLEMENTAÇÃO ESCOLAR & CALENDÁRIO LETIVO
 * ============================================================================
 * Atende ao requisito:
 * "Gestão Acadêmica: Responsável por pegar a definição do DIES e implementar a
 * escola, o calendário..."
 */
export default function SchoolImplementation() {
  const {
    schools,
    matrices,
    courses,
    calendar,
    implementMatrixInSchool,
    addCalendarEvent,
  } = useAcademic();

  // Apenas matrizes já homologadas/autorizadas pela DIES podem ser implementadas
  const authorizedMatrices = matrices.filter((m) => m.authorizedByDies);

  const [eventForm, setEventForm] = useState({
    date: '2026-11-28',
    title: '',
    type: 'Sábado Letivo',
  });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) return;
    addCalendarEvent(eventForm);
    setEventForm({
      ...eventForm,
      title: '',
    });
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <div>
          <div className="page-hero-tag">
            <Building2 size={15} />
            Gestão Acadêmica • Operacionalização da Rede SEDUC-SE
          </div>
          <h2>Implementação das Definições DIES nas Escolas & Calendário Letivo</h2>
          <p>
            Receba as escolas e matrizes homologadas pela DIES, vincule a oferta curricular de cada
            unidade de ensino e gerencie o Calendário Escolar de 200 dias letivos.
          </p>
        </div>
        <span className="badge badge-green">Ano Letivo {calendar.academicYear}</span>
      </div>

      {/* Indicadores Rápidos */}
      <div className="stats-grid">
        <StatCard
          label="Escolas Prontas na Rede"
          value={schools.length}
          subtitle="Credenciadas pela DIES"
          icon={Building2}
          variant="blue"
        />
        <StatCard
          label="Matrizes Homologadas (DIES)"
          value={authorizedMatrices.length}
          subtitle="Disponíveis para implementação"
          icon={Layers}
          variant="green"
        />
        <StatCard
          label="Meta de Dias Letivos (LDB)"
          value={`${calendar.schoolDaysTarget} dias`}
          subtitle="4 Unidades Bimestrais"
          icon={CalendarRange}
          variant="gold"
        />
      </div>

      <div className="two-col-grid">
        {/* Coluna 1: Calendário Acadêmico e Unidades Letivas */}
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <div className="section-card-title">
                <CalendarRange size={19} color="#164194" />
                Calendário Escolar {calendar.academicYear} (SEDUC-SE)
              </div>
              <div className="section-card-subtitle">
                Cronograma oficial das Unidades Letivas, feriados sergipanos e sábados letivos
              </div>
            </div>
          </div>

          <div className="section-card-body">
            {/* Unidades Letivas */}
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--seduc-text-secondary)',
                marginBottom: '0.55rem',
              }}
            >
              Cronograma das Unidades Bimestrais
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {calendar.periods.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    background: 'var(--seduc-bg-page)',
                    border: '1px solid var(--seduc-border-light)',
                    fontSize: '0.83rem',
                  }}
                >
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--seduc-text-muted)' }}>
                      {p.start} até {p.end}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      p.status === 'Em Andamento' ? 'badge-gold' : 'badge-green'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Novo Marco / Evento no Calendário */}
            <form
              onSubmit={handleAddEvent}
              className="form-grid"
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--seduc-border-light)',
              }}
            >
              <div className="col-12" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                Adicionar Data / Sábado Letivo / Recesso ao Calendário
              </div>

              <div className="form-group col-5">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group col-7">
                <label className="form-label">Tipo de Evento</label>
                <select
                  className="form-control"
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                >
                  <option value="Sábado Letivo">Sábado Letivo / Reposição</option>
                  <option value="Conselho de Classe">Conselho de Classe Pedagógico</option>
                  <option value="Feriado">Feriado Estadual / Municipal</option>
                  <option value="Recesso">Recesso Escolar</option>
                </select>
              </div>

              <div className="form-group col-12">
                <label className="form-label">Descrição do Evento Letivo</label>
                <input
                  type="text"
                  className="form-control"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Ex: Sábado Letivo de Reposição da 4ª Unidade"
                  required
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <CalendarPlus size={16} />
                  Registrar no Calendário Acadêmico
                </button>
              </div>
            </form>

            {/* Eventos Registrados */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {calendar.events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    padding: '0.45rem 0.65rem',
                    borderBottom: '1px solid var(--seduc-border-light)',
                  }}
                >
                  <span>
                    <strong>{ev.date}</strong> — {ev.title}
                  </span>
                  <span className="badge badge-blue">{ev.type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coluna 2: Implementação das Matrizes DIES nas Escolas */}
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <div className="section-card-title">
                <ShieldCheck size={19} color="#164194" />
                Implementar Matrizes Autorizadas pela DIES nas Escolas
              </div>
              <div className="section-card-subtitle">
                Habilite quais matrizes curriculares homologadas pela DIES funcionarão em cada unidade escolar
              </div>
            </div>
          </div>

          <div
            className="section-card-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
          >
            {schools.map((school) => (
              <div
                key={school.id}
                style={{
                  border: '1px solid var(--seduc-border)',
                  borderRadius: '10px',
                  padding: '1.1rem',
                  background: 'var(--seduc-bg-surface)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span className="badge badge-blue">INEP {school.inep}</span>
                      <span className="badge badge-green">{school.OrdinanceRef}</span>
                    </div>
                    <h3 style={{ fontSize: '1.02rem', marginTop: '0.35rem' }}>{school.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--seduc-text-secondary)' }}>
                      <MapPin size={12} style={{ display: 'inline' }} /> {school.city} •{' '}
                      {school.dre}
                    </p>
                  </div>
                  <span className="badge badge-gold">
                    {school.implementedMatrices.length} matriz(es) implementada(s)
                  </span>
                </div>

                {/* Lista de Matrizes Autorizadas pelo DIES para ativar/desativar na escola */}
                <div
                  style={{
                    marginTop: '0.9rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px dashed var(--seduc-border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--seduc-text-secondary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    SELECIONE AS MATRIZES HOMOLOGADAS PELA DIES PARA IMPLEMENTAR NESTA ESCOLA:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {authorizedMatrices.map((mat) => {
                      const isImplemented = school.implementedMatrices.includes(mat.id);
                      const course = courses.find((c) => c.id === mat.courseId);

                      return (
                        <div
                          key={mat.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.6rem 0.85rem',
                            borderRadius: '8px',
                            background: isImplemented
                              ? 'var(--seduc-green-light)'
                              : 'var(--seduc-bg-page)',
                            border: `1px solid ${
                              isImplemented ? 'var(--seduc-green)' : 'var(--seduc-border-light)'
                            }`,
                            gap: '0.75rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                              {mat.code} — {mat.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--seduc-text-secondary)' }}>
                              Curso: {course?.name || 'Curso indisponível'} • {mat.ordinanceNumber || 'Sem portaria vinculada'}
                            </div>
                          </div>

                          <button
                            type="button"
                            className={`btn btn-sm ${
                              isImplemented ? 'btn-success' : 'btn-outline'
                            }`}
                            onClick={() => implementMatrixInSchool(school.id, mat.id)}
                          >
                            <CheckCircle2 size={14} />
                            {isImplemented ? 'Matriz Implementada' : 'Implementar na Escola'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

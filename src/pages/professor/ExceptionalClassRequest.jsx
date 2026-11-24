
import React, { useMemo, useState } from 'react';
import {
  CalendarClock,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  Paperclip,
  FileText,
  Eye,
  X,
  CalendarDays,
  ClipboardList,
  Check,
  Search,
  Download,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

const formatDate = (date) => {
  if (!date) return 'Não informada';

  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: reader.result,
    });

    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    reader.readAsDataURL(file);
  });

export default function ExceptionalClassRequest() {
  const {
    classes,
    disciplines,
    activeTeacherId,
    exceptionalRequests,
    createExceptionalRequest,
  } = useAcademic();

  const [form, setForm] = useState({
    type: 'Reposição de Aula',
    classId: classes[0]?.id || '',
    disciplineName: disciplines[0]?.name || '',
    originalDate: '',
    proposedDate: '',
    proposedSlot: '',
    reason: '',
    pedagogicalPlan: '',
    attachment: null,
  });

  const [filter, setFilter] = useState('Todas');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mostra somente as solicitações do professor ativo.
  const myRequests = useMemo(
    () =>
      exceptionalRequests.filter(
        (request) => request.teacherId === activeTeacherId
      ),
    [exceptionalRequests, activeTeacherId]
  );

  const pendingCount = myRequests.filter(
    (request) => request.status === 'Pendente'
  ).length;

  const approvedCount = myRequests.filter(
    (request) => request.status === 'Deferida'
  ).length;

  const rejectedCount = myRequests.filter(
    (request) => request.status === 'Indeferida'
  ).length;

  const filteredRequests = myRequests.filter((request) => {
    const matchesFilter =
      filter === 'Todas' || request.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      request.protocol?.toLowerCase().includes(searchText) ||
      request.disciplineName?.toLowerCase().includes(searchText) ||
      request.className?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  // Calendário: somente aulas excepcionais deferidas.
  const approvedRequests = myRequests
    .filter((request) => request.status === 'Deferida')
    .sort((a, b) => a.proposedDate.localeCompare(b.proposedDate));

  const monthRequests = approvedRequests.filter((request) => {
    if (!request.proposedDate) return false;

    const [year, month] = request.proposedDate.split('-').map(Number);

    return (
      year === currentMonth.getFullYear() &&
      month === currentMonth.getMonth() + 1
    );
  });

  const changeMonth = (amount) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + amount,
        1
      )
    );
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError('');
    setSuccess('');
  };

  const handleAttachment = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Limite de 1 MB para evitar excesso de armazenamento no navegador.
    if (file.size > 1024 * 1024) {
      setError('O arquivo deve ter no máximo 1 MB.');
      event.target.value = '';
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Anexe somente arquivos PDF, JPG ou PNG.');
      event.target.value = '';
      return;
    }

    try {
      const attachment = await readFile(file);

      handleChange('attachment', attachment);
      setSuccess('Documento anexado com sucesso.');
    } catch {
      setError('Não foi possível anexar o documento.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!form.classId || !form.disciplineName) {
      setError('Selecione uma turma e uma disciplina.');
      return;
    }

    if (!form.originalDate || !form.proposedDate) {
      setError('Informe as duas datas da solicitação.');
      return;
    }

    if (form.originalDate === form.proposedDate) {
      setError('A data original e a nova data não podem ser iguais.');
      return;
    }

    if (
      form.type === 'Reposição de Aula' &&
      form.proposedDate < form.originalDate
    ) {
      setError('Na reposição, a nova data deve ser posterior à data original.');
      return;
    }

    if (
      form.type === 'Antecipação de Aula' &&
      form.proposedDate > form.originalDate
    ) {
      setError('Na antecipação, a nova data deve ser anterior à data original.');
      return;
    }

    if (form.reason.trim().length < 20) {
      setError('A justificativa deve ter pelo menos 20 caracteres.');
      return;
    }

    if (form.pedagogicalPlan.trim().length < 10) {
      setError('Informe um plano de aula com pelo menos 10 caracteres.');
      return;
    }

    const duplicate = myRequests.some(
      (request) =>
        request.classId === form.classId &&
        request.proposedDate === form.proposedDate &&
        request.proposedSlot.trim().toLowerCase() ===
          form.proposedSlot.trim().toLowerCase() &&
        ['Pendente', 'Deferida'].includes(request.status)
    );

    if (duplicate) {
      setError(
        'Já existe uma solicitação pendente ou aprovada para essa turma, data e horário.'
      );
      return;
    }

    createExceptionalRequest({
      ...form,
      teacherId: activeTeacherId,
    });

    setForm({
      type: 'Reposição de Aula',
      classId: classes[0]?.id || '',
      disciplineName: disciplines[0]?.name || '',
      originalDate: '',
      proposedDate: '',
      proposedSlot: '',
      reason: '',
      pedagogicalPlan: '',
      attachment: null,
    });

    setSuccess('Solicitação enviada para análise da Gestão Acadêmica!');
  };

  const statusColor = (status) => {
    if (status === 'Deferida') return 'var(--seduc-green)';
    if (status === 'Indeferida') return 'var(--seduc-danger)';
    return 'var(--seduc-gold)';
  };

  const statusIcon = (status) => {
    if (status === 'Deferida') return <CheckCircle2 size={14} />;
    if (status === 'Indeferida') return <XCircle size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <div>
          <div className="page-hero-tag">
            <CalendarClock size={15} />
            Diário Eletrônico SEDUC-SE • Requerimento Pedagógico
          </div>

          <h2>Solicitação de Aulas Excepcionais</h2>

          <p>
            Solicite reposições ou antecipações de aulas e acompanhe
            o andamento dos seus requerimentos.
          </p>
        </div>
      </div>

      {/* INDICADORES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {[
          {
            label: 'Total de solicitações',
            value: myRequests.length,
            icon: <ClipboardList size={21} />,
            color: '#164194',
          },
          {
            label: 'Pendentes',
            value: pendingCount,
            icon: <Clock size={21} />,
            color: '#B7791F',
          },
          {
            label: 'Deferidas',
            value: approvedCount,
            icon: <CheckCircle2 size={21} />,
            color: '#238636',
          },
          {
            label: 'Indeferidas',
            value: rejectedCount,
            icon: <XCircle size={21} />,
            color: '#C53030',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="section-card"
            style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <div
              style={{
                width: 43,
                height: 43,
                borderRadius: 10,
                background: `${item.color}15`,
                color: item.color,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--seduc-text-main)',
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--seduc-text-secondary)',
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="two-col-grid">
        {/* FORMULÁRIO */}
        <section className="section-card">
          <div className="section-card-header">
            <div>
              <div className="section-card-title">
                <ArrowRightLeft size={19} color="#164194" />
                Novo Requerimento
              </div>

              <div className="section-card-subtitle">
                Preencha os dados para enviar sua solicitação.
              </div>
            </div>
          </div>

          <div className="section-card-body">
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group col-12">
                <label className="form-label">
                  Modalidade da Solicitação
                </label>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem',
                  }}
                >
                  {['Reposição de Aula', 'Antecipação de Aula'].map(
                    (typeOption) => {
                      const active = form.type === typeOption;

                      return (
                        <button
                          key={typeOption}
                          type="button"
                          onClick={() => handleChange('type', typeOption)}
                          style={{
                            padding: '0.75rem',
                            borderRadius: 8,
                            border: `2px solid ${
                              active
                                ? 'var(--seduc-blue-primary)'
                                : 'var(--seduc-border)'
                            }`,
                            background: active
                              ? 'var(--seduc-blue-soft)'
                              : 'var(--seduc-bg-surface)',
                            color: active
                              ? 'var(--seduc-blue-primary)'
                              : 'var(--seduc-text-main)',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                          }}
                        >
                          {typeOption}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="form-group col-12">
                <label className="form-label">Turma *</label>

                <select
                  className="form-control"
                  value={form.classId}
                  onChange={(e) => handleChange('classId', e.target.value)}
                  required
                >
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} — {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-12">
                <label className="form-label">Disciplina *</label>

                <select
                  className="form-control"
                  value={form.disciplineName}
                  onChange={(e) =>
                    handleChange('disciplineName', e.target.value)
                  }
                  required
                >
                  {disciplines.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.code} — {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-6">
                <label className="form-label">Data da Aula Original *</label>

                <input
                  type="date"
                  className="form-control"
                  value={form.originalDate}
                  onChange={(e) =>
                    handleChange('originalDate', e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group col-6">
                <label className="form-label">Nova Data Proposta *</label>

                <input
                  type="date"
                  className="form-control"
                  value={form.proposedDate}
                  onChange={(e) =>
                    handleChange('proposedDate', e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group col-12">
                <label className="form-label">
                  Horário / Turno e Espaço Físico *
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={form.proposedSlot}
                  onChange={(e) =>
                    handleChange('proposedSlot', e.target.value)
                  }
                  placeholder="Ex: Sábado letivo • 08:00 às 10:30 (Laboratório 02)"
                  required
                />
              </div>

              <div className="form-group col-12">
                <label className="form-label">
                  Justificativa do Pedido *
                </label>

                <textarea
                  className="form-control"
                  value={form.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  placeholder="Descreva o motivo institucional ou pedagógico..."
                  maxLength={500}
                  required
                />

                <small
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    color: 'var(--seduc-text-secondary)',
                    marginTop: 4,
                  }}
                >
                  {form.reason.length}/500 caracteres (mínimo 20)
                </small>
              </div>

              <div className="form-group col-12">
                <label className="form-label">
                  Plano de Aula / Conteúdos *
                </label>

                <textarea
                  className="form-control"
                  value={form.pedagogicalPlan}
                  onChange={(e) =>
                    handleChange('pedagogicalPlan', e.target.value)
                  }
                  placeholder="Informe os conteúdos e atividades que serão ministrados..."
                  maxLength={1000}
                  required
                />

                <small
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    color: 'var(--seduc-text-secondary)',
                    marginTop: 4,
                  }}
                >
                  {form.pedagogicalPlan.length}/1000 caracteres
                </small>
              </div>

              {/* ANEXO */}
              <div className="form-group col-12">
                <label className="form-label">
                  Documento Comprobatório (opcional)
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.85rem',
                    border: '1px dashed var(--seduc-border)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: 'var(--seduc-bg-surface)',
                  }}
                >
                  <Paperclip size={19} color="#164194" />

                  <span style={{ fontSize: '0.83rem' }}>
                    Clique para anexar PDF, JPG ou PNG (máximo 1 MB)
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAttachment}
                    style={{ display: 'none' }}
                  />
                </label>

                {form.attachment && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginTop: 10,
                      padding: '0.65rem',
                      borderRadius: 7,
                      background: 'var(--seduc-blue-soft)',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        fontSize: '0.8rem',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      <FileText size={17} />
                      {form.attachment.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleChange('attachment', null)}
                      title="Remover anexo"
                      style={{
                        border: 0,
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'var(--seduc-danger)',
                      }}
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div
                  className="col-12"
                  style={{
                    padding: '0.75rem',
                    borderRadius: 7,
                    color: '#9B2C2C',
                    background: '#FFF0F0',
                    fontSize: '0.84rem',
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="col-12"
                  style={{
                    padding: '0.75rem',
                    borderRadius: 7,
                    color: '#276749',
                    background: '#E6FFFA',
                    fontSize: '0.84rem',
                  }}
                >
                  <Check size={15} style={{ verticalAlign: 'middle' }} />{' '}
                  {success}
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Send size={16} />
                  Enviar Solicitação para a Gestão Acadêmica
                </button>
              </div>
            </form>
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* CALENDÁRIO DE REPOSIÇÕES */}
          <section className="section-card">
            <div className="section-card-header">
              <div>
                <div className="section-card-title">
                  <CalendarDays size={19} color="#164194" />
                  Calendário de Reposições
                </div>

                <div className="section-card-subtitle">
                  Aulas excepcionais que já foram deferidas.
                </div>
              </div>
            </div>

            <div className="section-card-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: '0.85rem',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => changeMonth(-1)}
                  style={{ padding: '0.35rem 0.65rem' }}
                >
                  ‹
                </button>

                <strong style={{ textTransform: 'capitalize' }}>
                  {monthName}
                </strong>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => changeMonth(1)}
                  style={{ padding: '0.35rem 0.65rem' }}
                >
                  ›
                </button>
              </div>

              {monthRequests.length === 0 ? (
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--seduc-text-secondary)',
                    textAlign: 'center',
                    padding: '1rem 0',
                  }}
                >
                  Nenhuma aula excepcional deferida neste mês.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {monthRequests.map((request) => (
                    <div
                      key={request.id}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: '0.7rem',
                        borderRadius: 8,
                        background: 'var(--seduc-bg-surface)',
                        borderLeft: '4px solid var(--seduc-green)',
                      }}
                    >
                      <div
                        style={{
                          minWidth: 48,
                          textAlign: 'center',
                          color: '#164194',
                        }}
                      >
                        <strong style={{ fontSize: '1.2rem' }}>
                          {request.proposedDate.split('-')[2]}
                        </strong>

                        <div style={{ fontSize: '0.68rem' }}>
                          {new Date(
                            `${request.proposedDate}T12:00:00`
                          ).toLocaleDateString('pt-BR', {
                            month: 'short',
                          })}
                        </div>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: '0.82rem' }}>
                          {request.disciplineName}
                        </strong>

                        <div
                          style={{
                            fontSize: '0.74rem',
                            color: 'var(--seduc-text-secondary)',
                          }}
                        >
                          {request.className}
                        </div>

                        <div style={{ fontSize: '0.73rem', marginTop: 3 }}>
                          {request.proposedSlot}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* HISTÓRICO */}
          <section className="section-card">
            <div className="section-card-header">
              <div>
                <div className="section-card-title">
                  <ClipboardList size={19} color="#164194" />
                  Histórico de Solicitações ({myRequests.length})
                </div>

                <div className="section-card-subtitle">
                  Consulte os pedidos e acompanhe os pareceres.
                </div>
              </div>
            </div>

            <div
              className="section-card-body"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {/* BUSCA */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 11,
                    top: 12,
                    color: 'var(--seduc-text-secondary)',
                  }}
                />

                <input
                  className="form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por protocolo, turma ou disciplina..."
                  style={{ paddingLeft: 35 }}
                />
              </div>

              {/* FILTROS */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                {['Todas', 'Pendente', 'Deferida', 'Indeferida'].map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilter(status)}
                      style={{
                        border: `1px solid ${
                          filter === status
                            ? '#164194'
                            : 'var(--seduc-border)'
                        }`,
                        background:
                          filter === status
                            ? 'var(--seduc-blue-soft)'
                            : 'transparent',
                        color:
                          filter === status
                            ? '#164194'
                            : 'var(--seduc-text-main)',
                        borderRadius: 20,
                        padding: '0.35rem 0.7rem',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                      }}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>

              {filteredRequests.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '1.5rem 0.5rem',
                    color: 'var(--seduc-text-secondary)',
                    fontSize: '0.84rem',
                  }}
                >
                  Nenhuma solicitação encontrada.
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    style={{
                      border: '1px solid var(--seduc-border)',
                      borderLeft: `4px solid ${statusColor(request.status)}`,
                      borderRadius: 9,
                      padding: '0.85rem',
                      background: 'var(--seduc-bg-surface)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <strong
                        style={{
                          fontSize: '0.78rem',
                          color: '#164194',
                        }}
                      >
                        {request.protocol}
                      </strong>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: statusColor(request.status),
                        }}
                      >
                        {statusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '0.88rem',
                        margin: '0.5rem 0 0.25rem',
                      }}
                    >
                      {request.disciplineName}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.76rem',
                        color: 'var(--seduc-text-secondary)',
                        margin: 0,
                      }}
                    >
                      {request.className} • {request.type}
                    </p>

                    <p
                      style={{
                        fontSize: '0.76rem',
                        margin: '0.4rem 0',
                      }}
                    >
                      Nova data: <strong>{formatDate(request.proposedDate)}</strong>
                    </p>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedRequest(request)}
                      style={{
                        width: '100%',
                        marginTop: 7,
                        justifyContent: 'center',
                      }}
                    >
                      <Eye size={15} />
                      Ver detalhes da solicitação
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* JANELA DE DETALHES */}
      {selectedRequest && (
        <div
          onClick={() => setSelectedRequest(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: 'var(--seduc-bg-surface)',
              color: 'var(--seduc-text-main)',
              borderRadius: 12,
              width: '100%',
              maxWidth: 620,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.25rem',
              boxShadow: '0 15px 45px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                marginBottom: '1rem',
              }}
            >
              <div>
                <strong style={{ fontSize: '1.05rem' }}>
                  Detalhes da Solicitação
                </strong>

                <div
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--seduc-text-secondary)',
                  }}
                >
                  {selectedRequest.protocol}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{
                  border: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--seduc-text-main)',
                }}
              >
                <X size={21} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                marginBottom: '1rem',
                color: statusColor(selectedRequest.status),
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {statusIcon(selectedRequest.status)}
              {selectedRequest.status}
            </div>

            {[
              ['Modalidade', selectedRequest.type],
              ['Turma', selectedRequest.className],
              ['Disciplina', selectedRequest.disciplineName],
              ['Data original', formatDate(selectedRequest.originalDate)],
              ['Nova data', formatDate(selectedRequest.proposedDate)],
              ['Horário e local', selectedRequest.proposedSlot],
              ['Data do pedido', formatDate(selectedRequest.createdAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--seduc-border)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--seduc-text-secondary)',
                  }}
                >
                  {label}
                </div>

                <strong style={{ fontSize: '0.84rem' }}>
                  {value || 'Não informado'}
                </strong>
              </div>
            ))}

            <div style={{ marginTop: '1rem' }}>
              <strong style={{ fontSize: '0.83rem' }}>Justificativa</strong>

              <p style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                {selectedRequest.reason}
              </p>
            </div>

            <div style={{ marginTop: '0.85rem' }}>
              <strong style={{ fontSize: '0.83rem' }}>Plano de aula</strong>

              <p style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                {selectedRequest.pedagogicalPlan}
              </p>
            </div>

            {selectedRequest.attachment && (
              <div style={{ marginTop: '0.85rem' }}>
                <strong style={{ fontSize: '0.83rem' }}>
                  Documento anexado
                </strong>

                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.8rem',
                    overflowWrap: 'anywhere',
                  }}
                >
                  <FileText size={17} />
                  {selectedRequest.attachment.name}

                  {selectedRequest.attachment.dataUrl && (
                    <a
                      href={selectedRequest.attachment.dataUrl}
                      download={selectedRequest.attachment.name}
                      title="Baixar documento"
                      style={{ color: '#164194' }}
                    >
                      <Download size={17} />
                    </a>
                  )}
                </p>
              </div>
            )}

            <div
              style={{
                marginTop: '1rem',
                padding: '0.9rem',
                borderRadius: 8,
                background: 'var(--seduc-blue-soft)',
              }}
            >
              <strong style={{ fontSize: '0.83rem' }}>
                Parecer da Gestão Acadêmica
              </strong>

              <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>
                {selectedRequest.reviewerNote ||
                  'A solicitação ainda não possui parecer. Aguarde a análise da Gestão Acadêmica.'}
              </p>

              {selectedRequest.reviewedBy && (
                <small
                  style={{
                    display: 'block',
                    marginTop: 8,
                    color: 'var(--seduc-text-secondary)',
                  }}
                >
                  Responsável: {selectedRequest.reviewedBy}
                </small>
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSelectedRequest(null)}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Fechar detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

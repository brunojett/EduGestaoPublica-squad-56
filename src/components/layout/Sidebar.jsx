import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileBadge,
  BookCopy,
  Layers,
  CalendarRange,
  UsersRound,
  UserCheck,
  Gavel,
  ClipboardCheck,
  Award,
  CalendarClock,
  ShieldAlert,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { routes } from '../../routes';

/**
 * Menu lateral dinâmico que exibe as funcionalidades específicas
 * de acordo com o perfil de usuário ativo (DIES, Gestão Acadêmica ou Professor).
 */
export default function Sidebar({ activeRole }) {
  const {
    activeTeacherId,
    setActiveTeacherId,
    teachers,
    exceptionalRequests,
    matrices,
    teachersWithWorkload,
  } = useAcademic();

  const pendingRequests = exceptionalRequests.filter((r) => r.status === 'Pendente').length;
  const pendingMatrices = matrices.filter((m) => !m.authorizedByDies).length;
  const idleTeachers = teachersWithWorkload.filter((t) => t.idleHours > 0).length;

  // Configuração de menus por perfil
  const menuByRole = {
    DIES: {
      badge: 'Órgão Normativo • SEDUC-SE',
      name: 'Diretoria de Inspeção Escolar (DIES)',
      unit: 'Autorização de Escolas, Portarias e Matrizes',
      items: [
        {
          path: routes.DIES.overview,
          label: 'Portarias & Unidades Escolares',
          icon: FileBadge,
        },
        {
          path: routes.DIES.courses,
          label: 'Cursos & Disciplinas',
          icon: BookCopy,
        },
        {
          path: routes.DIES.matrices,
          label: 'Matrizes Curriculares',
          icon: Layers,
          badgeCount: pendingMatrices > 0 ? `${pendingMatrices} pend.` : null,
        },
        {
          path: routes.DIES.requests,
          label: 'Análise de Aulas Excepcionais',
          icon: Gavel,
          badgeCount: pendingRequests > 0 ? pendingRequests : null,
        },
      ],
    },
    GESTAO: {
      badge: 'Sistema Acadêmico • Secretaria/Coord.',
      name: 'Coordenação de Gestão Acadêmica',
      unit: 'Implementação Escolar, Turmas e Alocação',
      items: [
        {
          path: routes.GESTAO.school,
          label: 'Implementar Escola & Calendário',
          icon: CalendarRange,
        },
        {
          path: routes.GESTAO.classes,
          label: 'Turmas, Vagas e Horários',
          icon: UsersRound,
        },
        {
          path: routes.GESTAO.allocation,
          label: 'Distribuição de Professores',
          icon: UserCheck,
          badgeCount: idleTeachers > 0 ? `${idleTeachers} ociosos` : 'OK',
        },
        {
          path: routes.GESTAO.requests,
          label: 'Deferimento de Aulas Excepcionais',
          icon: Gavel,
          badgeCount: pendingRequests > 0 ? pendingRequests : null,
        },
      ],
    },
    PROFESSOR: {
      badge: 'Portal Docente • Diário Eletrônico',
      name:
        teachers.find((t) => t.id === activeTeacherId)?.name ||
        'Prof. MSc. Carlos Eduardo Santana',
      unit: 'Rede Estadual de Ensino de Sergipe',
      items: [
        {
          path: routes.PROFESSOR.attendance,
          label: 'Frequência Diária & Tópicos',
          icon: ClipboardCheck,
        },
        {
          path: routes.PROFESSOR.grades,
          label: 'Lançamento de Notas (Unidades)',
          icon: Award,
        },
        {
          path: routes.PROFESSOR.exceptional,
          label: 'Solicitar Aula Excepcional',
          icon: CalendarClock,
        },
      ],
    },
  };

  const currentProfile = menuByRole[activeRole];

  return (
    <aside className="seduc-sidebar">
      <div>
        {/* Cartão de Identificação do Perfil Logado */}
        <div className="sidebar-profile-card">
          <div className="sidebar-profile-role">{currentProfile.badge}</div>
          <div className="sidebar-profile-name">{currentProfile.name}</div>
          <div className="sidebar-profile-unit">{currentProfile.unit}</div>

          {/* Se estiver no modo Professor, permite alternar entre os docentes da rede */}
          {activeRole === 'PROFESSOR' && (
            <div style={{ marginTop: '0.75rem' }}>
              <label
                htmlFor="teacher-switcher"
                style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}
              >
                Simular Docente Logado:
              </label>
              <select
                id="teacher-switcher"
                className="form-control"
                style={{ padding: '0.4rem 0.55rem', fontSize: '0.78rem' }}
                value={activeTeacherId}
                onChange={(e) => setActiveTeacherId(e.target.value)}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.registration})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Lista de Navegação do Módulo */}
        <div className="sidebar-nav-section-title">Menu do Módulo</div>
        <ul className="sidebar-nav-list">
          {currentProfile.items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink to={item.path} className="sidebar-nav-btn">
                  <span className="sidebar-nav-btn-left">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </span>
                  {item.badgeCount !== undefined && item.badgeCount !== null && (
                    <span className="sidebar-nav-badge">{item.badgeCount}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rodapé informativo do fluxo integrado */}
      <div className="sidebar-footer-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--seduc-blue-primary)', marginBottom: '0.3rem' }}>
          <ShieldAlert size={14} />
          Fluxo Integrado em Tempo Real
        </div>
        <p>
          As alterações feitas pela <strong>DIES</strong> refletem imediatamente na{' '}
          <strong>Gestão Acadêmica</strong> e no <strong>Diário do Professor</strong>.
        </p>
      </div>
    </aside>
  );
}

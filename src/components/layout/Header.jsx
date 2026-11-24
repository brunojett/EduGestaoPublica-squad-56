import React from 'react';
import { Landmark, Building2, BookOpenCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAcademic } from '../../context/AcademicContext';
import { routes } from '../../routes';

/**
 * Cabeçalho principal com a identidade visual da SEDUC Sergipe
 * e seletor rápido entre os 3 perfis de usuários solicitados:
 * 1. ADM (DIES)
 * 2. ADM (Gestão Acadêmica)
 * 3. Professor (Diário Eletrônico)
 */
export default function Header({ activeRole }) {
  const { exceptionalRequests, matrices } = useAcademic();
  const navigate = useNavigate();

  const pendingRequestsCount = exceptionalRequests.filter((r) => r.status === 'Pendente').length;
  const pendingMatricesCount = matrices.filter((m) => !m.authorizedByDies).length;

  return (
    <header className="seduc-header">
      <div className="seduc-header-inner">
        {/* Identidade Institucional SEDUC-SE */}
        <div className="seduc-logo-group">
          <div className="seduc-crest" aria-hidden="true">
            <Landmark size={26} color="#164194" />
          </div>
          <div className="seduc-title-block">
            <h1>
              SIGA • SEDUC SERGIPE
              <span className="seduc-title-badge">SEED-SE</span>
            </h1>
            <p>
              Sistema Integrado de Inspeção Escolar (DIES), Gestão Acadêmica e Diário Eletrônico
            </p>
          </div>
        </div>

        {/* Seletor Rápido de Perfil de Usuário */}
        <div className="role-switcher-wrapper" role="navigation" aria-label="Alternar Perfil de Usuário">
          <span className="role-switcher-label">
            <Users size={14} />
            Perfil Ativo:
          </span>

          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'DIES' ? 'active' : ''}`}
            onClick={() => navigate(routes.DIES.overview)}
          >
            <Landmark size={15} />
            <span>ADM • DIES</span>
            {pendingMatricesCount > 0 && (
              <span className="role-counter-pill" title="Matrizes aguardando homologação">
                {pendingMatricesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'GESTAO' ? 'active' : ''}`}
            onClick={() => navigate(routes.GESTAO.school)}
          >
            <Building2 size={15} />
            <span>ADM • Gestão Acadêmica</span>
            {pendingRequestsCount > 0 && (
              <span className="role-counter-pill" title="Aulas excepcionais pendentes de análise">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`role-tab-btn ${activeRole === 'PROFESSOR' ? 'active' : ''}`}
            onClick={() => navigate(routes.PROFESSOR.attendance)}
          >
            <BookOpenCheck size={15} />
            <span>Professor • Diário</span>
          </button>
        </div>
      </div>
    </header>
  );
}

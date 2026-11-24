import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_SCHOOLS,
  INITIAL_ORDINANCES,
  INITIAL_COURSES,
  INITIAL_DISCIPLINES,
  INITIAL_MATRICES,
  INITIAL_CALENDAR,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_DIARY_LOGS,
  INITIAL_EXCEPTIONAL_REQUESTS,
} from '../data/mockData';

/**
 * ============================================================================
 * CONTEXTO GLOBAL ACADÊMICO (AcademicContext)
 * ============================================================================
 * Nota didática para estudantes do 2º período:
 * A Context API do React permite compartilhar estados e funções entre todos os
 * componentes da árvore sem precisar passar propriedades manualmente de pai para
 * filho em muitos níveis (evitando o chamado "Prop Drilling").
 */
const AcademicContext = createContext(null);

const STORAGE_KEY = '@seed_sergipe_academico_v1';

export function AcademicProvider({ children }) {
  // 1. Perfil ativo: 'DIES' | 'GESTAO' | 'PROFESSOR'
  const [activeRole, setActiveRole] = useState('DIES');
  const [activeTab, setActiveTab] = useState('dies-overview');
  const [activeTeacherId, setActiveTeacherId] = useState('prof-1');
  const [highContrast, setHighContrast] = useState(false);
  const [toast, setToast] = useState(null);

  // Função auxiliar para carregar estado salvo no navegador (localStorage)
  const loadSavedData = (key, fallback) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed[key] !== undefined ? parsed[key] : fallback;
    } catch {
      return fallback;
    }
  };

  // 2. Estados principais da aplicação
  const [schools, setSchools] = useState(() => loadSavedData('schools', INITIAL_SCHOOLS));
  const [ordinances, setOrdinances] = useState(() => loadSavedData('ordinances', INITIAL_ORDINANCES));
  const [courses, setCourses] = useState(() => loadSavedData('courses', INITIAL_COURSES));
  const [disciplines, setDisciplines] = useState(() => loadSavedData('disciplines', INITIAL_DISCIPLINES));
  const [matrices, setMatrices] = useState(() => loadSavedData('matrices', INITIAL_MATRICES));
  const [calendar, setCalendar] = useState(() => loadSavedData('calendar', INITIAL_CALENDAR));
  const [teachers, setTeachers] = useState(() => loadSavedData('teachers', INITIAL_TEACHERS));
  const [classes, setClasses] = useState(() => loadSavedData('classes', INITIAL_CLASSES));
  const [students, setStudents] = useState(() => loadSavedData('students', INITIAL_STUDENTS));
  const [diaryLogs, setDiaryLogs] = useState(() => loadSavedData('diaryLogs', INITIAL_DIARY_LOGS));
  const [exceptionalRequests, setExceptionalRequests] = useState(() =>
    loadSavedData('exceptionalRequests', INITIAL_EXCEPTIONAL_REQUESTS)
  );

  // Salva automaticamente no localStorage sempre que um dado acadêmico muda
  useEffect(() => {
    const payload = {
      schools,
      ordinances,
      courses,
      disciplines,
      matrices,
      calendar,
      teachers,
      classes,
      students,
      diaryLogs,
      exceptionalRequests,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    schools,
    ordinances,
    courses,
    disciplines,
    matrices,
    calendar,
    teachers,
    classes,
    students,
    diaryLogs,
    exceptionalRequests,
  ]);

  // Aplica ou remove a classe de Alto Contraste no <body>
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Exibe notificação flutuante por 4 segundos
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((current) => (current ? null : current));
    }, 4000);
  };

  // Troca o perfil ativo e posiciona na primeira tela correspondente
  const switchRole = (newRole) => {
    setActiveRole(newRole);
    if (newRole === 'DIES') setActiveTab('dies-overview');
    if (newRole === 'GESTAO') setActiveTab('gestao-school');
    if (newRole === 'PROFESSOR') setActiveTab('prof-attendance');
  };

  // ==========================================================================
  // AÇÕES DO MÓDULO 1: ADM — DIES (Inspeção Escolar e Normatização)
  // ==========================================================================
  const addOrdinance = (newOrd) => {
    const created = {
      ...newOrd,
      id: `port-${Date.now()}`,
      status: 'Vigente',
    };
    setOrdinances((prev) => [created, ...prev]);
    showToast(`Portaria "${created.number}" publicada com sucesso pela DIES!`);
  };

  const addSchool = (newSchool) => {
    const created = {
      ...newSchool,
      id: `esc-${Date.now()}`,
      implementedMatrices: [],
    };
    setSchools((prev) => [created, ...prev]);
    showToast(`Unidade Escolar "${created.name}" credenciada pela DIES!`);
  };

  const addCourse = (newCourse) => {
    const created = {
      ...newCourse,
      id: `cur-${Date.now()}`,
      totalHours: Number(newCourse.totalHours) || 3000,
      status: 'Autorizado DIES',
    };
    setCourses((prev) => [created, ...prev]);
    showToast(`Curso "${created.name}" cadastrado no catálogo da Rede Estadual!`);
  };

  const deleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    showToast('Curso removido do catálogo.', 'warning');
  };

  const addDiscipline = (newDisc) => {
    const weekly = Number(newDisc.weeklyHours) || 2;
    const created = {
      ...newDisc,
      id: `disc-${Date.now()}`,
      weeklyHours: weekly,
      annualHours: Number(newDisc.annualHours) || weekly * 40,
    };
    setDisciplines((prev) => [...prev, created]);
    showToast(`Disciplina "${created.name}" (${created.code}) adicionada!`);
  };

  const deleteDiscipline = (discId) => {
    setDisciplines((prev) => prev.filter((d) => d.id !== discId));
    showToast('Disciplina removida do catálogo.', 'warning');
  };

  const addMatrix = (newMatrix) => {
    const created = {
      ...newMatrix,
      id: `mat-${Date.now()}`,
      year: Number(newMatrix.year) || 2026,
    };
    setMatrices((prev) => [created, ...prev]);
    showToast(
      created.authorizedByDies
        ? `Matriz "${created.code}" criada e homologada pela DIES!`
        : `Matriz "${created.code}" cadastrada (aguardando homologação DIES).`
    );
  };

  const toggleMatrixAuthorization = (matrixId, ordinanceNumber) => {
    setMatrices((prev) =>
      prev.map((m) => {
        if (m.id !== matrixId) return m;
        const nextStatus = !m.authorizedByDies;
        return {
          ...m,
          authorizedByDies: nextStatus,
          ordinanceNumber: nextStatus
            ? ordinanceNumber || m.ordinanceNumber || 'Portaria SEDUC/DIES nº 215/2026'
            : 'Em Tramitação na DIES',
        };
      })
    );
    showToast('Status de autorização da Matriz Curricular atualizado pela DIES!');
  };

  // ==========================================================================
  // AÇÕES DO MÓDULO 2: ADM — GESTÃO ACADÊMICA (Secretaria / Coordenação)
  // ==========================================================================
  const implementMatrixInSchool = (schoolId, matrixId) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id !== schoolId) return school;
        const exists = school.implementedMatrices.includes(matrixId);
        const updated = exists
          ? school.implementedMatrices.filter((id) => id !== matrixId)
          : [...school.implementedMatrices, matrixId];
        return {
          ...school,
          status: 'Ativa',
          implementedMatrices: updated,
        };
      })
    );
    showToast('Implementação de Matriz Curricular na Escola atualizada pela Gestão Acadêmica!');
  };

  const addCalendarEvent = (newEvent) => {
    const created = { ...newEvent, id: `ev-${Date.now()}` };
    setCalendar((prev) => ({
      ...prev,
      events: [...prev.events, created].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    showToast(`Evento "${created.title}" registrado no Calendário Acadêmico!`);
  };

  const addClass = (newClassData) => {
    const created = {
      ...newClassData,
      id: `tur-${Date.now()}`,
      maxSeats: Number(newClassData.maxSeats) || 40,
      enrolledCount: Number(newClassData.enrolledCount) || 0,
      schedule: newClassData.schedule || [],
    };
    setClasses((prev) => [created, ...prev]);
    showToast(`Turma "${created.code}" criada com limite de ${created.maxSeats} vagas!`);
  };

  const deleteClass = (classId) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    showToast('Turma removida do sistema acadêmico.', 'warning');
  };

  // Alocação de horário e professor em uma turma
  const allocateTeacherToSchedule = (classId, scheduleItem) => {
    const itemWithId = { ...scheduleItem, id: `aloc-${Date.now()}` };
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          schedule: [...cls.schedule, itemWithId],
        };
      })
    );
    showToast('Professor e horário alocados na turma com sucesso!');
  };

  const removeScheduleItem = (classId, scheduleId) => {
    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          schedule: cls.schedule.filter((item) => item.id !== scheduleId),
        };
      })
    );
    showToast('Alocação removida da grade horária.');
  };

  // Cálculo em tempo real da Carga Horária de cada Professor (Orquestração Anti-Ociosidade)
  const teachersWithWorkload = useMemo(() => {
    return teachers.map((teacher) => {
      const allocations = [];
      let allocatedHours = 0;

      classes.forEach((cls) => {
        const school = schools.find((s) => s.id === cls.schoolId);
        cls.schedule.forEach((slotItem) => {
          if (slotItem.teacherId === teacher.id) {
            const disc = disciplines.find((d) => d.id === slotItem.disciplineId);
            const hours = disc ? disc.weeklyHours : 4;
            allocatedHours += hours;
            allocations.push({
              scheduleId: slotItem.id,
              classId: cls.id,
              classCode: cls.code,
              schoolName: school ? school.name : 'Rede Estadual',
              day: slotItem.day,
              slot: slotItem.slot,
              disciplineName: disc ? disc.name : 'Disciplina',
              weeklyHours: hours,
            });
          }
        });
      });

      const idleHours = Math.max(0, teacher.contractedRegencyHours - allocatedHours);
      const overloadHours = Math.max(0, allocatedHours - teacher.contractedRegencyHours);
      const occupancyPercent = Math.min(
        100,
        Math.round((allocatedHours / teacher.contractedRegencyHours) * 100)
      );

      let workloadStatus = 'IDLE'; // Ocioso
      if (idleHours === 0 && overloadHours === 0) workloadStatus = 'OPTIMAL'; // Carga completa ideal
      if (overloadHours > 0) workloadStatus = 'OVERLOAD'; // Sobrecarga

      return {
        ...teacher,
        allocatedHours,
        idleHours,
        overloadHours,
        occupancyPercent,
        workloadStatus,
        allocations,
      };
    });
  }, [teachers, classes, disciplines, schools]);

  // Análise e decisão (Deferimento / Indeferimento) de Aulas Excepcionais
  const reviewExceptionalRequest = (requestId, decisionStatus, reviewerNote) => {
    setExceptionalRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: decisionStatus, // 'Deferida' ou 'Indeferida'
          reviewerNote:
            reviewerNote ||
            (decisionStatus === 'Deferida'
              ? 'Solicitação deferida pela Gestão Acadêmica conforme calendário escolar.'
              : 'Solicitação indeferida por incompatibilidade de calendário/espaço físico.'),
          reviewedBy: 'Coordenação de Gestão Acadêmica — SEDUC/SE',
        };
      })
    );
    showToast(`Solicitação de aula excepcional ${decisionStatus.toUpperCase()} com sucesso!`);
  };

  // ==========================================================================
  // AÇÕES DO MÓDULO 3: PROFESSOR (Diário Eletrônico)
  // ==========================================================================
  const registerAttendanceAndTopic = ({
    date,
    classId,
    disciplineId,
    teacherId,
    lessonsCount,
    topic,
    methodology,
    attendanceMap,
  }) => {
    const numLessons = Number(lessonsCount) || 2;
    let presentCount = 0;
    let absentCount = 0;

    // Atualiza o contador de aulas e faltas de cada aluno da turma
    setStudents((prevStudents) =>
      prevStudents.map((stu) => {
        if (stu.classId !== classId) return stu;
        const status = attendanceMap[stu.id] || 'P';
        if (status === 'F') {
          absentCount += 1;
          return {
            ...stu,
            totalClassesHeld: stu.totalClassesHeld + numLessons,
            absences: stu.absences + numLessons,
          };
        }
        presentCount += 1;
        return {
          ...stu,
          totalClassesHeld: stu.totalClassesHeld + numLessons,
        };
      })
    );

    const newLog = {
      id: `log-${Date.now()}`,
      date,
      classId,
      disciplineId,
      teacherId,
      lessonsCount: numLessons,
      topic,
      methodology,
      presentCount,
      absentCount,
    };

    setDiaryLogs((prev) => [newLog, ...prev]);
    showToast('Frequência diária e conteúdo ministrado registrados no Diário Eletrônico!');
  };

  const updateStudentGrades = (studentId, unitKey, updatedUnitGrades) => {
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id !== studentId) return stu;
        return {
          ...stu,
          grades: {
            ...stu.grades,
            [unitKey]: {
              ...stu.grades[unitKey],
              ...updatedUnitGrades,
            },
          },
        };
      })
    );
  };

  const createExceptionalRequest = (formData) => {
    const teacher = teachers.find((t) => t.id === formData.teacherId) || teachers[0];
    const targetClass = classes.find((c) => c.id === formData.classId) || classes[0];
    const school = schools.find((s) => s.id === targetClass?.schoolId);

    const created = {
      id: `req-${Date.now()}`,
      protocol: `SEDUC-AEX-2026/${Math.floor(100 + Math.random() * 899)}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      schoolName: school ? school.name : 'Centro de Excelência Atheneu Sergipense',
      classId: targetClass.id,
      className: targetClass.code,
      disciplineName: formData.disciplineName,
      type: formData.type, // 'Reposição de Aula' ou 'Antecipação de Aula'
      originalDate: formData.originalDate,
      proposedDate: formData.proposedDate,
      proposedSlot: formData.proposedSlot,
      reason: formData.reason,
      pedagogicalPlan: formData.pedagogicalPlan,
attachment: formData.attachment || null,
status: 'Pendente',
      createdAt: new Date().toISOString().slice(0, 10),
      reviewerNote: '',
      reviewedBy: '',
    };

    setExceptionalRequests((prev) => [created, ...prev]);
    showToast(
      `Solicitação ${created.protocol} (${created.type}) enviada para análise da Gestão Acadêmica!`
    );
  };

  // Restaura os dados originais de demonstração
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSchools(INITIAL_SCHOOLS);
    setOrdinances(INITIAL_ORDINANCES);
    setCourses(INITIAL_COURSES);
    setDisciplines(INITIAL_DISCIPLINES);
    setMatrices(INITIAL_MATRICES);
    setCalendar(INITIAL_CALENDAR);
    setTeachers(INITIAL_TEACHERS);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setDiaryLogs(INITIAL_DIARY_LOGS);
    setExceptionalRequests(INITIAL_EXCEPTIONAL_REQUESTS);
    showToast('Base de dados restaurada para o padrão inicial da SEDUC-SE!');
  };

  const value = {
    activeRole,
    setActiveRole,
    switchRole,
    activeTab,
    setActiveTab,
    activeTeacherId,
    setActiveTeacherId,
    highContrast,
    setHighContrast,
    toast,
    showToast,
    resetDemoData,

    // Dados
    schools,
    ordinances,
    courses,
    disciplines,
    matrices,
    calendar,
    teachers,
    teachersWithWorkload,
    classes,
    students,
    diaryLogs,
    exceptionalRequests,

    // Ações DIES
    addOrdinance,
    addSchool,
    addCourse,
    deleteCourse,
    addDiscipline,
    deleteDiscipline,
    addMatrix,
    toggleMatrixAuthorization,

    // Ações Gestão Acadêmica
    implementMatrixInSchool,
    addCalendarEvent,
    addClass,
    deleteClass,
    allocateTeacherToSchedule,
    removeScheduleItem,
    reviewExceptionalRequest,

    // Ações Professor
    registerAttendanceAndTopic,
    updateStudentGrades,
    createExceptionalRequest,
  };

  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic deve ser utilizado dentro de um AcademicProvider');
  }
  return context;
}

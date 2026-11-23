import React, { useMemo, useState } from "react";

const INITIAL_COURSES = [
  { id: "1", title: "Matriz 2025 — 1º ano", category: "Ensino Médio" },
  { id: "2", title: "Matriz 2025 — 2º ano", category: "Ensino Médio" },
  { id: "3", title: "Matriz Regular — 6º ano", category: "Ensino Fundamental II" },
  { id: "4", title: "Matriz Regular — 7º ano", category: "Ensino Fundamental II" },
  { id: "5", title: "Formação Geral Básica", category: "Educação de Jovens e Adultos" },
  { id: "6", title: "Matriz Integral — 1º ano", category: "Ensino Médio Integral" },
];

const CALENDAR_EVENTS = [
  { id: "ev-1", title: "Início do 1º Bimestre", date: "10/02/2026", type: "bimestre", label: "Bimestre" },
  { id: "ev-2", title: "Encerramento do 1º Bimestre", date: "17/04/2026", type: "bimestre", label: "Bimestre" },
  { id: "ev-3", title: "Confraternização Universal", date: "01/01/2026", type: "feriado", label: "Feriado" },
  { id: "ev-4", title: "Paixão de Cristo", date: "03/04/2026", type: "feriado", label: "Feriado" },
  { id: "ev-5", title: "Tiradentes", date: "21/04/2026", type: "feriado", label: "Feriado" },
  { id: "ev-6", title: "Dia do Trabalhador", date: "01/05/2026", type: "feriado", label: "Feriado" },
  { id: "ev-7", title: "Corpus Christi", date: "04/06/2026", type: "feriado", label: "Feriado" },
  { id: "ev-8", title: "Independência do Brasil", date: "07/09/2026", type: "feriado", label: "Feriado" },
  { id: "ev-9", title: "Nossa Senhora Aparecida", date: "12/10/2026", type: "feriado", label: "Feriado" },
  { id: "ev-10", title: "Finados", date: "02/11/2026", type: "feriado", label: "Feriado" },
  { id: "ev-11", title: "Proclamação da República", date: "15/11/2026", type: "feriado", label: "Feriado" },
  { id: "ev-12", title: "Dia Nacional de Zumbi e da Consciência Negra", date: "20/11/2026", type: "feriado", label: "Feriado" },
  { id: "ev-13", title: "Natal", date: "25/12/2026", type: "feriado", label: "Feriado" },
  { id: "ev-14", title: "Reposição de Aula — Projeto Pedagógico", date: "09/05/2026", type: "sabado_letivo", label: "Sábado letivo" },
  { id: "ev-15", title: "Conselho de Classe e Feira Cultural", date: "23/05/2026", type: "sabado_letivo", label: "Sábado letivo" },
];

const COURSE_CATEGORIES = [
  "Ensino Médio",
  "Ensino Fundamental II",
  "Educação de Jovens e Adultos",
  "Ensino Médio Integral",
];

const EVENT_FILTER_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "bimestre", label: "Bimestre" },
  { value: "feriado", label: "Feriado" },
  { value: "sabado_letivo", label: "Sábado letivo" },
];

function normalizeEventType(type = "") {
  return String(type)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

export default function SchoolImplementation() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedEventType, setSelectedEventType] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState(COURSE_CATEGORIES[0]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "todos") return courses;
    return courses.filter((course) => course.category === selectedCategory);
  }, [courses, selectedCategory]);

  const filteredEvents = useMemo(() => {
    if (selectedEventType === "todos") return CALENDAR_EVENTS;
    return CALENDAR_EVENTS.filter(
      (event) => normalizeEventType(event.type) === selectedEventType
    );
  }, [selectedEventType]);

  function handleRemoveCourse(id) {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  }

  function handleRestoreCourses() {
    setCourses(INITIAL_COURSES);
    setSelectedCategory("todos");
  }

  function handleAddCourse(e) {
    e.preventDefault();
    const trimmedTitle = courseTitle.trim();
    if (!trimmedTitle) return;

    const newCourse = {
      id: Date.now().toString(),
      title: trimmedTitle,
      category: courseCategory,
    };

    setCourses((prev) => [newCourse, ...prev]);
    setCourseTitle("");
    setCourseCategory(COURSE_CATEGORIES[0]);
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#eef3f2] font-sans text-slate-800 antialiased flex flex-col lg:flex-row">
      {/* Barra lateral */}
      <aside className="w-full lg:w-64 bg-[#0d4738] text-white flex-shrink-0 flex flex-col justify-between p-4 lg:p-6 shadow-lg">
        <div>
          <div className="flex items-center space-x-3 mb-6 lg:mb-10">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white">
              <span className="font-bold text-sm">EG</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide">EduGestão</h1>
              <span className="text-xs text-[#cce7e1] font-medium tracking-wider uppercase block">
                Pública
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            <a
              href="#coursesSection"
              className="flex items-center space-x-3 px-3.5 py-3 rounded-xl bg-white/10 text-white font-semibold transition-all"
            >
              <span className="text-sm">Matrizes Curriculares</span>
            </a>
            <a
              href="#calendarSection"
              className="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-[#cce7e1] hover:bg-white/5 hover:text-white font-medium transition-all"
            >
              <span className="text-sm">Calendário Escolar</span>
            </a>
            <a
              href="#coursesSection"
              className="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-[#cce7e1] hover:bg-white/5 hover:text-white font-medium transition-all"
            >
              <span className="text-sm">Turmas &amp; Alunos</span>
            </a>
            <a
              href="#coursesSection"
              className="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-[#cce7e1] hover:bg-white/5 hover:text-white font-medium transition-all"
            >
              <span className="text-sm">Relatórios</span>
            </a>
            <a
              href="#coursesSection"
              className="flex items-center space-x-3 px-3.5 py-3 rounded-xl text-[#cce7e1] hover:bg-white/5 hover:text-white font-medium transition-all"
            >
              <span className="text-sm">Configurações</span>
            </a>
          </nav>
        </div>

        <div className="hidden lg:flex items-center space-x-3 pt-6 border-t border-white/10">
          <div className="w-9 h-9 bg-[#0a3a2e] rounded-full flex items-center justify-center font-bold text-sm text-[#cce7e1]">
            GA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Gestão Acadêmica</p>
            <p className="text-[11px] text-[#cce7e1] truncate">Secretaria de Educação</p>
          </div>
        </div>
      </aside>

      {/* Área principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-1">
              EduGestão Pública &bull; Módulo Acadêmico
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Matrizes Curriculares
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label="Adicionar Nova Matriz"
            className="inline-flex items-center justify-center space-x-2 bg-[#0d4738] hover:bg-[#0a3a2e] active:scale-95 transition-all text-white px-5 py-3 rounded-2xl shadow-md font-semibold text-sm"
          >
            <span>+ Nova Matriz</span>
          </button>
        </header>

        {/* Painel de filtros e contador de matrizes */}
        <section className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200/70">
          <div className="sm:col-span-8 lg:col-span-6 space-y-1">
            <label
              htmlFor="categoryFilter"
              className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >
              Filtrar por curso / modalidade
            </label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0d4738] transition-all cursor-pointer text-sm"
            >
              <option value="todos">Todos os cursos</option>
              {COURSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 lg:col-span-6 flex sm:justify-end items-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="flex items-center space-x-2 bg-[#e6f3f0] px-4 py-2 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Matrizes Cadastradas:
              </span>
              <span className="text-base font-bold text-[#0d4738] min-w-[24px] text-center">
                {filteredCourses.length}
              </span>
            </div>
          </div>
        </section>

        {/* Grid de matrizes ou estado vazio */}
        {filteredCourses.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhuma matriz cadastrada</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Não foram encontrados itens para o filtro selecionado ou todas as matrizes foram desativadas.
            </p>
            <button
              type="button"
              onClick={handleRestoreCourses}
              className="px-5 py-2.5 bg-[#0d4738] hover:bg-[#0a3a2e] active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              Restaurar Lista Inicial
            </button>
          </section>
        ) : (
          <section id="coursesSection" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-11 h-11 bg-[#e6f3f0] rounded-xl flex items-center justify-center flex-shrink-0 text-[#0d4738] font-bold text-xs">
                    MAT
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-[14px] leading-snug truncate pr-2">
                      {course.title}
                    </h3>
                    <span className="inline-block mt-1 bg-slate-100 text-slate-500 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCourse(course.id)}
                  title="Desativar matriz"
                  aria-label={`Desativar matriz ${course.title}`}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-semibold"
                >
                  Remover
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Calendário escolar e filtro por tipo de evento (#420) */}
        <section
          id="calendarSection"
          className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200/70 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-1">
                Implementação Escolar &bull; Calendário
              </span>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                Eventos do Calendário Escolar
              </h3>
            </div>

            <div className="w-full sm:w-72 space-y-1">
              <label
                htmlFor="eventTypeFilter"
                className="block text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                Filtrar por tipo de evento
              </label>
              <select
                id="eventTypeFilter"
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0d4738] transition-all cursor-pointer text-sm"
              >
                {EVENT_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Eventos exibidos conforme o tipo selecionado</span>
            <span className="font-semibold text-[#0a3a2e] bg-[#e6f3f0] px-3 py-1 rounded-full">
              Total: {filteredEvents.length}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-semibold text-slate-700">
                Nenhum evento encontrado para este filtro
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Selecione outro tipo de evento ou escolha &ldquo;Todos&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-[#e6f3f0] text-[#0d4738] rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      CAL
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{event.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{event.date}</p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 bg-[#e6f3f0] text-[#0a3a2e] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {event.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal de cadastro de nova matriz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h3 className="text-lg font-bold text-slate-800">Cadastrar Nova Matriz</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label
                  htmlFor="courseTitleInput"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Nome da Matriz
                </label>
                <input
                  type="text"
                  id="courseTitleInput"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Ex: Matriz 2026 — 3º ano"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4738]"
                />
              </div>

              <div>
                <label
                  htmlFor="courseCategoryInput"
                  className="block text-sm font-semibold text-slate-700 mb-1"
                >
                  Categoria / Modalidade
                </label>
                <select
                  id="courseCategoryInput"
                  required
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d4738]"
                >
                  {COURSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0d4738] hover:bg-[#0a3a2e] text-white font-semibold rounded-xl text-sm shadow-md transition-all"
                >
                  Salvar Matriz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

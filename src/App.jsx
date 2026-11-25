import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AcademicProvider } from './context/AcademicContext';
import GovTopBar from './components/layout/GovTopBar';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Toast from './components/common/Toast';
import DiesDashboard from './pages/dies/DiesDashboard';
import CoursesManager from './pages/dies/CoursesManager';
import MatricesManager from './pages/dies/MatricesManager';
import SchoolImplementation from './pages/gestao/SchoolImplementation';
import ClassesManager from './pages/gestao/ClassesManager';
import TeacherAllocation from './pages/gestao/TeacherAllocation';
import ExceptionalClassesReview from './pages/gestao/ExceptionalClassesReview';
import AttendanceDiary from './pages/professor/AttendanceDiary';
import GradesEntry from './pages/professor/GradesEntry';
import ExceptionalClassRequest from './pages/professor/ExceptionalClassRequest';
import { routes } from './routes';

function MainWorkspace() {
  const { pathname } = useLocation();
  const profile = pathname.split('/')[1].toUpperCase();
  const activeRole = routes[profile] ? profile : 'DIES';
  const { DIES, GESTAO, PROFESSOR } = routes;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GovTopBar />
      <Header activeRole={activeRole} />
      <div className="app-shell">
        <Sidebar activeRole={activeRole} />
        <main>
          <Routes>
            <Route path="/dies" element={<Navigate to={DIES.overview} replace />} />
            <Route path={DIES.overview} element={<DiesDashboard />} />
            <Route path={DIES.courses} element={<CoursesManager />} />
            <Route path={DIES.matrices} element={<MatricesManager />} />
            <Route path={DIES.requests} element={<ExceptionalClassesReview />} />

            <Route path="/gestao" element={<Navigate to={GESTAO.school} replace />} />
            <Route path={GESTAO.school} element={<SchoolImplementation />} />
            <Route path={GESTAO.classes} element={<ClassesManager />} />
            <Route path={GESTAO.allocation} element={<TeacherAllocation />} />
            <Route path={GESTAO.requests} element={<ExceptionalClassesReview />} />

            <Route path="/professor" element={<Navigate to={PROFESSOR.attendance} replace />} />
            <Route path={PROFESSOR.attendance} element={<AttendanceDiary />} />
            <Route path={PROFESSOR.grades} element={<GradesEntry />} />
            <Route path={PROFESSOR.exceptional} element={<ExceptionalClassRequest />} />

            <Route path="*" element={<Navigate to={DIES.overview} replace />} />
          </Routes>
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AcademicProvider>
        <MainWorkspace />
      </AcademicProvider>
    </BrowserRouter>
  );
}

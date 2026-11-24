import React, { useEffect, useRef } from 'react';
import './StudentReportModal.css';

const units = ['u1', 'u2', 'u3', 'u4'];

export default function StudentReportModal({ student, calculateUnitAverage, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  const unitAverages = units.map((unit) => calculateUnitAverage(student.grades[unit]));
  const annualAverage = unitAverages.reduce((total, average) => total + average, 0) / units.length;
  const { totalClassesHeld, absences } = student;
  const attendance = totalClassesHeld > 0
    ? `${Math.round(((totalClassesHeld - absences) / totalClassesHeld) * 100)}%`
    : 'Sem aulas registradas';

  return (
    <dialog
      ref={dialogRef}
      className="student-report-modal"
      aria-labelledby="student-report-title"
      onClose={onClose}
    >
      <h2 id="student-report-title">Boletim escolar</h2>
      <p>{student.name} · Matrícula {student.enrollment}</p>

      <div className="table-responsive">
        <table className="seduc-table">
          <thead>
            <tr>
              <th>Unidade</th>
              <th>AV1</th>
              <th>AV2</th>
              <th>Qualitativa</th>
              <th>Recuperação</th>
              <th>Média</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit, index) => {
              const grades = student.grades[unit] || {};

              return (
                <tr key={unit}>
                  <td>{index + 1}ª Unidade</td>
                  <td>{grades.av1 ?? '—'}</td>
                  <td>{grades.av2 ?? '—'}</td>
                  <td>{grades.qual ?? '—'}</td>
                  <td>{grades.rec ?? '—'}</td>
                  <td>{unitAverages[index].toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p><strong>Média anual final:</strong> {annualAverage.toFixed(1)}</p>
      <p><strong>Frequência acumulada:</strong> {attendance}</p>

      <form method="dialog">
        <button type="submit" className="btn btn-primary">Fechar</button>
      </form>
    </dialog>
  );
}

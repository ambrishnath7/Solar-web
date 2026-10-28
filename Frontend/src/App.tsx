import { useState } from 'react';
import { Header } from './components/Header';
import { MaintenanceForm } from './components/MaintenanceForm';
import { AdminDashboard } from './components/AdminDashboard';
import type { MaintenanceReport } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');
  const [reportToEdit, setReportToEdit] = useState<MaintenanceReport | null>(null);

  const handleEditReport = (report: MaintenanceReport) => {
    setReportToEdit(report);
    setCurrentView('form');
  };

  const handleCancelEdit = () => {
    setReportToEdit(null);
    setCurrentView('admin');
  };

  const handleReportSubmitted = () => {
    setReportToEdit(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6">
        {currentView === 'form' ? (
          <MaintenanceForm
            initialReport={reportToEdit}
            onSubmitted={handleReportSubmitted}
            onCancelEdit={reportToEdit ? handleCancelEdit : undefined}
          />
        ) : (
          <AdminDashboard onEditReport={handleEditReport} />
        )}
      </main>
    </div>
  );
}

export default App;

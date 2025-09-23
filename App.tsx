
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './features/DashboardView';
import { SchedulerView } from './features/SchedulerView';
import { IssueTrackerView } from './features/IssueTrackerView';
import { ResourceManagerView } from './features/ResourceManagerView';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'scheduler':
        return <SchedulerView />;
      case 'issue-tracker':
        return <IssueTrackerView />;
      case 'resource-manager':
        return <ResourceManagerView />;
      default:
        return <DashboardView />;
    }
  }, [currentView]);

  return (
    <div className="flex h-screen bg-slate-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto transition-all duration-300">
        <div className="p-6 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;

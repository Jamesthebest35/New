
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './features/DashboardView';
import { View } from './types';
import { ContentStudioView } from './features/marketing/ContentStudioView';
import { CampaignPlannerView } from './features/marketing/CampaignPlannerView';
import { SEOAssistantView } from './features/marketing/SEOAssistantView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'content-studio':
        return <ContentStudioView />;
      case 'campaign-planner':
        return <CampaignPlannerView />;
      case 'seo-assistant':
        return <SEOAssistantView />;
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

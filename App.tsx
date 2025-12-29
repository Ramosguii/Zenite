import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { CreativeAnalyzer } from './components/CreativeAnalyzer';
import { RedirectGenerator } from './components/RedirectGenerator';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.CHAT:
        return <ChatInterface />;
      case AppView.ANALYZER:
        return <CreativeAnalyzer />;
      case AppView.REDIRECT:
        return <RedirectGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 ml-64 p-8 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

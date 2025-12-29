import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, MessageSquare, ScanEye, Link, Zap, Beaker } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.CHAT, label: 'Zynt Chat', icon: MessageSquare },
    { id: AppView.ANALYZER, label: 'Zynt Creative Lab', icon: Beaker },
    { id: AppView.REDIRECT, label: 'Gerador de Links', icon: Link },
  ];

  return (
    <div className="w-64 h-screen bg-[#080808] border-r border-[#1F1F1F] flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-2 border-b border-[#1F1F1F]">
        <Zap className="w-6 h-6 text-[#A1E432]" />
        <h1 className="text-xl font-bold tracking-tighter text-white">
          ZYNT <span className="text-[#A1E432]">IA</span>
        </h1>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentView === item.id
                ? 'bg-[#1A2414] text-[#A1E432] border border-[#A1E432]/20'
                : 'text-[#8A8A8A] hover:bg-[#121212] hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <img
            src="https://picsum.photos/40/40"
            alt="User"
            className="w-10 h-10 rounded-full border border-[#1F1F1F]"
          />
          <div>
            <p className="text-sm font-medium text-white">Media Buyer</p>
            <p className="text-xs text-[#A1E432]">Plano Shark</p>
          </div>
        </div>
      </div>
    </div>
  );
};

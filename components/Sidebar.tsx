
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
    item: typeof NAV_ITEMS[0];
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 transition-colors duration-200 rounded-lg ${
            isActive
                ? 'bg-sky-500 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
        }`}
    >
        <span className="mr-4">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-slate-800/50 backdrop-blur-sm flex-shrink-0 p-4 border-r border-slate-700/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-10 px-2">
           <div className="bg-yellow-400 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" transform="rotate(90 12 12)" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Construct<span className="text-sky-400">AI</span>
          </h1>
        </div>
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
                key={item.id}
                item={item}
                isActive={currentView === item.id}
                onClick={() => setCurrentView(item.id)}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto">
         <div className="p-4 bg-slate-700/50 rounded-lg text-center text-sm text-slate-400">
            <p>You are using the Enterprise AI Agent.</p>
            <a href="#" className="text-sky-400 hover:underline">Upgrade Plan</a>
        </div>
        <div className="flex items-center mt-6 p-2">
          <img
            src="https://picsum.photos/seed/user/100/100"
            alt="User"
            className="w-10 h-10 rounded-full object-cover mr-4"
          />
          <div>
            <p className="font-semibold text-slate-200">John Doe</p>
            <p className="text-xs text-slate-400">Project Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

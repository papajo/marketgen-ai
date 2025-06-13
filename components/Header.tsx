import React from 'react';
import { IconPlus, IconUser } from '../constants';

interface HeaderProps {
  currentPageName: string;
  onNewProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPageName, onNewProject }) => {
  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-30 border-b border-slate-200">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <h1 className="text-xl font-bold text-slate-800">{currentPageName}</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={onNewProject}
            className="bg-indigo-600 text-white px-3 py-2 sm:px-4 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Create New Project"
          >
            <IconPlus className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">New Project</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-200 transition-colors" title="User Profile">
            <IconUser className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

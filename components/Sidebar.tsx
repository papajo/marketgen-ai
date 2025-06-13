
import React from 'react';
import { Page, NavigationItem } from '../types';
import { IconCpuChip } from '../constants';

interface SidebarProps {
  navItems: NavigationItem[];
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, currentPage, onNavigate }) => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-5 lg:pb-4">
      <div className="flex items-center flex-shrink-0 px-6">
        <IconCpuChip className="h-8 w-auto text-indigo-600" />
        <span className="ml-3 text-xl font-bold text-slate-800">GenAI Studio</span>
      </div>
      <nav className="mt-6 flex-1 flex flex-col" aria-label="Sidebar">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={currentPage === item.id ? 'page' : undefined}
              className={`group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150
                          ${
                            currentPage === item.id
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-5 w-5
                            ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`}
                aria-hidden="true"
              />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

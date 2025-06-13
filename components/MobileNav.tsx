import React from 'react';
import { Page, NavigationItem } from '../types';

interface MobileNavProps {
  navItems: NavigationItem[];
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems, currentPage, onNavigate }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-slate-200">
      <div className="flex justify-around py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-current={currentPage === item.id ? 'page' : undefined}
            className={`flex flex-col items-center focus:outline-none transition-colors duration-200 
                        ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;

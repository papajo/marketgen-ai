
import React, { useState, useEffect, useCallback } from 'react';
import { Page } from './types';
import { NAVIGATION_ITEMS } from './constants';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Header from './components/Header';
import ContentGenerationPage from './components/ContentGenerationPage';
import ABTestingPage from './components/ABTestingPage';
import ProjectsPage from './components/ProjectsPage';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.ContentGeneration);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowApp(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0,0);
  }, []);

  const getCurrentPageName = (): string => {
    const item = NAVIGATION_ITEMS.find(navItem => navItem.id === currentPage);
    return item ? item.label : 'Dashboard';
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.ContentGeneration:
        return <ContentGenerationPage />;
      case Page.ABTesting:
        return <ABTestingPage />;
      case Page.Projects:
        return <ProjectsPage />;
      case Page.Profile:
        return <ProfilePage />;
      default:
        return <ContentGenerationPage />;
    }
  };

  return (
    <div className={`flex min-h-screen bg-slate-100 transition-opacity duration-500 ease-in-out ${showApp ? 'opacity-100' : 'opacity-0'}`}>
      <Sidebar
        navItems={NAVIGATION_ITEMS}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      <div className="flex-1 flex flex-col lg:ml-64 pb-16 lg:pb-0"> {/* Ensure ml-64 matches sidebar width */}
        <Header
          currentPageName={getCurrentPageName()}
          onNewProject={() => alert('New Project functionality to be implemented.')}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      <MobileNav
        navItems={NAVIGATION_ITEMS}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
    </div>
  );
};

export default App;
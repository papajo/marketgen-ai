import React from 'react';
import { IconFolder } from '../constants';

const ProjectsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <IconFolder className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Projects</h1>
        <p className="text-slate-600 mb-6">
          Manage all your creative projects in one place. This section is under development.
        </p>
        <div className="mt-8 space-y-4">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h2 className="font-semibold text-slate-700">My Awesome Campaign</h2>
                <p className="text-sm text-slate-500">Last updated: 3 days ago - 5 generated assets</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <h2 className="font-semibold text-slate-700">Q4 Product Launch Content</h2>
                <p className="text-sm text-slate-500">Last updated: 1 week ago - 12 generated assets</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

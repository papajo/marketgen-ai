import React from 'react';
import { IconPlus, IconArrowUp } from '../constants'; // Assuming you have IconArrowUp

const demoTests = [
  { id: '1', name: 'Summer Sale - Email Subject', type: 'Email', status: 'Completed', performance: '+28%', winner: 'Version B' },
  { id: '2', name: 'New Product - Facebook Ad Image', type: 'Image', status: 'Active', performance: 'Testing', winner: '-' },
  { id: '3', name: 'Welcome Email - CTA Button', type: 'Email', status: 'Completed', performance: '+12%', winner: 'Version A' },
];

const ABTestingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">A/B Testing Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-slate-600">Active Tests</h3>
            <span className="text-2xl font-bold text-indigo-600">7</span>
          </div>
          <p className="text-sm text-slate-500">Tests running now</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-slate-600">Tests Completed</h3>
            <span className="text-2xl font-bold text-indigo-600">32</span>
          </div>
          <p className="text-sm text-slate-500">Last 30 days</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-slate-600">Impact Increase</h3>
            <span className="text-2xl font-bold text-green-600">+43%</span>
          </div>
          <p className="text-sm text-slate-500">Average conversion lift</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3 sm:mb-0">Recent Tests</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <IconPlus className="w-4 h-4" />
            <span>New Test</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Test Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Winner</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {demoTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{test.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{test.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${test.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center">
                      {test.performance.startsWith('+') && <span className="text-green-600 mr-1">{test.performance}</span>}
                      {test.performance.startsWith('+') && <IconArrowUp className="w-4 h-4 text-green-500" />}
                      {!test.performance.startsWith('+') && test.performance !== 'Testing' && <span>{test.performance}</span>}
                       {test.performance === 'Testing' && <span className="text-slate-600">{test.performance}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{test.winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Summary</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg p-4">
            <p className="text-slate-500 text-sm">Conversion rate comparison chart (Placeholder)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Test</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label htmlFor="testName" className="block text-sm font-medium text-slate-700 mb-1">Test Name</label>
              <input type="text" id="testName" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="contentType" className="block text-sm font-medium text-slate-700 mb-1">Content Type</label>
              <select id="contentType" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-sm">
                <option>Email</option>
                <option>Social Ad</option>
                <option>Landing Page</option>
              </select>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="versionA" className="block text-sm font-medium text-slate-700 mb-1">Version A</label>
                <select id="versionA" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-sm">
                  <option>Select content...</option>
                </select>
              </div>
              <div>
                <label htmlFor="versionB" className="block text-sm font-medium text-slate-700 mb-1">Version B</label>
                <select id="versionB" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-sm">
                  <option>Select content...</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm">
              Start A/B Test
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ABTestingPage;

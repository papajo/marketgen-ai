import React from 'react';
import { IconUser, IconBolt } from '../constants';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center md:flex-row md:items-start">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-indigo-200">
                    <IconUser className="w-20 h-20 text-indigo-500" />
                </div>
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Alex Johnson</h1>
                <p className="text-slate-600 mb-4">alex.johnson@example.com</p>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Pro Plan User
                </span>
            </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-6">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-500">Full Name</label>
                    <p className="text-slate-800 mt-1">Alex Johnson</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-500">Email Address</label>
                    <p className="text-slate-800 mt-1">alex.johnson@example.com</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-500">Current Plan</label>
                    <p className="text-slate-800 mt-1">Pro Plan</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-500">Member Since</label>
                    <p className="text-slate-800 mt-1">January 15, 2023</p>
                </div>
            </div>
        </div>
        
        <div className="mt-10 border-t border-slate-200 pt-8">
             <h2 className="text-xl font-semibold text-slate-700 mb-4">Content Credits</h2>
             <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Credits used: 57 / 100</p>
                <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '57%' }}></div>
                </div>
                <button className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                    <IconBolt className="w-4 h-4 mr-1" />
                    Upgrade Plan
                </button>
            </div>
        </div>

        <div className="mt-10 text-center md:text-right">
            <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium mr-3">
                Edit Profile
            </button>
            <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium">
                Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React from 'react';
import { Calendar, Users, LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Calendar className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">EasyPlan</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-500 transition-colors">
                <Users className="inline-block h-5 w-5 mr-1" />
                Événements
              </button>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center">
                <LogIn className="h-5 w-5 mr-1" />
                Connexion
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
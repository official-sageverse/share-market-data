import React from 'react';
import { TrendingUp, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <TrendingUp className="h-8 w-8 text-blue-600 md:ml-0 ml-2" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Trading Journal</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
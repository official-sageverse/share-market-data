import React from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  Wallet, 
  Target, 
  FileText, 
  BookOpen,
  Settings as SettingsIcon,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
  { id: 'trades', name: 'Add Trade', icon: PlusCircle, color: 'text-green-600' },
  { id: 'assets', name: 'Assets', icon: TrendingUp, color: 'text-purple-600' },
  { id: 'portfolio', name: 'Portfolio', icon: Wallet, color: 'text-indigo-600' },
  { id: 'goals', name: 'Goals', icon: Target, color: 'text-orange-600' },
  { id: 'reports', name: 'Reports', icon: FileText, color: 'text-red-600' },
  { id: 'journal', name: 'Journal', icon: BookOpen, color: 'text-teal-600' },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'text-gray-600' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200 shadow-sm">
        <nav className="flex-1 px-4 pb-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-4 py-3 text-sm font-medium border-l-4 transition-all duration-200 w-full text-left rounded-r-lg`}
              >
                <Icon
                  className={`${
                    isActive 
                      ? item.color 
                      : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-5 w-5 transition-colors duration-200`}
                />
                <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
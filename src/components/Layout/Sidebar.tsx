import React from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  Wallet, 
  Target, 
  FileText, 
  BookOpen,
  Settings as SettingsIcon
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
  { id: 'trades', name: 'Add Trade', icon: PlusCircle },
  { id: 'portfolio', name: 'Portfolio', icon: Wallet },
  { id: 'goals', name: 'Goals', icon: Target },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'journal', name: 'Journal', icon: BookOpen },
  { id: 'settings', name: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <nav className="flex-1 px-4 pb-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`${
                  activeSection === item.id
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors w-full text-left`}
              >
                <Icon
                  className={`${
                    activeSection === item.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-5 w-5 transition-colors`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
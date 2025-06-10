import React from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  Wallet, 
  Target, 
  Settings as SettingsIcon,
  TrendingUp
} from 'lucide-react';

interface MobileNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
  { id: 'trades', name: 'Trade', icon: PlusCircle, color: 'text-green-600' },
  { id: 'portfolio', name: 'Portfolio', icon: Wallet, color: 'text-indigo-600' },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'text-gray-600' },
];

export function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="grid grid-cols-4 gap-1 px-2 py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              } flex flex-col items-center py-2 px-1 text-xs font-medium transition-all duration-200 rounded-lg`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? item.color : ''}`} />
              <span className={`truncate ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
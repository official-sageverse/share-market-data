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

interface MobileNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
  { id: 'trades', name: 'Trades', icon: PlusCircle },
  { id: 'portfolio', name: 'Portfolio', icon: Wallet },
  { id: 'goals', name: 'Goals', icon: Target },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'journal', name: 'Journal', icon: BookOpen },
  { id: 'settings', name: 'Settings', icon: SettingsIcon },
];

export function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-7 gap-1 px-1 py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`${
                activeSection === item.id
                  ? 'text-blue-600'
                  : 'text-gray-400'
              } flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
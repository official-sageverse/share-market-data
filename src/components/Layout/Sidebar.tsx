import React from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  Wallet, 
  Target, 
  Settings as SettingsIcon,
  TrendingUp,
  X
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
  { id: 'trades', name: 'Add Trade', icon: PlusCircle, color: 'text-green-600' },
  { id: 'assets', name: 'Assets', icon: TrendingUp, color: 'text-purple-600' },
  { id: 'portfolio', name: 'Portfolio', icon: Wallet, color: 'text-indigo-600' },
  { id: 'goals', name: 'Goals', icon: Target, color: 'text-orange-600' },
  { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'text-gray-600' },
];

export function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-gray-200">
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-4 md:hidden">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-2 mt-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
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
    </>
  );
}
import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileNav } from './components/Layout/MobileNav';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TradeForm } from './components/TradeEntry/TradeForm';
import { Portfolio } from './components/Portfolio/Portfolio';
import { GoalManager } from './components/Goals/GoalManager';
import { AssetManager } from './components/Assets/AssetManager';
import { Settings } from './components/Settings/Settings';
import { useTradingData } from './hooks/useTradingData';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { exportData, importData } = useTradingData();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-journal-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (data: string) => {
    const success = importData(data);
    if (success) {
      alert('Data imported successfully!');
    } else {
      alert('Error importing data. Please check the file format.');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'trades':
        return <TradeForm />;
      case 'assets':
        return <AssetManager />;
      case 'portfolio':
        return <Portfolio />;
      case 'goals':
        return <GoalManager />;
      case 'settings':
        return <Settings />;
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
            <p className="text-gray-500">Coming soon - Detailed performance reports and analytics</p>
          </div>
        );
      case 'journal':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trading Journal</h2>
            <p className="text-gray-500">Coming soon - Write and organize your trading notes</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onExport={handleExport} onImport={handleImport} />
      
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <MobileNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
}

export default App;
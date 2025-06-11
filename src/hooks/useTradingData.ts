import { useLocalStorage } from './useLocalStorage';
import { Trade, PortfolioSettings, Goal, JournalEntry, UserSettings, Asset } from '../types';
import { calculatePnL } from '../utils/calculations';

const defaultPortfolioSettings: PortfolioSettings = {
  initialCapital: 10000,
  currentBalance: 10000,
  maxDailyLoss: 500,
  maxDailyLossPercentage: 5,
  maxPositionSize: 1000,
  maxPositionSizePercentage: 10,
  riskRewardRatio: 2,
  currency: 'USD',
  timezone: 'America/New_York',
  deposits: [],
  withdrawals: [],
};

const defaultUserSettings: UserSettings = {
  theme: 'light',
  currency: 'USD',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  notifications: {
    dailyLossLimit: true,
    goalProgress: true,
    tradeReminders: false,
  },
  riskManagement: {
    maxDailyLoss: 500,
    maxDailyLossPercentage: 5,
    maxPositionSize: 1000,
    maxPositionSizePercentage: 10,
    riskRewardRatio: 2,
    stopLossRequired: false,
    takeProfitRequired: false,
  },
  tradingHours: {
    start: '09:30',
    end: '16:00',
    timezone: 'America/New_York',
  },
};

export function useTradingData() {
  const [trades, setTrades] = useLocalStorage<Trade[]>('trading-journal-trades', []);
  const [portfolio, setPortfolio] = useLocalStorage<PortfolioSettings>('trading-journal-portfolio', defaultPortfolioSettings);
  const [goals, setGoals] = useLocalStorage<Goal[]>('trading-journal-goals', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('trading-journal-entries', []);
  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>('trading-journal-settings', defaultUserSettings);
  const [assets, setAssets] = useLocalStorage<Asset[]>('trading-journal-assets', []);

  const addTrade = (trade: Omit<Trade, 'id' | 'createdAt'>) => {
    const newTrade: Trade = {
      ...trade,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    // Force re-render by creating new array reference
    setTrades(prev => {
      const newTrades = [newTrade, ...prev];
      // Trigger immediate state update
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('tradesUpdated', { detail: newTrades }));
      }, 0);
      return newTrades;
    });
    
    // Update portfolio balance if trade is closed
    if (!trade.isOpen && trade.pnl !== undefined) {
      setPortfolio(prev => {
        const newPortfolio = {
          ...prev,
          currentBalance: prev.currentBalance + trade.pnl - (trade.fees || 0),
        };
        // Trigger portfolio update event
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('portfolioUpdated', { detail: newPortfolio }));
        }, 0);
        return newPortfolio;
      });
    }
  };

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(prev => {
      const newTrades = prev.map(trade => {
        if (trade.id === id) {
          const updatedTrade = { ...trade, ...updates };
          
          // If trade is being closed, update portfolio balance
          if (trade.isOpen && !updatedTrade.isOpen && updatedTrade.pnl !== undefined) {
            setPortfolio(prevPortfolio => {
              const newPortfolio = {
                ...prevPortfolio,
                currentBalance: prevPortfolio.currentBalance + updatedTrade.pnl - (updatedTrade.fees || 0),
              };
              // Trigger portfolio update event
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('portfolioUpdated', { detail: newPortfolio }));
              }, 0);
              return newPortfolio;
            });
          }
          
          return updatedTrade;
        }
        return trade;
      });
      
      // Trigger trades update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('tradesUpdated', { detail: newTrades }));
      }, 0);
      
      return newTrades;
    });
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => {
      const newTrades = prev.filter(trade => trade.id !== id);
      // Trigger trades update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('tradesUpdated', { detail: newTrades }));
      }, 0);
      return newTrades;
    });
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => {
      const newGoals = [newGoal, ...prev];
      // Trigger goals update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('goalsUpdated', { detail: newGoals }));
      }, 0);
      return newGoals;
    });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => {
      const newGoals = prev.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      );
      // Trigger goals update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('goalsUpdated', { detail: newGoals }));
      }, 0);
      return newGoals;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => {
      const newGoals = prev.filter(goal => goal.id !== id);
      // Trigger goals update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('goalsUpdated', { detail: newGoals }));
      }, 0);
      return newGoals;
    });
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const addAsset = (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setAssets(prev => {
      const newAssets = [newAsset, ...prev];
      // Trigger assets update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('assetsUpdated', { detail: newAssets }));
      }, 0);
      return newAssets;
    });
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => {
      const newAssets = prev.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      );
      // Trigger assets update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('assetsUpdated', { detail: newAssets }));
      }, 0);
      return newAssets;
    });
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => {
      const newAssets = prev.filter(asset => asset.id !== id);
      // Trigger assets update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('assetsUpdated', { detail: newAssets }));
      }, 0);
      return newAssets;
    });
  };

  const exportData = () => {
    const data = {
      trades,
      portfolio,
      goals,
      journalEntries,
      userSettings,
      assets,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.trades) {
        setTrades(data.trades);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('tradesUpdated', { detail: data.trades }));
        }, 0);
      }
      if (data.portfolio) {
        setPortfolio(data.portfolio);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('portfolioUpdated', { detail: data.portfolio }));
        }, 0);
      }
      if (data.goals) {
        setGoals(data.goals);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('goalsUpdated', { detail: data.goals }));
        }, 0);
      }
      if (data.journalEntries) setJournalEntries(data.journalEntries);
      if (data.userSettings) setUserSettings(data.userSettings);
      if (data.assets) {
        setAssets(data.assets);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('assetsUpdated', { detail: data.assets }));
        }, 0);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  return {
    trades,
    portfolio,
    goals,
    journalEntries,
    userSettings,
    assets,
    setPortfolio,
    setUserSettings,
    addTrade,
    updateTrade,
    deleteTrade,
    addGoal,
    updateGoal,
    deleteGoal,
    addJournalEntry,
    addAsset,
    updateAsset,
    deleteAsset,
    exportData,
    importData,
  };
}
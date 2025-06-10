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
    setTrades(prev => [newTrade, ...prev]);
    
    // Update portfolio balance if trade is closed
    if (!trade.isOpen && trade.pnl !== undefined) {
      setPortfolio(prev => ({
        ...prev,
        currentBalance: prev.currentBalance + trade.pnl - (trade.fees || 0),
      }));
    }
  };

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(prev => prev.map(trade => {
      if (trade.id === id) {
        const updatedTrade = { ...trade, ...updates };
        
        // If trade is being closed, update portfolio balance
        if (trade.isOpen && !updatedTrade.isOpen && updatedTrade.pnl !== undefined) {
          setPortfolio(prevPortfolio => ({
            ...prevPortfolio,
            currentBalance: prevPortfolio.currentBalance + updatedTrade.pnl - (updatedTrade.fees || 0),
          }));
        }
        
        return updatedTrade;
      }
      return trade;
    }));
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
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
    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
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
      if (data.trades) setTrades(data.trades);
      if (data.portfolio) setPortfolio(data.portfolio);
      if (data.goals) setGoals(data.goals);
      if (data.journalEntries) setJournalEntries(data.journalEntries);
      if (data.userSettings) setUserSettings(data.userSettings);
      if (data.assets) setAssets(data.assets);
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
    addJournalEntry,
    addAsset,
    updateAsset,
    deleteAsset,
    exportData,
    importData,
  };
}
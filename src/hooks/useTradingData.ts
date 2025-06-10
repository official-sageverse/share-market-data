import { useLocalStorage } from './useLocalStorage';
import { Trade, PortfolioSettings, Goal, JournalEntry, UserSettings } from '../types';

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
    setTrades(prev => prev.map(trade => 
      trade.id === id ? { ...trade, ...updates } : trade
    ));
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

  const exportData = () => {
    const data = {
      trades,
      portfolio,
      goals,
      journalEntries,
      userSettings,
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
    setPortfolio,
    setUserSettings,
    addTrade,
    updateTrade,
    deleteTrade,
    addGoal,
    updateGoal,
    addJournalEntry,
    exportData,
    importData,
  };
}
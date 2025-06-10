import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  Target, 
  Shield, 
  Bell, 
  Clock,
  Save,
  RefreshCw
} from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { formatCurrency } from '../../utils/calculations';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
];

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
];

export function Settings() {
  const { portfolio, setPortfolio, userSettings, setUserSettings } = useTradingData();
  const [activeTab, setActiveTab] = useState('capital');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [capitalSettings, setCapitalSettings] = useState({
    initialCapital: portfolio.initialCapital.toString(),
    currentBalance: portfolio.currentBalance.toString(),
    currency: portfolio.currency || 'USD',
  });

  const [riskSettings, setRiskSettings] = useState({
    maxDailyLoss: portfolio.maxDailyLoss.toString(),
    maxDailyLossPercentage: portfolio.maxDailyLossPercentage.toString(),
    maxPositionSize: portfolio.maxPositionSize?.toString() || '1000',
    maxPositionSizePercentage: portfolio.maxPositionSizePercentage?.toString() || '10',
    riskRewardRatio: portfolio.riskRewardRatio?.toString() || '2',
    stopLossRequired: userSettings?.riskManagement?.stopLossRequired || false,
    takeProfitRequired: userSettings?.riskManagement?.takeProfitRequired || false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    dailyLossLimit: userSettings?.notifications?.dailyLossLimit || true,
    goalProgress: userSettings?.notifications?.goalProgress || true,
    tradeReminders: userSettings?.notifications?.tradeReminders || false,
  });

  const [tradingHours, setTradingHours] = useState({
    start: userSettings?.tradingHours?.start || '09:30',
    end: userSettings?.tradingHours?.end || '16:00',
    timezone: userSettings?.tradingHours?.timezone || 'America/New_York',
  });

  const handleSaveCapitalSettings = () => {
    setPortfolio(prev => ({
      ...prev,
      initialCapital: parseFloat(capitalSettings.initialCapital) || prev.initialCapital,
      currentBalance: parseFloat(capitalSettings.currentBalance) || prev.currentBalance,
      currency: capitalSettings.currency,
    }));
    alert('Capital settings saved successfully!');
  };

  const handleSaveRiskSettings = () => {
    setPortfolio(prev => ({
      ...prev,
      maxDailyLoss: parseFloat(riskSettings.maxDailyLoss) || 0,
      maxDailyLossPercentage: parseFloat(riskSettings.maxDailyLossPercentage) || 0,
      maxPositionSize: parseFloat(riskSettings.maxPositionSize) || 1000,
      maxPositionSizePercentage: parseFloat(riskSettings.maxPositionSizePercentage) || 10,
      riskRewardRatio: parseFloat(riskSettings.riskRewardRatio) || 2,
    }));

    setUserSettings(prev => ({
      ...prev,
      riskManagement: {
        ...prev?.riskManagement,
        maxDailyLoss: parseFloat(riskSettings.maxDailyLoss) || 0,
        maxDailyLossPercentage: parseFloat(riskSettings.maxDailyLossPercentage) || 0,
        maxPositionSize: parseFloat(riskSettings.maxPositionSize) || 1000,
        maxPositionSizePercentage: parseFloat(riskSettings.maxPositionSizePercentage) || 10,
        riskRewardRatio: parseFloat(riskSettings.riskRewardRatio) || 2,
        stopLossRequired: riskSettings.stopLossRequired,
        takeProfitRequired: riskSettings.takeProfitRequired,
      },
    }));
    alert('Risk management settings saved successfully!');
  };

  const handleSaveNotificationSettings = () => {
    setUserSettings(prev => ({
      ...prev,
      notifications: notificationSettings,
    }));
    alert('Notification settings saved successfully!');
  };

  const handleSaveTradingHours = () => {
    setUserSettings(prev => ({
      ...prev,
      tradingHours: tradingHours,
    }));
    alert('Trading hours saved successfully!');
  };

  const handleResetAllData = () => {
    if (showResetConfirm) {
      // Reset all data
      localStorage.clear();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };

  const tabs = [
    { id: 'capital', name: 'Capital & Currency', icon: DollarSign },
    { id: 'risk', name: 'Risk Management', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'trading', name: 'Trading Hours', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your trading journal preferences and risk management
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Capital & Currency Settings */}
      {activeTab === 'capital' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Capital & Currency Settings</h3>
            <p className="text-sm text-gray-500">Manage your trading capital and currency preferences</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Capital</label>
                <input
                  type="number"
                  step="0.01"
                  value={capitalSettings.initialCapital}
                  onChange={(e) => setCapitalSettings(prev => ({ ...prev, initialCapital: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="10000.00"
                />
                <p className="mt-1 text-xs text-gray-500">Your starting trading capital</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Current Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={capitalSettings.currentBalance}
                  onChange={(e) => setCapitalSettings(prev => ({ ...prev, currentBalance: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="10000.00"
                />
                <p className="mt-1 text-xs text-gray-500">Your current account balance</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={capitalSettings.currency}
                  onChange={(e) => setCapitalSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Your trading account currency</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveCapitalSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Capital Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risk Management Settings */}
      {activeTab === 'risk' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Risk Management Settings</h3>
            <p className="text-sm text-gray-500">Configure your risk limits and trading rules</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Daily Loss ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={riskSettings.maxDailyLoss}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDailyLoss: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="500.00"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum loss allowed per day in dollars</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Daily Loss (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskSettings.maxDailyLossPercentage}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDailyLossPercentage: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="5.0"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum loss as percentage of capital</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Position Size ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={riskSettings.maxPositionSize}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxPositionSize: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="1000.00"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum position size in dollars</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Position Size (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskSettings.maxPositionSizePercentage}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, maxPositionSizePercentage: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="10.0"
                />
                <p className="mt-1 text-xs text-gray-500">Maximum position as percentage of capital</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Risk/Reward Ratio</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskSettings.riskRewardRatio}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, riskRewardRatio: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="2.0"
                />
                <p className="mt-1 text-xs text-gray-500">Minimum risk/reward ratio for trades</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="stop-loss-required"
                  type="checkbox"
                  checked={riskSettings.stopLossRequired}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, stopLossRequired: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="stop-loss-required" className="ml-2 block text-sm text-gray-900">
                  Require stop loss for all trades
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="take-profit-required"
                  type="checkbox"
                  checked={riskSettings.takeProfitRequired}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, takeProfitRequired: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="take-profit-required" className="ml-2 block text-sm text-gray-900">
                  Require take profit target for all trades
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveRiskSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Risk Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
            <p className="text-sm text-gray-500">Configure alerts and reminders</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Daily Loss Limit Alerts</h4>
                  <p className="text-sm text-gray-500">Get notified when approaching daily loss limits</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.dailyLossLimit}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, dailyLossLimit: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Goal Progress Updates</h4>
                  <p className="text-sm text-gray-500">Receive updates on goal achievement progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.goalProgress}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, goalProgress: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Trade Reminders</h4>
                  <p className="text-sm text-gray-500">Reminders to log trades and journal entries</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.tradeReminders}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, tradeReminders: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotificationSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trading Hours Settings */}
      {activeTab === 'trading' && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Trading Hours</h3>
            <p className="text-sm text-gray-500">Set your preferred trading schedule</p>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Market Open</label>
                <input
                  type="time"
                  value={tradingHours.start}
                  onChange={(e) => setTradingHours(prev => ({ ...prev, start: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Market Close</label>
                <input
                  type="time"
                  value={tradingHours.end}
                  onChange={(e) => setTradingHours(prev => ({ ...prev, end: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  value={tradingHours.timezone}
                  onChange={(e) => setTradingHours(prev => ({ ...prev, timezone: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveTradingHours}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Trading Hours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Data Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Reset all data including trades, portfolio, and settings. This action cannot be undone.
          </p>
          <button
            onClick={handleResetAllData}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors ${
              showResetConfirm
                ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {showResetConfirm ? 'Click Again to Confirm Reset' : 'Reset All Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
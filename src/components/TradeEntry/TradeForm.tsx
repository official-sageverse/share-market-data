import React, { useState } from 'react';
import { PlusCircle, Save, X } from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { Trade } from '../../types';
import { calculatePnL } from '../../utils/calculations';

const strategies = [
  'Scalping',
  'Day Trading',
  'Swing Trading',
  'Breakout',
  'Support/Resistance',
  'Moving Average',
  'RSI Divergence',
  'News Trading',
  'Other'
];

const emotionalStates = [
  { value: 'confident', label: 'Confident' },
  { value: 'nervous', label: 'Nervous' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'excited', label: 'Excited' },
  { value: 'frustrated', label: 'Frustrated' },
];

export function TradeForm() {
  const { addTrade } = useTradingData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    asset: '',
    direction: 'long' as 'long' | 'short',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    strategy: '',
    reasoning: '',
    marketConditions: '',
    tags: '',
    isOpen: true,
    fees: '',
    emotionalState: 'neutral' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.asset) newErrors.asset = 'Asset is required';
    if (!formData.entryPrice) newErrors.entryPrice = 'Entry price is required';
    if (!formData.positionSize) newErrors.positionSize = 'Position size is required';
    if (!formData.strategy) newErrors.strategy = 'Strategy is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const trade: Omit<Trade, 'id' | 'createdAt'> = {
      date: formData.date,
      time: formData.time,
      asset: formData.asset.toUpperCase(),
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      positionSize: parseFloat(formData.positionSize),
      strategy: formData.strategy,
      reasoning: formData.reasoning,
      marketConditions: formData.marketConditions,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isOpen: formData.isOpen,
      fees: formData.fees ? parseFloat(formData.fees) : 0,
      emotionalState: formData.emotionalState,
    };

    if (!trade.isOpen && trade.exitPrice) {
      trade.pnl = calculatePnL({...trade, id: '', createdAt: ''} as Trade);
    }

    addTrade(trade);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      asset: '',
      direction: 'long',
      entryPrice: '',
      exitPrice: '',
      positionSize: '',
      strategy: '',
      reasoning: '',
      marketConditions: '',
      tags: '',
      isOpen: true,
      fees: '',
      emotionalState: 'neutral',
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Trade</h2>
        <p className="mt-1 text-sm text-gray-500">
          Record your trade details for analysis and tracking
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Trade Info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Asset *</label>
              <input
                type="text"
                placeholder="e.g., AAPL, TSLA, SPY"
                value={formData.asset}
                onChange={(e) => handleInputChange('asset', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.asset ? 'border-red-300' : ''
                }`}
              />
              {errors.asset && <p className="mt-1 text-sm text-red-600">{errors.asset}</p>}
            </div>
          </div>

          {/* Trade Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Direction</label>
              <select
                value={formData.direction}
                onChange={(e) => handleInputChange('direction', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Entry Price *</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.entryPrice}
                onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.entryPrice ? 'border-red-300' : ''
                }`}
              />
              {errors.entryPrice && <p className="mt-1 text-sm text-red-600">{errors.entryPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Exit Price</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.exitPrice}
                onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                disabled={formData.isOpen}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position Size *</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.positionSize}
                onChange={(e) => handleInputChange('positionSize', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.positionSize ? 'border-red-300' : ''
                }`}
              />
              {errors.positionSize && <p className="mt-1 text-sm text-red-600">{errors.positionSize}</p>}
            </div>
          </div>

          {/* Strategy and Status */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Strategy *</label>
              <select
                value={formData.strategy}
                onChange={(e) => handleInputChange('strategy', e.target.value)}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.strategy ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select strategy</option>
                {strategies.map(strategy => (
                  <option key={strategy} value={strategy}>{strategy}</option>
                ))}
              </select>
              {errors.strategy && <p className="mt-1 text-sm text-red-600">{errors.strategy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Emotional State</label>
              <select
                value={formData.emotionalState}
                onChange={(e) => handleInputChange('emotionalState', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {emotionalStates.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fees</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.fees}
                onChange={(e) => handleInputChange('fees', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Trade Status */}
          <div>
            <div className="flex items-center">
              <input
                id="is-open"
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => handleInputChange('isOpen', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is-open" className="ml-2 block text-sm text-gray-900">
                Trade is still open
              </label>
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Trade Reasoning</label>
              <textarea
                rows={4}
                placeholder="Why did you enter this trade? What was your analysis?"
                value={formData.reasoning}
                onChange={(e) => handleInputChange('reasoning', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Market Conditions</label>
              <textarea
                rows={4}
                placeholder="Describe the market environment, news events, etc."
                value={formData.marketConditions}
                onChange={(e) => handleInputChange('marketConditions', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <input
              type="text"
              placeholder="earnings, breakout, support (comma separated)"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
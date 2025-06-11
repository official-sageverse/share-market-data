import React, { useState } from 'react';
import { PlusCircle, Save, Search, Star } from 'lucide-react';
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
  'Trend Following',
  'News Trading',
  'Other'
];

export function TradeForm() {
  const { addTrade, assets } = useTradingData();
  const [showAssetSearch, setShowAssetSearch] = useState(false);
  const [assetSearchTerm, setAssetSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    asset: '',
    direction: 'long' as 'long' | 'short',
    entryPrice: '',
    exitPrice: '',
    positionSize: '',
    strategy: '',
    notes: '',
    isOpen: false, // Changed default to false (unchecked)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.asset) newErrors.asset = 'Asset is required';
    if (!formData.entryPrice) newErrors.entryPrice = 'Entry price is required';
    if (!formData.positionSize) newErrors.positionSize = 'Position size is required';
    // Removed strategy validation - it's now optional
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const trade: Omit<Trade, 'id' | 'createdAt'> = {
      date: formData.date,
      time: new Date().toTimeString().slice(0, 5),
      asset: formData.asset.toUpperCase(),
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      positionSize: parseFloat(formData.positionSize),
      strategy: formData.strategy || 'Not specified', // Default value if empty
      reasoning: formData.notes,
      marketConditions: '',
      tags: [],
      isOpen: formData.isOpen,
      fees: 0,
      emotionalState: 'neutral',
    };

    if (!trade.isOpen && trade.exitPrice) {
      trade.pnl = calculatePnL({...trade, id: '', createdAt: ''} as Trade);
    }

    addTrade(trade);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      asset: '',
      direction: 'long',
      entryPrice: '',
      exitPrice: '',
      positionSize: '',
      strategy: '',
      notes: '',
      isOpen: false, // Reset to default unchecked state
    });
    setErrors({});
    
    // Show success message
    alert('Trade added successfully!');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectAsset = (symbol: string) => {
    handleInputChange('asset', symbol);
    setShowAssetSearch(false);
    setAssetSearchTerm('');
  };

  const filteredAssets = assets.filter(asset => 
    asset.symbol.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase())
  );

  const favoriteAssets = assets.filter(asset => asset.isActive);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <PlusCircle className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Add New Trade</h2>
        <p className="mt-2 text-lg text-gray-600">
          Record your trade details quickly and easily
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">Trade Details</h3>
            <p className="text-sm text-gray-600 mt-1">Fill in the essential information about your trade</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Trade Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Asset */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Asset Symbol *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., AAPL, TSLA, SPY"
                  value={formData.asset}
                  onChange={(e) => handleInputChange('asset', e.target.value)}
                  onFocus={() => setShowAssetSearch(true)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.asset ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowAssetSearch(!showAssetSearch)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
              {errors.asset && <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                {errors.asset}
              </p>}
              
              {/* Asset Search Dropdown */}
              {showAssetSearch && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-2xl max-h-64 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={assetSearchTerm}
                      onChange={(e) => setAssetSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {/* Favorite Assets */}
                    {favoriteAssets.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          Favorites
                        </div>
                        {favoriteAssets.slice(0, 5).map(asset => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => selectAsset(asset.symbol)}
                            className="w-full text-left px-3 py-3 hover:bg-blue-50 flex items-center justify-between transition-colors"
                          >
                            <div>
                              <span className="font-medium text-gray-900">{asset.symbol}</span>
                              <span className="text-gray-500 text-sm ml-2">{asset.name}</span>
                            </div>
                            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full">{asset.category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* All Assets */}
                    {filteredAssets.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                          All Assets
                        </div>
                        {filteredAssets.slice(0, 10).map(asset => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => selectAsset(asset.symbol)}
                            className="w-full text-left px-3 py-3 hover:bg-blue-50 flex items-center justify-between transition-colors"
                          >
                            <div>
                              <span className="font-medium text-gray-900">{asset.symbol}</span>
                              <span className="text-gray-500 text-sm ml-2">{asset.name}</span>
                            </div>
                            <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full">{asset.category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {filteredAssets.length === 0 && assetSearchTerm && (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        No assets found. You can still type the symbol manually.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direction and Strategy */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Direction</label>
                <select
                  value={formData.direction}
                  onChange={(e) => handleInputChange('direction', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="long">Long (Buy)</option>
                  <option value="short">Short (Sell)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Strategy</label>
                <select
                  value={formData.strategy}
                  onChange={(e) => handleInputChange('strategy', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select strategy (optional)</option>
                  {strategies.map(strategy => (
                    <option key={strategy} value={strategy}>{strategy}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Price *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.entryPrice}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.entryPrice ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.entryPrice && <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.entryPrice}
                </p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exit Price</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.exitPrice}
                  onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                  disabled={formData.isOpen}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Position Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Position Size *</label>
              <input
                type="number"
                step="0.01"
                placeholder="Number of shares/units"
                value={formData.positionSize}
                onChange={(e) => handleInputChange('positionSize', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  errors.positionSize ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
              />
              {errors.positionSize && <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                {errors.positionSize}
              </p>}
            </div>

            {/* Trade Status */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center">
                <input
                  id="is-open"
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => handleInputChange('isOpen', e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                />
                <label htmlFor="is-open" className="ml-3 block text-sm text-gray-900 font-medium">
                  Trade is still open
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Check this if the position is still open and you haven't exited yet
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                rows={4}
                placeholder="Add any notes about this trade..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                <Save className="h-5 w-5 mr-3" />
                Save Trade
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
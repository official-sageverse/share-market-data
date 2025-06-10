import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  Star,
  StarOff,
  Building2,
  Coins,
  DollarSign,
  BarChart3,
  Zap,
  Activity
} from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { Asset } from '../../types';

const assetCategories = [
  { value: 'stocks', label: 'Stocks', icon: TrendingUp, color: 'bg-blue-500' },
  { value: 'crypto', label: 'Crypto', icon: Coins, color: 'bg-orange-500' },
  { value: 'forex', label: 'Forex', icon: DollarSign, color: 'bg-green-500' },
  { value: 'commodities', label: 'Commodities', icon: BarChart3, color: 'bg-yellow-500' },
  { value: 'indices', label: 'Indices', icon: Activity, color: 'bg-purple-500' },
  { value: 'options', label: 'Options', icon: Zap, color: 'bg-red-500' },
];

const popularAssets = {
  stocks: ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META', 'NFLX'],
  crypto: ['BTC', 'ETH', 'ADA', 'SOL', 'DOGE', 'MATIC', 'AVAX', 'DOT'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  commodities: ['GOLD', 'SILVER', 'OIL', 'NATGAS', 'WHEAT', 'CORN'],
  indices: ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO'],
  options: ['SPY Calls', 'QQQ Puts', 'TSLA Calls', 'AAPL Puts'],
};

export function AssetManager() {
  const { assets, addAsset, updateAsset, deleteAsset } = useTradingData();
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    category: 'stocks' as Asset['category'],
    exchange: '',
    sector: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.name) {
      alert('Please fill in symbol and name');
      return;
    }

    const assetData = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      category: formData.category,
      exchange: formData.exchange,
      sector: formData.sector,
      isActive: true,
    };

    if (editingAsset) {
      updateAsset(editingAsset.id, assetData);
    } else {
      addAsset(assetData);
    }

    // Reset form
    setFormData({
      symbol: '',
      name: '',
      category: 'stocks',
      exchange: '',
      sector: '',
    });
    setShowForm(false);
    setEditingAsset(null);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      category: asset.category,
      exchange: asset.exchange || '',
      sector: asset.sector || '',
    });
    setShowForm(true);
  };

  const toggleFavorite = (asset: Asset) => {
    updateAsset(asset.id, { isActive: !asset.isActive });
  };

  const addPopularAsset = (symbol: string, category: Asset['category']) => {
    const assetData = {
      symbol: symbol,
      name: symbol,
      category: category,
      isActive: true,
    };
    addAsset(assetData);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesFavorites = !showFavorites || asset.isActive;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const getCategoryInfo = (category: string) => {
    return assetCategories.find(cat => cat.value === category) || assetCategories[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asset Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your trading assets for quick selection during trade entry
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {assetCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                showFavorites
                  ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {showFavorites ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Asset Form */}
      {showForm && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-medium text-gray-900">
              {editingAsset ? 'Edit Asset' : 'Add New Asset'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Symbol *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., AAPL, BTC, EUR/USD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Apple Inc., Bitcoin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Asset['category'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {assetCategories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange</label>
                <input
                  type="text"
                  value={formData.exchange}
                  onChange={(e) => setFormData(prev => ({ ...prev, exchange: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., NASDAQ, NYSE, Binance"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Technology, Healthcare, Energy"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAsset(null);
                  setFormData({
                    symbol: '',
                    name: '',
                    category: 'stocks',
                    exchange: '',
                    sector: '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {editingAsset ? 'Update Asset' : 'Add Asset'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Add Popular Assets */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Add Popular Assets</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {assetCategories.map(category => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.value}>
                  <div className="flex items-center mb-2">
                    <div className={`p-1 rounded-md ${category.color} mr-2`}>
                      <CategoryIcon className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{category.label}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularAssets[category.value as keyof typeof popularAssets]?.map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => addPopularAsset(symbol, category.value as Asset['category'])}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={assets.some(asset => asset.symbol === symbol)}
                      >
                        {symbol}
                        {assets.some(asset => asset.symbol === symbol) ? (
                          <span className="ml-1 text-green-500">✓</span>
                        ) : (
                          <Plus className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Assets ({filteredAssets.length})</h3>
        </div>
        <div className="px-6 py-4">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory !== 'all' || showFavorites
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first trading asset'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => {
                const categoryInfo = getCategoryInfo(asset.category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md ${categoryInfo.color} mr-3`}>
                          <CategoryIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{asset.symbol}</h4>
                          <p className="text-xs text-gray-500">{asset.name}</p>
                          {asset.exchange && (
                            <p className="text-xs text-gray-400">{asset.exchange}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleFavorite(asset)}
                          className={`p-1 rounded transition-colors ${
                            asset.isActive
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                        >
                          {asset.isActive ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(asset)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryInfo.color} bg-opacity-10`}>
                        {categoryInfo.label}
                      </span>
                      {asset.sector && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {asset.sector}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
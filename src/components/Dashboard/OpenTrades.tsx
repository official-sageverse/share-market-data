import React, { useState } from 'react';
import { Clock, DollarSign, X, Save } from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { formatCurrency, calculatePnL } from '../../utils/calculations';

export function OpenTrades() {
  const { trades, updateTrade, portfolio } = useTradingData();
  const [closingTrade, setClosingTrade] = useState<string | null>(null);
  const [exitPrice, setExitPrice] = useState('');
  
  const openTrades = trades.filter(t => t.isOpen);

  const handleCloseTrade = (tradeId: string) => {
    setClosingTrade(tradeId);
    setExitPrice('');
  };

  const handleSaveCloseTrade = () => {
    if (!closingTrade || !exitPrice) return;
    
    const trade = trades.find(t => t.id === closingTrade);
    if (!trade) return;

    const updatedTrade = {
      ...trade,
      exitPrice: parseFloat(exitPrice),
      isOpen: false,
    };

    // Calculate P&L
    const pnl = calculatePnL(updatedTrade);
    updatedTrade.pnl = pnl;

    updateTrade(closingTrade, updatedTrade);
    
    // Update portfolio balance
    // This would be handled in the updateTrade function in a real app
    
    setClosingTrade(null);
    setExitPrice('');
    
    alert(`Trade closed successfully! P&L: ${formatCurrency(pnl, portfolio.currency)}`);
  };

  const handleCancelClose = () => {
    setClosingTrade(null);
    setExitPrice('');
  };

  if (openTrades.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Open Trades</h3>
          </div>
        </div>
        <div className="px-6 py-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No open trades</h3>
          <p className="mt-1 text-sm text-gray-500">
            All your trades are closed. Add a new trade to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Open Trades</h3>
          </div>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {openTrades.length} open
          </span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="space-y-4">
          {openTrades.map((trade) => (
            <div key={trade.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    trade.direction === 'long' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{trade.asset}</h4>
                    <p className="text-sm text-gray-500">
                      {trade.direction.toUpperCase()} • {trade.strategy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Entry Price</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(trade.entryPrice, portfolio.currency)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Position Size</div>
                  <div className="font-medium">{trade.positionSize.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="font-medium">{new Date(trade.date).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Close Trade Section */}
              {closingTrade === trade.id ? (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                  <h5 className="font-medium text-gray-900 mb-3">Close Trade</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exit Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        autoFocus
                      />
                    </div>
                    
                    {exitPrice && (
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-600">Estimated P&L:</div>
                        <div className={`text-lg font-semibold ${
                          calculatePnL({...trade, exitPrice: parseFloat(exitPrice), isOpen: false}) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatCurrency(
                            calculatePnL({...trade, exitPrice: parseFloat(exitPrice), isOpen: false}), 
                            portfolio.currency
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveCloseTrade}
                        disabled={!exitPrice}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Close Trade
                      </button>
                      <button
                        onClick={handleCancelClose}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleCloseTrade(trade.id)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Close Trade
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
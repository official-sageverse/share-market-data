import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { formatCurrency } from '../../utils/calculations';

export function PnLChart() {
  const { trades, portfolio } = useTradingData();
  
  // Get closed trades and calculate cumulative P&L
  const closedTrades = trades.filter(t => !t.isOpen && t.pnl !== undefined);
  
  if (closedTrades.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Profit & Loss Chart</h3>
          </div>
        </div>
        <div className="px-6 py-12 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No closed trades yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your P&L chart will appear here once you close some trades
          </p>
        </div>
      </div>
    );
  }

  // Sort trades by date and calculate cumulative P&L
  const sortedTrades = [...closedTrades].sort((a, b) => 
    new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
  );

  let cumulativePnL = 0;
  const chartData = sortedTrades.map((trade, index) => {
    cumulativePnL += trade.pnl || 0;
    return {
      trade: index + 1,
      pnl: trade.pnl || 0,
      cumulative: cumulativePnL,
      date: trade.date,
      asset: trade.asset,
    };
  });

  const maxPnL = Math.max(...chartData.map(d => d.cumulative));
  const minPnL = Math.min(...chartData.map(d => d.cumulative));
  const range = Math.max(Math.abs(maxPnL), Math.abs(minPnL));

  const getBarHeight = (value: number) => {
    if (range === 0) return 0;
    return Math.abs(value / range) * 100;
  };

  const getBarPosition = (value: number) => {
    if (range === 0) return 50;
    return 50 - (value / range) * 50;
  };

  const totalPnL = chartData[chartData.length - 1]?.cumulative || 0;
  const winningTrades = chartData.filter(d => d.pnl > 0).length;
  const losingTrades = chartData.filter(d => d.pnl < 0).length;

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Profit & Loss Chart</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-gray-600">{winningTrades} wins</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span className="text-gray-600">{losingTrades} losses</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnL, portfolio.currency)}
            </div>
            <div className="text-sm text-gray-500">Total P&L</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(Math.max(...chartData.map(d => d.cumulative), 0), portfolio.currency)}
            </div>
            <div className="text-sm text-gray-500">Peak Profit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(Math.min(...chartData.map(d => d.cumulative), 0), portfolio.currency)}
            </div>
            <div className="text-sm text-gray-500">Max Drawdown</div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <div className="flex items-end justify-between h-64 border-b border-gray-200">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-16">
              <span>{formatCurrency(range, portfolio.currency)}</span>
              <span>0</span>
              <span>{formatCurrency(-range, portfolio.currency)}</span>
            </div>
            
            {/* Zero line */}
            <div className="absolute left-16 right-0 top-1/2 border-t border-gray-300 border-dashed"></div>
            
            {/* Bars */}
            <div className="flex items-end justify-between w-full ml-16 h-full">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center group relative flex-1 max-w-8">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                      <div className="font-medium">{data.asset}</div>
                      <div>Trade: {formatCurrency(data.pnl, portfolio.currency)}</div>
                      <div>Total: {formatCurrency(data.cumulative, portfolio.currency)}</div>
                      <div className="text-gray-300">{new Date(data.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="relative w-full max-w-6 mx-1"
                    style={{ height: '100%' }}
                  >
                    <div
                      className={`absolute w-full rounded-t transition-all duration-200 group-hover:opacity-80 ${
                        data.cumulative >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        height: `${getBarHeight(data.cumulative)}%`,
                        bottom: `${getBarPosition(data.cumulative)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis */}
          <div className="flex justify-between mt-2 ml-16 text-xs text-gray-500">
            <span>Trade 1</span>
            <span>Trade {chartData.length}</span>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Trades</h4>
          <div className="space-y-2">
            {chartData.slice(-5).reverse().map((data, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${data.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium text-gray-900">{data.asset}</span>
                  <span className="text-gray-500 text-sm ml-2">{new Date(data.date).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.pnl >= 0 ? '+' : ''}{formatCurrency(data.pnl, portfolio.currency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: {formatCurrency(data.cumulative, portfolio.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
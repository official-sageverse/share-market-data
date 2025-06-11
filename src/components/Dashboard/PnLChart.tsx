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
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Chart</h3>
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

  // Sort trades by date and time, then calculate cumulative P&L
  const sortedTrades = [...closedTrades].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
    const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  let cumulativePnL = 0;
  const chartData = sortedTrades.map((trade, index) => {
    cumulativePnL += trade.pnl || 0;
    return {
      trade: index + 1,
      pnl: trade.pnl || 0,
      cumulative: cumulativePnL,
      date: trade.date,
      asset: trade.asset,
      direction: trade.direction,
    };
  });

  const maxPnL = Math.max(...chartData.map(d => d.cumulative), 0);
  const minPnL = Math.min(...chartData.map(d => d.cumulative), 0);
  const range = Math.max(Math.abs(maxPnL), Math.abs(minPnL), 100);

  const getYPosition = (value: number) => {
    if (range === 0) return 50;
    return 50 - (value / range) * 40; // Center at 50%, ±40% range
  };

  const totalPnL = chartData[chartData.length - 1]?.cumulative || 0;
  const winningTrades = chartData.filter(d => d.pnl > 0).length;
  const losingTrades = chartData.filter(d => d.pnl < 0).length;

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Chart</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">{winningTrades} wins</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">{losingTrades} losses</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalPnL, portfolio.currency)}
            </div>
            <div className="text-sm text-gray-600">Total P&L</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(Math.max(...chartData.map(d => d.cumulative), 0), portfolio.currency)}
            </div>
            <div className="text-sm text-gray-600">Peak Profit</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(Math.min(...chartData.map(d => d.cumulative), 0), portfolio.currency)}
            </div>
            <div className="text-sm text-gray-600">Max Drawdown</div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6">
          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-20 pr-2">
              <span className="text-right font-medium">{formatCurrency(range, portfolio.currency)}</span>
              <span className="text-right font-medium text-gray-700">0</span>
              <span className="text-right font-medium">{formatCurrency(-range, portfolio.currency)}</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute left-20 right-4 top-0 bottom-0">
              {/* Horizontal grid lines */}
              <div className="absolute top-0 left-0 right-0 border-t border-gray-200"></div>
              <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-400 border-dashed"></div>
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200"></div>
              
              {/* Vertical grid lines */}
              {chartData.map((_, index) => {
                if (index % Math.ceil(chartData.length / 8) === 0) {
                  return (
                    <div
                      key={index}
                      className="absolute top-0 bottom-0 border-l border-gray-200"
                      style={{ left: `${(index / (chartData.length - 1)) * 100}%` }}
                    ></div>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Chart area */}
            <div className="absolute left-20 right-4 top-0 bottom-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Area fill */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={totalPnL >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={totalPnL >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                {/* Area under curve */}
                <path
                  d={`M 0 50 ${chartData.map((data, index) => 
                    `L ${(index / (chartData.length - 1)) * 100} ${getYPosition(data.cumulative)}`
                  ).join(' ')} L 100 50 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Main line */}
                <polyline
                  points={chartData.map((data, index) => 
                    `${(index / (chartData.length - 1)) * 100},${getYPosition(data.cumulative)}`
                  ).join(' ')}
                  fill="none"
                  stroke={totalPnL >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="0.5"
                  className="drop-shadow-sm"
                />
                
                {/* Data points */}
                {chartData.map((data, index) => (
                  <g key={index}>
                    <circle
                      cx={(index / (chartData.length - 1)) * 100}
                      cy={getYPosition(data.cumulative)}
                      r="0.8"
                      fill={data.pnl >= 0 ? "#10b981" : "#ef4444"}
                      stroke="white"
                      strokeWidth="0.3"
                      className="hover:r-1.5 transition-all duration-200 cursor-pointer"
                    />
                  </g>
                ))}
              </svg>
              
              {/* Hover tooltips */}
              {chartData.map((data, index) => (
                <div
                  key={index}
                  className="absolute group"
                  style={{
                    left: `${(index / (chartData.length - 1)) * 100}%`,
                    top: `${getYPosition(data.cumulative)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-transparent group-hover:bg-blue-100 transition-colors cursor-pointer"></div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      <div className="font-medium">{data.asset}</div>
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-1 ${data.direction === 'long' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        Trade: {formatCurrency(data.pnl, portfolio.currency)}
                      </div>
                      <div>Total: {formatCurrency(data.cumulative, portfolio.currency)}</div>
                      <div className="text-gray-300">{new Date(data.date).toLocaleDateString()}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis */}
          <div className="flex justify-between mt-4 ml-20 mr-4 text-xs text-gray-500">
            <span>Trade 1</span>
            {chartData.length > 10 && (
              <span>Trade {Math.floor(chartData.length / 2)}</span>
            )}
            {chartData.length > 1 && <span>Trade {chartData.length}</span>}
          </div>
        </div>

        {/* Trade Performance Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{chartData.length}</div>
            <div className="text-xs text-gray-600">Total Trades</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {chartData.length > 0 ? ((winningTrades / chartData.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-gray-600">Win Rate</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {winningTrades > 0 ? formatCurrency(chartData.filter(d => d.pnl > 0).reduce((sum, d) => sum + d.pnl, 0) / winningTrades, portfolio.currency) : formatCurrency(0, portfolio.currency)}
            </div>
            <div className="text-xs text-gray-600">Avg Win</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              {losingTrades > 0 ? formatCurrency(chartData.filter(d => d.pnl < 0).reduce((sum, d) => sum + d.pnl, 0) / losingTrades, portfolio.currency) : formatCurrency(0, portfolio.currency)}
            </div>
            <div className="text-xs text-gray-600">Avg Loss</div>
          </div>
        </div>
      </div>
    </div>
  );
}
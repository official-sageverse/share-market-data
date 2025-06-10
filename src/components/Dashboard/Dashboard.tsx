import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  BarChart3,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ConsistencyGraph } from './ConsistencyGraph';
import { useTradingData } from '../../hooks/useTradingData';
import { calculateAnalytics, formatCurrency, formatPercent } from '../../utils/calculations';

export function Dashboard() {
  const { trades, portfolio, goals } = useTradingData();
  const analytics = calculateAnalytics(trades);
  
  const totalPnL = portfolio.currentBalance - portfolio.initialCapital;
  const totalReturn = ((portfolio.currentBalance - portfolio.initialCapital) / portfolio.initialCapital) * 100;
  
  const activeGoals = goals.filter(g => g.isActive);
  const monthlyGoal = activeGoals.find(g => g.type === 'monthly');
  
  const recentTrades = trades.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your trading performance and key metrics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Account Balance"
          value={formatCurrency(portfolio.currentBalance, portfolio.currency)}
          change={`${totalReturn >= 0 ? '+' : ''}${formatPercent(totalReturn)}`}
          changeType={totalReturn >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          description="Current portfolio value"
        />
        
        <MetricCard
          title="Total P&L"
          value={formatCurrency(totalPnL, portfolio.currency)}
          change={`${trades.length} trades`}
          changeType={totalPnL >= 0 ? 'positive' : 'negative'}
          icon={totalPnL >= 0 ? TrendingUp : TrendingDown}
          description="All-time profit/loss"
        />
        
        <MetricCard
          title="Win Rate"
          value={`${analytics.winRate.toFixed(1)}%`}
          change={`${analytics.totalTrades} closed trades`}
          changeType={analytics.winRate >= 50 ? 'positive' : 'negative'}
          icon={Target}
          description="Percentage of winning trades"
        />
        
        <MetricCard
          title="Profit Factor"
          value={analytics.profitFactor.toFixed(2)}
          change={analytics.profitFactor >= 1 ? 'Profitable' : 'Needs improvement'}
          changeType={analytics.profitFactor >= 1 ? 'positive' : 'negative'}
          icon={BarChart3}
          description="Gross profit / Gross loss"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Average Win"
          value={formatCurrency(analytics.avgWin, portfolio.currency)}
          icon={TrendingUp}
          description="Average winning trade"
        />
        
        <MetricCard
          title="Average Loss"
          value={formatCurrency(analytics.avgLoss, portfolio.currency)}
          icon={TrendingDown}
          description="Average losing trade"
        />
        
        <MetricCard
          title="Best Day"
          value={formatCurrency(analytics.bestDay, portfolio.currency)}
          icon={Award}
          description="Highest daily profit"
        />
        
        <MetricCard
          title="Max Drawdown"
          value={formatCurrency(analytics.maxDrawdown, portfolio.currency)}
          icon={TrendingDown}
          description="Largest peak-to-trough loss"
        />
      </div>

      {/* Trading Consistency Graph */}
      <ConsistencyGraph />

      {/* Monthly Goal Progress */}
      {monthlyGoal && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Goal Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{monthlyGoal.description}</span>
                <span className="font-medium">
                  {formatCurrency(monthlyGoal.current, portfolio.currency)} / {formatCurrency(monthlyGoal.target, portfolio.currency)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((monthlyGoal.current / monthlyGoal.target) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatPercent((monthlyGoal.current / monthlyGoal.target) * 100)} complete</span>
                <span>Due: {new Date(monthlyGoal.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trades */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Trades</h3>
          {recentTrades.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No trades recorded yet</p>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Direction
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trade.asset}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          trade.direction === 'long' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(trade.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {trade.isOpen ? (
                          <span className="text-gray-500">-</span>
                        ) : (
                          <span className={`font-medium ${
                            (trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(trade.pnl || 0, portfolio.currency)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          trade.isOpen 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {trade.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
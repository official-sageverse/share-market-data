import React from 'react';
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { generateConsistencyData, formatCurrency } from '../../utils/calculations';

export function ConsistencyGraph() {
  const { trades, portfolio } = useTradingData();
  const consistencyData = generateConsistencyData(trades);
  
  if (consistencyData.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Trading Consistency</h3>
          </div>
        </div>
        <div className="px-6 py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trading data yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your consistency chart will appear here once you start trading
          </p>
        </div>
      </div>
    );
  }
  
  // Group data by weeks for better visualization
  const weeks: Array<Array<typeof consistencyData[0]>> = [];
  let currentWeek: Array<typeof consistencyData[0]> = [];
  
  // Get the last 52 weeks of data
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - (52 * 7 * 24 * 60 * 60 * 1000));
  
  // Filter data to last 52 weeks
  const filteredData = consistencyData.filter(day => {
    const dayDate = new Date(day.date);
    return dayDate >= startDate && dayDate <= endDate;
  });
  
  // Create week structure
  for (let i = 0; i < 52; i++) {
    const weekStart = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    const weekData: Array<typeof consistencyData[0]> = [];
    
    for (let j = 0; j < 7; j++) {
      const currentDate = new Date(weekStart.getTime() + (j * 24 * 60 * 60 * 1000));
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = filteredData.find(d => d.date === dateStr);
      
      if (dayData) {
        weekData.push(dayData);
      } else {
        weekData.push({
          date: dateStr,
          pnl: 0,
          level: 0,
          trades: 0
        });
      }
    }
    weeks.push(weekData);
  }

  const getLevelColor = (level: number, pnl: number): string => {
    if (level === 0) return 'bg-gray-100'; // No trades
    
    if (pnl > 0) {
      // Profit levels - green shades with better visibility
      switch (level) {
        case 1: return 'bg-green-200'; // Light green - more visible
        case 2: return 'bg-green-300'; // Medium green
        case 3: return 'bg-green-500'; // Good green
        case 4: return 'bg-green-700'; // Dark green
        default: return 'bg-green-200';
      }
    } else {
      // Loss levels - red fills with dark red borders
      switch (level) {
        case -1: return 'bg-red-200'; // Light red - more visible
        case -2: return 'bg-red-300'; // Medium red
        case -3: return 'bg-red-500'; // Bad red
        case -4: return 'bg-red-700'; // Dark red
        default: return 'bg-red-200';
      }
    }
  };

  const getBorderColor = (level: number, pnl: number): string => {
    if (level === 0) return 'border-gray-300'; // No trades
    
    if (pnl > 0) {
      // Profit - green borders
      return 'border-green-600';
    } else {
      // Loss - dark red borders for better visibility
      return 'border-red-800';
    }
  };

  const totalTradingDays = filteredData.filter(d => d.trades > 0).length;
  const profitableDays = filteredData.filter(d => d.pnl > 0).length;
  const consistencyRate = totalTradingDays > 0 ? (profitableDays / totalTradingDays) * 100 : 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Trading Consistency</h3>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-gray-600">{profitableDays} profitable days</span>
            </div>
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-gray-600">{totalTradingDays - profitableDays} loss days</span>
            </div>
            <div className="text-gray-600 font-medium">
              {consistencyRate.toFixed(1)}% win rate
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-6">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">
            Each square represents a trading day. Green for profits, red for losses. Darker colors = higher amounts.
          </p>
          
          {/* Enhanced Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
            <span className="font-medium">Less</span>
            <div className="flex space-x-1 items-center">
              <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-300"></div>
              <span className="text-xs mx-1">No trades</span>
              <div className="w-3 h-3 bg-red-200 rounded-sm border-2 border-red-800"></div>
              <div className="w-3 h-3 bg-red-300 rounded-sm border-2 border-red-800"></div>
              <div className="w-3 h-3 bg-red-500 rounded-sm border-2 border-red-800"></div>
              <div className="w-3 h-3 bg-red-700 rounded-sm border-2 border-red-800"></div>
              <span className="text-xs mx-2">Loss</span>
              <div className="w-3 h-3 bg-green-200 rounded-sm border border-green-600"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm border border-green-600"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm border border-green-600"></div>
              <div className="w-3 h-3 bg-green-700 rounded-sm border border-green-600"></div>
              <span className="text-xs mx-1">Profit</span>
            </div>
            <span className="font-medium">More</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-8"></div> {/* Space for day labels */}
              {weeks.map((week, weekIndex) => {
                if (week.length === 0) return <div key={weekIndex} className="w-3"></div>;
                
                const firstDay = week[0];
                const date = new Date(firstDay.date);
                const isFirstWeekOfMonth = date.getDate() <= 7;
                
                return (
                  <div key={weekIndex} className="w-3 text-xs text-gray-500 text-center">
                    {isFirstWeekOfMonth && weekIndex % 4 === 0 ? monthNames[date.getMonth()] : ''}
                  </div>
                );
              })}
            </div>

            {/* Day labels and grid */}
            <div className="flex">
              {/* Day of week labels */}
              <div className="flex flex-col space-y-1 mr-2">
                {dayNames.map((day, index) => (
                  <div key={day} className="h-3 text-xs text-gray-500 flex items-center w-6">
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Calendar squares */}
              <div className="flex space-x-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const dayData = week[dayIndex];
                      
                      if (!dayData) {
                        return <div key={dayIndex} className="w-3 h-3"></div>;
                      }

                      return (
                        <div
                          key={dayData.date}
                          className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 border-2 hover:scale-125 hover:z-10 relative ${getLevelColor(dayData.level, dayData.pnl)} ${getBorderColor(dayData.level, dayData.pnl)}`}
                          title={`${new Date(dayData.date).toLocaleDateString()}: ${
                            dayData.trades === 0 
                              ? 'No trades' 
                              : `${dayData.trades} trade${dayData.trades > 1 ? 's' : ''}, ${formatCurrency(dayData.pnl, portfolio.currency)}`
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-gray-900">{totalTradingDays}</div>
            <div className="text-sm text-gray-600">Trading Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{profitableDays}</div>
            <div className="text-sm text-gray-600">Profitable Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-blue-600">{consistencyRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Daily Win Rate</div>
          </div>
        </div>

        {/* Recent Activity */}
        {filteredData.filter(d => d.trades > 0).length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Trading Activity</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filteredData
                .filter(d => d.trades > 0)
                .slice(-5)
                .reverse()
                .map((day, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg border">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {day.trades} trade{day.trades > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      day.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {day.pnl >= 0 ? '+' : ''}{formatCurrency(day.pnl, portfolio.currency)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
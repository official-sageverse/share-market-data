import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { generateConsistencyData, formatCurrency } from '../../utils/calculations';

export function ConsistencyGraph() {
  const { trades, portfolio } = useTradingData();
  const consistencyData = generateConsistencyData(trades);
  
  // Group data by weeks for better visualization
  const weeks: Array<Array<typeof consistencyData[0]>> = [];
  let currentWeek: Array<typeof consistencyData[0]> = [];
  
  consistencyData.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) { // Sunday, start new week
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    if (index === consistencyData.length - 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  });

  const getLevelColor = (level: number): string => {
    const colors = {
      0: 'bg-gray-100',      // No trades
      1: 'bg-green-100',     // Small profit
      2: 'bg-green-200',     // Medium profit
      3: 'bg-green-400',     // Good profit
      4: 'bg-green-600',     // Excellent profit
      '-1': 'bg-red-100',    // Small loss
      '-2': 'bg-red-200',    // Medium loss
      '-3': 'bg-red-400',    // Bad loss
      '-4': 'bg-red-600',    // Terrible loss
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100';
  };

  const totalTradingDays = consistencyData.filter(d => d.trades > 0).length;
  const profitableDays = consistencyData.filter(d => d.pnl > 0).length;
  const consistencyRate = totalTradingDays > 0 ? (profitableDays / totalTradingDays) * 100 : 0;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            Each square represents a trading day. Hover to see details.
          </p>
          
          {/* Legend */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-6">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-red-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-8"></div> {/* Space for day labels */}
              {weeks.map((week, weekIndex) => {
                const firstDay = week[0];
                const date = new Date(firstDay.date);
                const isFirstWeekOfMonth = date.getDate() <= 7;
                
                return (
                  <div key={weekIndex} className="w-3 text-xs text-gray-500 text-center">
                    {isFirstWeekOfMonth ? monthNames[date.getMonth()] : ''}
                  </div>
                );
              })}
            </div>

            {/* Day labels and grid */}
            <div className="flex">
              {/* Day of week labels */}
              <div className="flex flex-col space-y-1 mr-2">
                {dayNames.map((day, index) => (
                  <div key={day} className="h-3 text-xs text-gray-500 flex items-center">
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Calendar squares */}
              <div className="flex space-x-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const dayData = week.find(d => new Date(d.date).getDay() === dayIndex);
                      
                      if (!dayData) {
                        return <div key={dayIndex} className="w-3 h-3"></div>;
                      }

                      return (
                        <div
                          key={dayData.date}
                          className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-300 ${getLevelColor(dayData.level)}`}
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
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalTradingDays}</div>
            <div className="text-sm text-gray-600">Trading Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{profitableDays}</div>
            <div className="text-sm text-gray-600">Profitable Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{consistencyRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Daily Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
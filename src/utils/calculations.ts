import { Trade, Analytics } from '../types';

export function calculatePnL(trade: Trade): number {
  if (!trade.exitPrice || trade.isOpen) return 0;
  
  const difference = trade.direction === 'long' 
    ? trade.exitPrice - trade.entryPrice
    : trade.entryPrice - trade.exitPrice;
  
  return (difference * trade.positionSize) - (trade.fees || 0);
}

export function calculateAnalytics(trades: Trade[]): Analytics {
  const closedTrades = trades.filter(t => !t.isOpen && t.exitPrice);
  
  if (closedTrades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      bestDay: 0,
      worstDay: 0,
      avgHoldingTime: 0,
    };
  }

  const wins = closedTrades.filter(t => (t.pnl || calculatePnL(t)) > 0);
  const losses = closedTrades.filter(t => (t.pnl || calculatePnL(t)) < 0);
  
  const totalWins = wins.reduce((sum, t) => sum + (t.pnl || calculatePnL(t)), 0);
  const totalLosses = Math.abs(losses.reduce((sum, t) => sum + (t.pnl || calculatePnL(t)), 0));
  
  const winRate = (wins.length / closedTrades.length) * 100;
  const avgWin = wins.length > 0 ? totalWins / wins.length : 0;
  const avgLoss = losses.length > 0 ? totalLosses / losses.length : 0;
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins;

  // Group trades by day for daily P&L analysis
  const dailyPnL = new Map<string, number>();
  closedTrades.forEach(trade => {
    const date = trade.date;
    const pnl = trade.pnl || calculatePnL(trade);
    dailyPnL.set(date, (dailyPnL.get(date) || 0) + pnl);
  });

  const dailyReturns = Array.from(dailyPnL.values());
  const bestDay = Math.max(...dailyReturns, 0);
  const worstDay = Math.min(...dailyReturns, 0);

  // Calculate max drawdown
  let peak = 0;
  let maxDrawdown = 0;
  let runningPnL = 0;
  
  closedTrades.forEach(trade => {
    runningPnL += trade.pnl || calculatePnL(trade);
    if (runningPnL > peak) peak = runningPnL;
    const drawdown = peak - runningPnL;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  // Calculate average holding time (in hours)
  const avgHoldingTime = closedTrades.reduce((sum, trade) => {
    const entryTime = new Date(`${trade.date} ${trade.time}`);
    const exitTime = new Date(); // Simplified - would need exit time in real app
    return sum + (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
  }, 0) / closedTrades.length;

  return {
    totalTrades: closedTrades.length,
    winRate,
    avgWin,
    avgLoss,
    profitFactor,
    sharpeRatio: calculateSharpeRatio(dailyReturns),
    maxDrawdown,
    bestDay,
    worstDay,
    avgHoldingTime,
  };
}

function calculateSharpeRatio(returns: number[]): number {
  if (returns.length < 2) return 0;
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev > 0 ? avgReturn / stdDev : 0;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'Fr',
    'INR': '₹',
  };

  const symbol = currencySymbols[currency] || '$';
  
  // For INR, format with Indian numbering system (lakhs and crores)
  if (currency === 'INR') {
    return formatIndianCurrency(amount, symbol);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  }).format(amount).replace(/[A-Z]{3}/, symbol);
}

function formatIndianCurrency(amount: number, symbol: string): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 10000000) { // 1 crore
    const crores = (absAmount / 10000000).toFixed(2);
    return `${isNegative ? '-' : ''}${symbol}${crores}Cr`;
  } else if (absAmount >= 100000) { // 1 lakh
    const lakhs = (absAmount / 100000).toFixed(2);
    return `${isNegative ? '-' : ''}${symbol}${lakhs}L`;
  } else if (absAmount >= 1000) { // 1 thousand
    const thousands = (absAmount / 1000).toFixed(2);
    return `${isNegative ? '-' : ''}${symbol}${thousands}K`;
  } else {
    return `${isNegative ? '-' : ''}${symbol}${absAmount.toFixed(2)}`;
  }
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

// Generate consistency graph data (GitHub-style)
export function generateConsistencyData(trades: Trade[], startDate?: Date): Array<{
  date: string;
  pnl: number;
  level: number;
  trades: number;
}> {
  const endDate = new Date();
  const start = startDate || new Date(endDate.getTime() - (365 * 24 * 60 * 60 * 1000)); // 1 year ago
  
  // Group trades by date
  const dailyData = new Map<string, { pnl: number; trades: number }>();
  
  // Initialize all dates with 0
  for (let d = new Date(start); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyData.set(dateStr, { pnl: 0, trades: 0 });
  }
  
  // Populate with actual trade data
  trades.filter(t => !t.isOpen && t.exitPrice).forEach(trade => {
    const date = trade.date;
    const pnl = trade.pnl || calculatePnL(trade);
    const existing = dailyData.get(date) || { pnl: 0, trades: 0 };
    dailyData.set(date, {
      pnl: existing.pnl + pnl,
      trades: existing.trades + 1
    });
  });
  
  // Convert to array and calculate levels
  const dataArray = Array.from(dailyData.entries()).map(([date, data]) => ({
    date,
    pnl: data.pnl,
    trades: data.trades,
    level: calculateLevel(data.pnl, data.trades)
  }));
  
  return dataArray.sort((a, b) => a.date.localeCompare(b.date));
}

function calculateLevel(pnl: number, trades: number): number {
  if (trades === 0) return 0; // No trades
  if (pnl > 0) {
    // Profit levels (1-4, green shades)
    if (pnl >= 1000) return 4; // Dark green
    if (pnl >= 500) return 3;   // Medium green
    if (pnl >= 100) return 2;   // Light green
    return 1;                   // Very light green
  } else if (pnl < 0) {
    // Loss levels (-1 to -4, red shades)
    if (pnl <= -1000) return -4; // Dark red
    if (pnl <= -500) return -3;  // Medium red
    if (pnl <= -100) return -2;  // Light red
    return -1;                   // Very light red
  }
  return 0; // Break-even
}
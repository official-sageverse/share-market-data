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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
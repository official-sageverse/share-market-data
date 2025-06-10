import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  TrendingUp,
  Award,
  AlertCircle,
  Clock,
  BarChart3,
  CheckCircle,
  XCircle,
  Activity,
  Zap
} from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { Goal } from '../../types';
import { formatCurrency, formatPercent, calculateGoalAnalytics } from '../../utils/calculations';

const goalTypes = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const goalCategories = [
  { value: 'profit', label: 'Profit Target', icon: TrendingUp },
  { value: 'winrate', label: 'Win Rate', icon: Target },
  { value: 'trades', label: 'Number of Trades', icon: Award },
  { value: 'drawdown', label: 'Max Drawdown Limit', icon: AlertCircle },
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'excellent': return 'text-green-600 bg-green-50';
    case 'good': return 'text-blue-600 bg-blue-50';
    case 'average': return 'text-yellow-600 bg-yellow-50';
    case 'poor': return 'text-orange-600 bg-orange-50';
    case 'bad': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getProbabilityColor = (probability: number) => {
  if (probability >= 80) return 'text-green-600 bg-green-50';
  if (probability >= 60) return 'text-blue-600 bg-blue-50';
  if (probability >= 40) return 'text-yellow-600 bg-yellow-50';
  if (probability >= 20) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

export function GoalManager() {
  const { goals, addGoal, updateGoal, deleteGoal, trades, portfolio } = useTradingData();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    type: 'monthly' as Goal['type'],
    category: 'profit' as Goal['category'],
    target: '',
    description: '',
    deadline: '',
    priority: 'medium' as Goal['priority'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.target || !formData.description || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const goalData = {
      type: formData.type,
      category: formData.category,
      target: parseFloat(formData.target),
      current: 0,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      isActive: true,
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }

    // Reset form
    setFormData({
      type: 'monthly',
      category: 'profit',
      target: '',
      description: '',
      deadline: '',
      priority: 'medium',
    });
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      type: goal.type,
      category: goal.category,
      target: goal.target.toString(),
      description: goal.description,
      deadline: goal.deadline,
      priority: goal.priority,
    });
    setShowForm(true);
  };

  const toggleGoalStatus = (goal: Goal) => {
    updateGoal(goal.id, { isActive: !goal.isActive });
  };

  const activeGoals = goals.filter(g => g.isActive);
  const completedGoals = goals.filter(g => !g.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goals & Targets</h2>
          <p className="mt-1 text-sm text-gray-500">
            Set and track your trading goals with advanced analytics and probability forecasting
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-medium text-gray-900">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Goal Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Goal['type'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {goalTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {goalCategories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={formData.category === 'profit' ? '1000.00' : formData.category === 'winrate' ? '75' : '50'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your goal and what you want to achieve..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  setFormData({
                    type: 'monthly',
                    category: 'profit',
                    target: '',
                    description: '',
                    deadline: '',
                    priority: 'medium',
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
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Goals ({activeGoals.length})</h3>
        </div>
        <div className="px-6 py-4">
          {activeGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active goals</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first goal to start tracking your progress!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeGoals.map((goal) => {
                const analytics = calculateGoalAnalytics(goal, trades, portfolio);
                const CategoryIcon = goalCategories.find(c => c.value === goal.category)?.icon || Target;
                const priorityStyle = priorities.find(p => p.value === goal.priority)?.color || 'bg-gray-100 text-gray-800';
                
                return (
                  <div key={goal.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <CategoryIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{goal.description}</h4>
                          <div className="flex items-center mt-1 space-x-3">
                            <span className="text-sm text-gray-500 capitalize">{goal.type} Goal</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityStyle}`}>
                              {goal.priority} priority
                            </span>
                            <span className="text-sm text-gray-500">
                              Due: {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {goal.category === 'profit' ? formatCurrency(analytics.current, portfolio.currency) : analytics.current.toFixed(1)}
                          {' / '}
                          {goal.category === 'profit' ? formatCurrency(goal.target, portfolio.currency) : goal.target}
                          {goal.category === 'winrate' && '%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            analytics.progress >= 100 ? 'bg-green-500' : 
                            analytics.progress >= 75 ? 'bg-blue-500' : 
                            analytics.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(analytics.progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{analytics.progress.toFixed(1)}% complete</span>
                        <span>{analytics.daysRemaining} days remaining</span>
                      </div>
                    </div>

                    {/* Analytics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Remaining</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {goal.category === 'profit' 
                                ? formatCurrency(analytics.remaining, portfolio.currency)
                                : analytics.remaining.toFixed(1)
                              }
                              {goal.category === 'winrate' && '%'}
                            </p>
                          </div>
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Growth Rate</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {analytics.growthRate > 0 ? '+' : ''}{analytics.growthRate.toFixed(1)}%
                            </p>
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Avg Growth</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {analytics.averageGrowth > 0 ? '+' : ''}{analytics.averageGrowth.toFixed(1)}%
                            </p>
                          </div>
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Required Daily</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {goal.category === 'profit' 
                                ? formatCurrency(analytics.requiredDailyProgress, portfolio.currency)
                                : analytics.requiredDailyProgress.toFixed(1)
                              }
                            </p>
                          </div>
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    {/* Performance Rating and Probability */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 ${getRatingColor(analytics.performanceRating)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Performance Rating</p>
                            <p className="text-lg font-bold capitalize">{analytics.performanceRating}</p>
                            <p className="text-xs opacity-75">{analytics.ratingDescription}</p>
                          </div>
                          <div className="text-right">
                            {analytics.performanceRating === 'excellent' && <Zap className="h-6 w-6" />}
                            {analytics.performanceRating === 'good' && <CheckCircle className="h-6 w-6" />}
                            {analytics.performanceRating === 'average' && <Activity className="h-6 w-6" />}
                            {(analytics.performanceRating === 'poor' || analytics.performanceRating === 'bad') && <XCircle className="h-6 w-6" />}
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg border-2 ${getProbabilityColor(analytics.achievementProbability)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Achievement Probability</p>
                            <p className="text-lg font-bold">{analytics.achievementProbability.toFixed(0)}%</p>
                            <p className="text-xs opacity-75">{analytics.probabilityDescription}</p>
                          </div>
                          <div className="text-right">
                            <div className="w-12 h-12 rounded-full border-4 border-current flex items-center justify-center">
                              <span className="text-xs font-bold">{analytics.achievementProbability.toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Insights */}
                    {analytics.insights.length > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-2">💡 Insights & Recommendations</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {analytics.insights.map((insight, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Completed Goals ({completedGoals.length})</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {completedGoals.slice(0, 5).map((goal) => {
                const CategoryIcon = goalCategories.find(c => c.value === goal.category)?.icon || Target;
                
                return (
                  <div key={goal.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CategoryIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{goal.description}</h4>
                        <p className="text-xs text-gray-500">
                          Completed • Target: {goal.category === 'profit' ? formatCurrency(goal.target, portfolio.currency) : goal.target}
                        </p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
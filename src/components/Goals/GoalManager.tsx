import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { Goal } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/calculations';

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

export function GoalManager() {
  const { goals, addGoal, updateGoal, trades } = useTradingData();
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

  const calculateProgress = (goal: Goal) => {
    // This is a simplified calculation - in a real app, you'd calculate based on actual data
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const timeProgress = Math.min(100, ((now.getTime() - new Date(goal.createdAt).getTime()) / (deadline.getTime() - new Date(goal.createdAt).getTime())) * 100);
    
    // Mock current progress based on goal type and category
    let current = 0;
    if (goal.category === 'profit') {
      current = Math.random() * goal.target * 0.7; // Mock progress
    } else if (goal.category === 'winrate') {
      current = 65 + Math.random() * 20; // Mock win rate
    } else if (goal.category === 'trades') {
      current = Math.floor(Math.random() * goal.target * 0.8);
    }
    
    return { current, progress: (current / goal.target) * 100, timeProgress };
  };

  const activeGoals = goals.filter(g => g.isActive);
  const completedGoals = goals.filter(g => !g.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goals & Targets</h2>
          <p className="mt-1 text-sm text-gray-500">
            Set and track your trading goals and performance targets
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
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
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
          <h3 className="text-lg font-medium text-gray-900">Active Goals</h3>
        </div>
        <div className="px-6 py-4">
          {activeGoals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active goals. Create your first goal to get started!</p>
          ) : (
            <div className="space-y-6">
              {activeGoals.map((goal) => {
                const { current, progress } = calculateProgress(goal);
                const CategoryIcon = goalCategories.find(c => c.value === goal.category)?.icon || Target;
                const priorityStyle = priorities.find(p => p.value === goal.priority)?.color || 'bg-gray-100 text-gray-800';
                
                return (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <CategoryIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{goal.description}</h4>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-gray-500 capitalize">{goal.type}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityStyle}`}>
                              {goal.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleGoalStatus(goal)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {goal.category === 'profit' ? formatCurrency(current) : current.toFixed(1)}
                          {' / '}
                          {goal.category === 'profit' ? formatCurrency(goal.target) : goal.target}
                          {goal.category === 'winrate' && '%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{progress.toFixed(1)}% complete</span>
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
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
import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  description 
}: MetricCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }[changeType];

  const bgGradient = {
    positive: 'from-green-50 to-emerald-50 border-green-200',
    negative: 'from-red-50 to-rose-50 border-red-200',
    neutral: 'from-blue-50 to-indigo-50 border-blue-200',
  }[changeType];

  const iconBg = {
    positive: 'bg-green-100',
    negative: 'bg-red-100',
    neutral: 'bg-blue-100',
  }[changeType];

  const iconColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-blue-600',
  }[changeType];

  return (
    <div className={`bg-gradient-to-br ${bgGradient} overflow-hidden shadow-sm rounded-xl border hover:shadow-md transition-all duration-300 hover:scale-105`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 ${iconBg} rounded-xl shadow-sm`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-600 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${changeColor}`}>
                    {change}
                  </div>
                )}
              </dd>
              {description && (
                <dd className="text-xs text-gray-500 mt-1">{description}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { KPIMetrics } from '../types/railway';

interface KPIDashboardProps {
  kpis: KPIMetrics;
  detailed?: boolean;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ kpis, detailed = false }) => {
  const kpiCards = [
    {
      title: '🚆 Avg Delay Reduced',
      value: `${kpis.avg_delay_reduced} min`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: kpis.avg_delay_reduced < 0 ? 'positive' : 'negative',
      description: 'Average delay reduction across network'
    },
    {
      title: '⚡ Throughput Increase',
      value: `+${kpis.throughput_increase}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: 'positive',
      description: 'Network throughput improvement'
    },
    {
      title: '⏱️ Replan Time',
      value: `${kpis.replan_time} sec`,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: kpis.replan_time < 5 ? 'positive' : 'neutral',
      description: 'Time to generate optimization plan'
    },
    {
      title: '✅ Suggestion Acceptance',
      value: `${kpis.suggestion_acceptance}%`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      trend: kpis.suggestion_acceptance > 75 ? 'positive' : 'neutral',
      description: 'AI suggestion acceptance rate'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          📊 Live KPI Metrics
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          Real-time
        </div>
      </div>

      <div className={`grid ${detailed ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className={`${kpi.bgColor} ${kpi.borderColor} border rounded-lg p-4 transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${kpi.color} flex items-center space-x-2`}>
                {kpi.icon}
                <h3 className="font-medium text-sm">{kpi.title}</h3>
              </div>
              <div className="text-right">
                {kpi.trend === 'positive' && <span className="text-green-500">↗️</span>}
                {kpi.trend === 'negative' && <span className="text-red-500">↘️</span>}
                {kpi.trend === 'neutral' && <span className="text-gray-500">➡️</span>}
              </div>
            </div>
            
            <div className={`text-2xl font-bold ${kpi.color} mb-1`}>
              {kpi.value}
            </div>
            
            {detailed && (
              <p className="text-xs text-gray-600">{kpi.description}</p>
            )}
          </div>
        ))}
      </div>

      {detailed && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Performance Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Network Efficiency:</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Optimizations:</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium text-green-600">96%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fuel Savings:</span>
              <span className="font-medium text-blue-600">2,340 L</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick action buttons */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-railway-blue text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
          📈 View Analytics
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
          📊 Export Report
        </button>
      </div>
    </div>
  );
};

export default KPIDashboard;

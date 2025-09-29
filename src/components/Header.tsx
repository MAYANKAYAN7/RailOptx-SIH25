import React from 'react';
import { Train, MapPin, BarChart3, Zap, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isConnected }) => {
  const tabs = [
    {
      id: 'dashboard',
      name: '📍 Dashboard',
      icon: <MapPin className="w-4 h-4" />,
      description: 'Main control center'
    },
    {
      id: 'conflicts',
      name: '🚦 Conflicts & Suggestions', 
      icon: <Settings className="w-4 h-4" />,
      description: 'Conflict resolution'
    },
    {
      id: 'kpis',
      name: '📊 KPI Metrics',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Performance analytics'
    },
    {
      id: 'simulator',
      name: '⚡ What-If Simulator',
      icon: <Zap className="w-4 h-4" />,
      description: 'Scenario analysis'
    }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Top section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Train className="w-8 h-8 text-railway-blue mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  🚆 RailOptiX
                </h1>
                <p className="text-sm text-gray-600">Intelligent Railway Traffic Optimizer</p>
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                {isConnected ? 'System Online' : 'System Offline'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'short',
                  timeStyle: 'medium'
                })}
              </div>
              <div className="text-xs text-gray-400">Indian Standard Time</div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-railway-blue text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
              title={tab.description}
            >
              {tab.icon}
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Animated gradient line */}
      <div className="h-1 bg-gradient-to-r from-railway-blue via-railway-green to-railway-blue animate-pulse"></div>
    </header>
  );
};

export default Header;

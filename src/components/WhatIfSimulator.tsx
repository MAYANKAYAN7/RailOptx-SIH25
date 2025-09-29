import React, { useState } from 'react';
import { Play, BarChart3, Settings, TrendingUp } from 'lucide-react';

const WhatIfSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [scenarioParams, setScenarioParams] = useState({
    name: 'Peak Hour Optimization',
    priorityBoost: 20,
    reroutingEnabled: true,
    delayTolerance: 5
  });

  const runSimulation = async () => {
    setIsRunning(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock simulation results
    setSimulationResult({
      id: 'sim-' + Date.now(),
      scenario_name: scenarioParams.name,
      results: {
        before: {
          avg_delay: 12,
          throughput: 85,
          conflicts: 4,
          efficiency: 78
        },
        after: {
          avg_delay: 6,
          throughput: 97,
          conflicts: 1,
          efficiency: 94
        },
        improvements: {
          delay_reduction: '-6 min',
          throughput_gain: '+12%',
          conflict_reduction: '-3 conflicts',
          efficiency_gain: '+16%'
        }
      },
      recommendations: [
        'Implement priority-based scheduling during peak hours',
        'Enable dynamic rerouting for freight trains',
        'Optimize signal timing at major junctions',
        'Increase platform utilization efficiency'
      ],
      confidence: 94,
      execution_time: '2.3 seconds'
    });
    
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          ⚡ What-If Simulator
          <span className="ml-3 text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            Scenario Analysis
          </span>
        </h2>

        {/* Scenario Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Scenario Parameters
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario Name
              </label>
              <input
                type="text"
                value={scenarioParams.name}
                onChange={(e) => setScenarioParams(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Express Priority Boost: {scenarioParams.priorityBoost}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={scenarioParams.priorityBoost}
                onChange={(e) => setScenarioParams(prev => ({ ...prev, priorityBoost: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay Tolerance: {scenarioParams.delayTolerance} minutes
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={scenarioParams.delayTolerance}
                onChange={(e) => setScenarioParams(prev => ({ ...prev, delayTolerance: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            <div className="flex items-center">
              <input
                id="rerouting"
                type="checkbox"
                checked={scenarioParams.reroutingEnabled}
                onChange={(e) => setScenarioParams(prev => ({ ...prev, reroutingEnabled: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rerouting" className="ml-2 text-sm text-gray-700">
                Enable Dynamic Rerouting
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Network Scope:</span>
                <span className="font-medium">Delhi-Mumbai Corridor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Window:</span>
                <span className="font-medium">24 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Train Types:</span>
                <span className="font-medium">Express, Freight, Passenger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Variables:</span>
                <span className="font-medium">47 Parameters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Run Simulation Button */}
        <div className="text-center mb-6">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`px-8 py-3 rounded-lg font-medium text-lg flex items-center justify-center mx-auto transition-all duration-300 ${
              isRunning
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-3" />
                Run What-If Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            📊 Simulation Results
            <span className="ml-3 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {simulationResult.confidence}% Confidence
            </span>
          </h3>

          {/* Before vs After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-3">Current State</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Delay:</span>
                  <span className="font-bold text-red-600">{simulationResult.results.before.avg_delay} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="font-bold">{simulationResult.results.before.throughput}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Conflicts:</span>
                  <span className="font-bold">{simulationResult.results.before.conflicts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span className="font-bold">{simulationResult.results.before.efficiency}%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Optimized State</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Delay:</span>
                  <span className="font-bold text-green-600">{simulationResult.results.after.avg_delay} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="font-bold">{simulationResult.results.after.throughput}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Conflicts:</span>
                  <span className="font-bold">{simulationResult.results.after.conflicts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span className="font-bold">{simulationResult.results.after.efficiency}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Projected Improvements
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {simulationResult.results.improvements.delay_reduction}
                </div>
                <div className="text-sm text-gray-600">Delay Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {simulationResult.results.improvements.throughput_gain}
                </div>
                <div className="text-sm text-gray-600">Throughput Gain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {simulationResult.results.improvements.conflict_reduction}
                </div>
                <div className="text-sm text-gray-600">Conflicts Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {simulationResult.results.improvements.efficiency_gain}
                </div>
                <div className="text-sm text-gray-600">Efficiency Gain</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">🎯 AI Recommendations</h4>
            <div className="space-y-2">
              {simulationResult.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Details */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Simulation completed in {simulationResult.execution_time}</span>
              <span>Scenario ID: {simulationResult.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;

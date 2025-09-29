import React from 'react';
import { Brain, CheckCircle, XCircle, Info } from 'lucide-react';
import { Suggestion } from '../types/railway';

interface AISuggestionsProps {
  suggestions: Suggestion[];
  onAcceptSuggestion: (suggestionId: string, conflictId: string) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions, onAcceptSuggestion }) => {
  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'priority_based': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'balanced': return 'bg-green-100 text-green-800 border-green-200';
      case 'rerouting': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'priority_based': return '🎯';
      case 'balanced': return '⚖️';
      case 'rerouting': return '🔄';
      default: return '🤖';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-500" />
          🤖 AI Suggestions
        </h2>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {suggestions.length} Available
        </div>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🤖</div>
            <p>No AI suggestions at the moment</p>
            <p className="text-sm">System is monitoring for optimization opportunities</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Optimization Recommendation</h3>
                    <p className="text-xs text-gray-500">Conflict ID: {suggestion.conflict_id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {suggestion.impact_analysis.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Recommended Strategy */}
              <div className="mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStrategyColor(suggestion.recommended_option.strategy)}`}>
                  <span className="mr-1">{getStrategyIcon(suggestion.recommended_option.strategy)}</span>
                  {suggestion.recommended_option.name}
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 font-medium mb-1">Strategy Explanation:</p>
                    <p className="text-sm text-gray-600">{suggestion.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Expected Impact */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-600">Delay Reduction</div>
                  <div className="text-lg font-bold text-green-600">
                    -{suggestion.impact_analysis.delay_reduction} min
                  </div>
                </div>
                <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-600">Throughput Gain</div>
                  <div className="text-lg font-bold text-blue-600">
                    {suggestion.impact_analysis.throughput_gain}
                  </div>
                </div>
                <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-600">Fuel Savings</div>
                  <div className="text-lg font-bold text-purple-600">
                    {suggestion.impact_analysis.fuel_savings}
                  </div>
                </div>
                <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-600">Network Efficiency</div>
                  <div className="text-lg font-bold text-indigo-600">
                    {suggestion.impact_analysis.network_efficiency}
                  </div>
                </div>
              </div>

              {/* Action Details */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Recommended Actions:</div>
                <div className="space-y-2">
                  {suggestion.recommended_option.actions.map((action, index) => (
                    <div key={index} className="bg-white bg-opacity-75 p-2 rounded border text-sm">
                      <div className="font-medium">
                        Train {action.train_id}: {action.action.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-gray-600">
                        {action.duration && `Duration: ${action.duration} min`}
                        {action.alternative_route && ` • Route: ${action.alternative_route}`}
                        {action.location && ` • Location: ${action.location}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => onAcceptSuggestion(suggestion.id, suggestion.conflict_id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Suggestion
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors">
                  <XCircle className="w-4 h-4 mr-2" />
                  Override
                </button>
              </div>

              {/* Alternative Options */}
              {suggestion.options.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Alternative Options:</div>
                  <div className="space-y-1">
                    {suggestion.options.slice(1, 3).map((option, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                        <span className="font-medium">{option.name}:</span> {option.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AISuggestions;

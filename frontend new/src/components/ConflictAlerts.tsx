import React from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Conflict, Suggestion } from '../types/railway';

interface ConflictAlertsProps {
  conflicts: Conflict[];
  suggestions: Suggestion[];
  onAcceptSuggestion: (suggestionId: string, conflictId: string) => void;
}

const ConflictAlerts: React.FC<ConflictAlertsProps> = ({ 
  conflicts, 
  suggestions, 
  onAcceptSuggestion 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          🚨 Active Conflicts
        </h2>
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          {conflicts.length} Active
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {conflicts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">✅</div>
            <p>No active conflicts detected</p>
            <p className="text-sm">System operating smoothly</p>
          </div>
        ) : (
          conflicts.map((conflict) => {
            const suggestion = suggestions.find(s => s.conflict_id === conflict.id);
            
            return (
              <div 
                key={conflict.id}
                className={`border-l-4 p-4 rounded-lg ${getPriorityColor(conflict.priority)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getPriorityIcon(conflict.priority)}</span>
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {conflict.type.replace('_', ' ')}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    ID: {conflict.id.slice(0, 8)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="font-medium">{conflict.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Potential delay: {conflict.potential_delay} minutes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-xs text-gray-600">Train 1</div>
                      <div className="font-semibold">{conflict.train1.name}</div>
                      <div className="text-xs text-gray-500">
                        {conflict.train1.type} • +{conflict.train1.current_delay}min
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-xs text-gray-600">Train 2</div>
                      <div className="font-semibold">{conflict.train2.name}</div>
                      <div className="text-xs text-gray-500">
                        {conflict.train2.type} • +{conflict.train2.current_delay}min
                      </div>
                    </div>
                  </div>

                  {suggestion && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-blue-600">🤖</span>
                          <span className="ml-2 font-medium text-blue-900">AI Suggestion Available</span>
                        </div>
                        <button
                          onClick={() => onAcceptSuggestion(suggestion.id, conflict.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        {suggestion.recommended_option.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-red-600">
              {conflicts.filter(c => c.priority === 'high').length}
            </div>
            <div className="text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-yellow-600">
              {conflicts.filter(c => c.priority === 'medium').length}
            </div>
            <div className="text-gray-600">Medium</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">
              {conflicts.filter(c => c.priority === 'low').length}
            </div>
            <div className="text-gray-600">Low</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictAlerts;

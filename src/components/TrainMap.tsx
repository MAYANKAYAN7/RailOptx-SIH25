import React, { useEffect, useRef } from 'react';
import { Train, Conflict } from '../types/railway';

interface TrainMapProps {
  trains: Train[];
  conflicts: Conflict[];
}

const TrainMap: React.FC<TrainMapProps> = ({ trains, conflicts }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize map when component mounts
    // This is a simplified version - in production you'd use Leaflet here
    console.log('Map initialized with', trains.length, 'trains and', conflicts.length, 'conflicts');
  }, [trains, conflicts]);

  const getTrainIcon = (type: string) => {
    switch (type) {
      case 'Express': return '🚆';
      case 'Freight': return '🚛';
      case 'Passenger': return '🚌';
      default: return '🚂';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time': return 'text-green-600';
      case 'slight_delay': return 'text-yellow-600';
      case 'delayed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">🗺️ Real-Time Train Map</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>On Time</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Conflict</span>
          </div>
        </div>
      </div>
      
      {/* Simplified map visualization */}
      <div 
        ref={mapRef}
        className="w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e5e7eb" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
        }}
      >
        {/* Railway lines */}
        <div className="absolute inset-4">
          <div className="w-full h-1 bg-gray-400 absolute top-1/4 rounded"></div>
          <div className="w-full h-1 bg-gray-400 absolute top-2/4 rounded"></div>
          <div className="w-full h-1 bg-gray-400 absolute top-3/4 rounded"></div>
          <div className="h-full w-1 bg-gray-400 absolute left-1/4 rounded"></div>
          <div className="h-full w-1 bg-gray-400 absolute left-2/4 rounded"></div>
          <div className="h-full w-1 bg-gray-400 absolute left-3/4 rounded"></div>
        </div>

        {/* Train positions */}
        {trains.map((train, index) => (
          <div
            key={train.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110`}
            style={{
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index * 20) % 40}%`,
            }}
            title={`${train.name} - ${train.status} (${train.delay}min delay)`}
          >
            <div className={`text-2xl ${getStatusColor(train.status)}`}>
              {getTrainIcon(train.type)}
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {train.id} ({train.delay > 0 ? `+${train.delay}min` : 'On Time'})
            </div>
          </div>
        ))}

        {/* Conflict markers */}
        {conflicts.map((conflict, index) => (
          <div
            key={conflict.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              left: `${40 + (index * 20) % 30}%`,
              top: `${40 + (index * 15) % 30}%`,
            }}
          >
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {conflict.type.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        ))}

        {/* Station markers */}
        {['New Delhi', 'Agra Cantt', 'Jaipur', 'Mumbai Central'].map((station, index) => (
          <div
            key={station}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${15 + index * 25}%`,
              top: `${20 + (index % 2) * 60}%`,
            }}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 whitespace-nowrap">
              {station}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg text-xs">
          <div className="font-semibold mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span>🚆</span>
              <span>Express</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚛</span>
              <span>Freight</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Station</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Conflict</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Train status summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="font-semibold text-green-800">On Time</div>
          <div className="text-2xl font-bold text-green-600">
            {trains.filter(t => t.status === 'on_time').length}
          </div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="font-semibold text-yellow-800">Delayed</div>
          <div className="text-2xl font-bold text-yellow-600">
            {trains.filter(t => t.status === 'slight_delay' || t.status === 'delayed').length}
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="font-semibold text-red-800">Conflicts</div>
          <div className="text-2xl font-bold text-red-600">
            {conflicts.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainMap;

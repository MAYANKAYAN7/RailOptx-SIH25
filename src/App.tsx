import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from './components/Header';
import TrainMap from './components/TrainMap';
import ConflictAlerts from './components/ConflictAlerts';
import KPIDashboard from './components/KPIDashboard';
import AISuggestions from './components/AISuggestions';
import WhatIfSimulator from './components/WhatIfSimulator';
import { Train, Conflict, KPIMetrics, Suggestion } from './types/railway';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [trains, setTrains] = useState<Train[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [kpis, setKpis] = useState<KPIMetrics>({
    avg_delay_reduced: -6,
    throughput_increase: 12,
    replan_time: 4,
    suggestion_acceptance: 78
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('https://railoptx-sih25.onrender.com', {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    // Socket event handlers
    newSocket.on('connect', () => {
      console.log('🔗 Connected to RailOptiX Backend');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
      setIsConnected(false);
    });

    newSocket.on('data_update', (data) => {
      console.log('📊 Received data update', data);
      if (data.trains) setTrains(data.trains);
      if (data.conflicts) setConflicts(data.conflicts);
      if (data.kpis) setKpis(data.kpis);
    });

    newSocket.on('conflict_detected', (data) => {
      console.log('🚨 New conflict detected', data);
      if (data.conflicts) setConflicts(prev => [...prev, ...data.conflicts]);
      if (data.suggestions) setSuggestions(prev => [...prev, ...data.suggestions]);
      
      // Show notification
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('RailOptiX Alert', {
          body: `New conflict detected: ${data.conflicts[0]?.location}`,
          icon: '🚆'
        });
      }
    });

    newSocket.on('suggestion_implemented', (data) => {
      console.log('✅ Suggestion implemented', data);
      if (data.kpis) setKpis(data.kpis);
      
      // Remove resolved conflict and suggestion
      setConflicts(prev => prev.filter(c => c.id !== data.conflict_id));
      setSuggestions(prev => prev.filter(s => s.id !== data.suggestion_id));
    });

    newSocket.on('kpi_update', (data) => {
      console.log('📈 KPI Update', data);
      if (data.kpis) setKpis(data.kpis);
    });

    // Request initial data
    newSocket.emit('request_update');

    // Request notification permission
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, []);

  // Periodic data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (socket && isConnected) {
        socket.emit('request_update');
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [socket, isConnected]);

  const handleAcceptSuggestion = async (suggestionId: string, conflictId: string) => {
    try {
      const response = await fetch('https://railoptx-sih25.onrender.com/api/accept-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suggestion_id: suggestionId,
          conflict_id: conflictId,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Suggestion accepted successfully');
        
        // Update KPIs immediately for demo effect
        setKpis(prev => ({
          ...prev,
          avg_delay_reduced: prev.avg_delay_reduced - 2,
          suggestion_acceptance: Math.min(95, prev.suggestion_acceptance + 1)
        }));
        
        // Remove the suggestion and conflict from state
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        setConflicts(prev => prev.filter(c => c.id !== conflictId));
      }
    } catch (error) {
      console.error('Failed to accept suggestion:', error);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-6 p-6">
            {/* Main Train Map */}
            <div className="col-span-8">
              <TrainMap trains={trains} conflicts={conflicts} />
            </div>
            
            {/* Conflict Alerts Sidebar */}
            <div className="col-span-4">
              <ConflictAlerts 
                conflicts={conflicts} 
                suggestions={suggestions}
                onAcceptSuggestion={handleAcceptSuggestion}
              />
            </div>
            
            {/* AI Suggestions Panel */}
            <div className="col-span-8">
              <AISuggestions 
                suggestions={suggestions}
                onAcceptSuggestion={handleAcceptSuggestion}
              />
            </div>
            
            {/* KPI Dashboard */}
            <div className="col-span-4">
              <KPIDashboard kpis={kpis} />
            </div>
          </div>
        );
      
      case 'conflicts':
        return (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <ConflictAlerts 
                conflicts={conflicts} 
                suggestions={suggestions}
                onAcceptSuggestion={handleAcceptSuggestion}
              />
              <AISuggestions 
                suggestions={suggestions}
                onAcceptSuggestion={handleAcceptSuggestion}
              />
            </div>
          </div>
        );
      
      case 'kpis':
        return (
          <div className="p-6">
            <KPIDashboard kpis={kpis} detailed={true} />
          </div>
        );
      
      case 'simulator':
        return (
          <div className="p-6">
            <WhatIfSimulator />
          </div>
        );
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isConnected={isConnected}
      />
      
      {!isConnected && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-6 rounded">
          <strong className="font-bold">Connection Error:</strong>
          <span className="block sm:inline"> Unable to connect to RailOptiX backend. Please ensure the server is running.</span>
        </div>
      )}
      
      <main className="pb-6">
        {renderActiveTab()}
      </main>
      
      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white px-6 py-2 text-sm flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span>{isConnected ? 'Connected to RailOptiX Backend' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>Active Trains: {trains.length}</span>
          <span>Active Conflicts: {conflicts.length}</span>
          <span>Pending Suggestions: {suggestions.length}</span>
        </div>
      </div>
    </div>
  );
}

export default App;

// TypeScript interfaces for the RailOptiX system

export interface Train {
  id: string;
  name: string;
  type: 'Express' | 'Passenger' | 'Freight';
  priority: 'high' | 'medium' | 'low';
  from_station: string;
  to_station: string;
  current_station: string;
  position: {
    lat: number;
    lng: number;
  };
  delay: number;
  speed: number;
  status: 'on_time' | 'slight_delay' | 'delayed';
  last_updated: string;
  scheduled_arrival: string;
  platform?: number;
  consist?: {
    coaches?: number;
    ac_coaches?: number;
    sleeper_coaches?: number;
    wagons?: number;
    weight?: string;
  };
  occupancy?: number;
}

export interface Conflict {
  id: string;
  type: 'train_crossing' | 'platform_conflict' | 'signal_conflict' | 'track_maintenance';
  priority: 'high' | 'medium' | 'low';
  location: string;
  estimated_time: Date | string;
  train1: {
    id: string;
    name: string;
    type: string;
    priority: string;
    current_delay: number;
    estimated_arrival: Date | string;
  };
  train2: {
    id: string;
    name: string;
    type: string;
    priority: string;
    current_delay: number;
    estimated_arrival: Date | string;
  };
  conflict_severity: 'low' | 'medium' | 'high';
  potential_delay: number;
  status: 'active' | 'resolved';
  detected_at: string;
  resolved_at?: string;
  resolution_method?: string;
}

export interface Suggestion {
  id: string;
  conflict_id: string;
  type: 'conflict_resolution';
  priority: 'high' | 'medium' | 'low';
  options: OptimizationOption[];
  recommended_option: OptimizationOption;
  explanation: string;
  impact_analysis: {
    delay_reduction: number;
    throughput_gain: string;
    passenger_impact: string;
    network_efficiency: string;
    fuel_savings: string;
    confidence: number;
  };
  timestamp: string;
}

export interface OptimizationOption {
  id: string;
  name: string;
  strategy: 'priority_based' | 'balanced' | 'rerouting';
  actions: Array<{
    train_id: string;
    action: string;
    duration?: number;
    location: string;
    alternative_route?: string;
    additional_time?: number;
  }>;
  expected_delay_reduction: number;
  throughput_impact: string;
  description: string;
}

export interface KPIMetrics {
  avg_delay_reduced: number;
  throughput_increase: number;
  replan_time: number;
  suggestion_acceptance: number;
}

export interface NetworkStatus {
  total_active_trains: number;
  on_time_trains: number;
  delayed_trains: number;
  avg_delay_minutes: number;
  network_efficiency: number;
  last_updated: string;
}

export interface SimulationResult {
  id: string;
  scenario_name: string;
  parameters: Record<string, any>;
  results: {
    before: {
      avg_delay: number;
      throughput: number;
      conflicts: number;
      efficiency: number;
    };
    after: {
      avg_delay: number;
      throughput: number;
      conflicts: number;
      efficiency: number;
    };
    improvements: {
      delay_reduction: string;
      throughput_gain: string;
      conflict_reduction: string;
      efficiency_gain: string;
    };
  };
  recommendations: string[];
  confidence: number;
  execution_time: string;
  timestamp: string;
}

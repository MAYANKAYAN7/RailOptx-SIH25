"""
RailOptiX Data Manager
Handles train data, positions, schedules, and network information
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any

class DataManager:
    """Manages all train and network data for the optimization system"""
    
    def __init__(self):
        self.trains = {}
        self.network_layout = {}
        self.initialize_mock_data()
        
    def initialize_mock_data(self):
        """Initialize mock train data for demo purposes"""
        
        # Indian Railway stations and junctions
        stations = [
            {'id': 'NDLS', 'name': 'New Delhi', 'lat': 28.6448, 'lng': 77.2141},
            {'id': 'BCT', 'name': 'Mumbai Central', 'lat': 19.0330, 'lng': 72.8205}, 
            {'id': 'MAS', 'name': 'Chennai Central', 'lat': 13.0827, 'lng': 80.2707},
            {'id': 'HWH', 'name': 'Howrah', 'lat': 22.5726, 'lng': 88.3639},
            {'id': 'SBC', 'name': 'Bangalore City', 'lat': 12.9716, 'lng': 77.5946},
            {'id': 'PUNE', 'name': 'Pune Junction', 'lat': 18.5204, 'lng': 73.8567},
            {'id': 'AGC', 'name': 'Agra Cantt', 'lat': 27.1767, 'lng': 78.0081},
            {'id': 'JP', 'name': 'Jaipur', 'lat': 26.9124, 'lng': 75.7873}
        ]
        
        # Sample trains with realistic Indian Railway numbers and names
        sample_trains = [
            {
                'id': '12953',
                'name': 'August Kranti Rajdhani Express',
                'type': 'Express',
                'priority': 'high',
                'from_station': 'NDLS',
                'to_station': 'BCT',
                'current_station': 'AGC',
                'delay': 0,
                'speed': 95
            },
            {
                'id': '34521', 
                'name': 'Freight Special',
                'type': 'Freight',
                'priority': 'low',
                'from_station': 'PUNE',
                'to_station': 'NDLS',
                'current_station': 'AGC',
                'delay': 15,
                'speed': 45
            },
            {
                'id': '12015',
                'name': 'Ajmer Shatabdi Express',
                'type': 'Express',
                'priority': 'high', 
                'from_station': 'NDLS',
                'to_station': 'JP',
                'current_station': 'AGC',
                'delay': 5,
                'speed': 110
            },
            {
                'id': '22933',
                'name': 'Bdts Aljn Express',
                'type': 'Express',
                'priority': 'medium',
                'from_station': 'BCT',
                'to_station': 'JP',
                'current_station': 'AGC',
                'delay': 8,
                'speed': 85
            },
            {
                'id': '16031',
                'name': 'Andaman Express',
                'type': 'Passenger',
                'priority': 'medium',
                'from_station': 'MAS',
                'to_station': 'SBC',
                'current_station': 'SBC',
                'delay': 2,
                'speed': 70
            }
        ]
        
        # Initialize trains with positions and status
        for train_data in sample_trains:
            train_id = train_data['id']
            
            # Find station coordinates
            current_station_data = next((s for s in stations if s['id'] == train_data['current_station']), stations[0])
            
            self.trains[train_id] = {
                **train_data,
                'position': {
                    'lat': current_station_data['lat'] + random.uniform(-0.01, 0.01),
                    'lng': current_station_data['lng'] + random.uniform(-0.01, 0.01)
                },
                'status': self._get_status_from_delay(train_data['delay']),
                'last_updated': datetime.now().isoformat(),
                'scheduled_arrival': (datetime.now() + timedelta(hours=random.randint(1, 8))).isoformat(),
                'platform': random.randint(1, 6) if train_data['type'] != 'Freight' else None,
                'consist': self._generate_consist(train_data['type']),
                'occupancy': random.randint(60, 95) if train_data['type'] != 'Freight' else None
            }
        
        # Store station data
        self.network_layout['stations'] = {station['id']: station for station in stations}
        
    def _get_status_from_delay(self, delay: int) -> str:
        """Determine train status based on delay"""
        if delay <= 0:
            return 'on_time'
        elif delay <= 10:
            return 'slight_delay'
        else:
            return 'delayed'
    
    def _generate_consist(self, train_type: str) -> Dict:
        """Generate train consist information"""
        if train_type == 'Express':
            return {
                'coaches': random.randint(16, 24),
                'ac_coaches': random.randint(6, 12),
                'sleeper_coaches': random.randint(8, 12)
            }
        elif train_type == 'Passenger':
            return {
                'coaches': random.randint(12, 18),
                'ac_coaches': random.randint(2, 4),
                'sleeper_coaches': random.randint(8, 12)
            }
        else:  # Freight
            return {
                'wagons': random.randint(40, 60),
                'weight': f"{random.randint(2500, 4500)} tons"
            }
    
    def get_active_trains(self) -> List[Dict]:
        """Get all active trains with current status"""
        return list(self.trains.values())
    
    def get_train_by_id(self, train_id: str) -> Dict:
        """Get specific train data by ID"""
        return self.trains.get(train_id, {})
    
    def update_train_positions(self):
        """Simulate train movement by updating positions"""
        for train_id, train_data in self.trains.items():
            # Simulate small movement for demo
            current_lat = train_data['position']['lat']
            current_lng = train_data['position']['lng']
            
            # Small random movement to simulate train progress
            movement_factor = 0.001 if train_data['type'] != 'Freight' else 0.0005
            
            new_lat = current_lat + random.uniform(-movement_factor, movement_factor)
            new_lng = current_lng + random.uniform(-movement_factor, movement_factor)
            
            self.trains[train_id]['position'] = {'lat': new_lat, 'lng': new_lng}
            self.trains[train_id]['last_updated'] = datetime.now().isoformat()
            
            # Occasionally update delay (simulate real-time changes)
            if random.random() < 0.1:  # 10% chance
                delay_change = random.randint(-2, 3)
                new_delay = max(0, train_data['delay'] + delay_change)
                self.trains[train_id]['delay'] = new_delay
                self.trains[train_id]['status'] = self._get_status_from_delay(new_delay)
    
    def get_trains_near_location(self, lat: float, lng: float, radius: float = 0.1) -> List[Dict]:
        """Get trains within a certain radius of a location"""
        nearby_trains = []
        
        for train_data in self.trains.values():
            train_lat = train_data['position']['lat']
            train_lng = train_data['position']['lng']
            
            # Simple distance calculation (for demo purposes)
            distance = ((train_lat - lat) ** 2 + (train_lng - lng) ** 2) ** 0.5
            
            if distance <= radius:
                nearby_trains.append(train_data)
        
        return nearby_trains
    
    def get_network_status(self) -> Dict:
        """Get overall network status and statistics"""
        total_trains = len(self.trains)
        on_time_trains = sum(1 for train in self.trains.values() if train['status'] == 'on_time')
        delayed_trains = sum(1 for train in self.trains.values() if train['status'] == 'delayed')
        
        avg_delay = sum(train['delay'] for train in self.trains.values()) / total_trains if total_trains > 0 else 0
        
        return {
            'total_active_trains': total_trains,
            'on_time_trains': on_time_trains,
            'delayed_trains': delayed_trains,
            'avg_delay_minutes': round(avg_delay, 1),
            'network_efficiency': round((on_time_trains / total_trains) * 100, 1) if total_trains > 0 else 0,
            'last_updated': datetime.now().isoformat()
        }
    
    def add_train(self, train_data: Dict) -> str:
        """Add a new train to the system"""
        train_id = train_data.get('id', str(uuid.uuid4()))
        self.trains[train_id] = {
            **train_data,
            'id': train_id,
            'last_updated': datetime.now().isoformat()
        }
        return train_id
    
    def remove_train(self, train_id: str) -> bool:
        """Remove a train from the system"""
        if train_id in self.trains:
            del self.trains[train_id]
            return True
        return False
    
    def update_train_status(self, train_id: str, updates: Dict) -> bool:
        """Update specific train information"""
        if train_id in self.trains:
            self.trains[train_id].update(updates)
            self.trains[train_id]['last_updated'] = datetime.now().isoformat()
            return True
        return False

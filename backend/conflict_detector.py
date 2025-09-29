"""
RailOptiX Conflict Detector
Real-time conflict detection and analysis for railway operations
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any

class ConflictDetector:
    """Detects and manages railway operational conflicts"""
    
    def __init__(self):
        self.active_conflicts = {}
        self.conflict_history = []
        
        # Initialize with some demo conflicts
        self._initialize_demo_conflicts()
    
    def _initialize_demo_conflicts(self):
        """Initialize with demo conflicts for presentation"""
        demo_conflicts = [
            {
                'id': str(uuid.uuid4()),
                'type': 'train_crossing',
                'priority': 'high',
                'location': 'Agra Cantt Junction',
                'estimated_time': (datetime.now() + timedelta(minutes=8)).isoformat(),
                'train1': {
                    'id': '12953',
                    'name': 'August Kranti Rajdhani Express',
                    'type': 'Express',
                    'priority': 'high',
                    'current_delay': 0,
                    'estimated_arrival': (datetime.now() + timedelta(minutes=8)).isoformat()
                },
                'train2': {
                    'id': '34521',
                    'name': 'Freight Special',
                    'type': 'Freight', 
                    'priority': 'low',
                    'current_delay': 15,
                    'estimated_arrival': (datetime.now() + timedelta(minutes=10)).isoformat()
                },
                'conflict_severity': 'medium',
                'potential_delay': 12,
                'status': 'active',
                'detected_at': datetime.now().isoformat()
            },
            {
                'id': str(uuid.uuid4()),
                'type': 'platform_conflict',
                'priority': 'medium',
                'location': 'Agra Cantt Platform 2',
                'estimated_time': (datetime.now() + timedelta(minutes=15)).isoformat(),
                'train1': {
                    'id': '12015',
                    'name': 'Ajmer Shatabdi Express',
                    'type': 'Express',
                    'priority': 'high',
                    'current_delay': 5,
                    'estimated_arrival': (datetime.now() + timedelta(minutes=15)).isoformat()
                },
                'train2': {
                    'id': '22933',
                    'name': 'Bdts Aljn Express',
                    'type': 'Express',
                    'priority': 'medium',
                    'current_delay': 8,
                    'estimated_arrival': (datetime.now() + timedelta(minutes=16)).isoformat()
                },
                'conflict_severity': 'low',
                'potential_delay': 6,
                'status': 'active',
                'detected_at': datetime.now().isoformat()
            }
        ]
        
        for conflict in demo_conflicts:
            self.active_conflicts[conflict['id']] = conflict
    
    def detect_conflicts(self) -> List[Dict]:
        """Detect new conflicts in the railway network"""
        new_conflicts = []
        
        # Simulate occasional new conflict detection
        if random.random() < 0.15:  # 15% chance of detecting new conflict
            conflict_types = ['train_crossing', 'platform_conflict', 'signal_conflict', 'track_maintenance']
            
            new_conflict = {
                'id': str(uuid.uuid4()),
                'type': random.choice(conflict_types),
                'priority': random.choice(['low', 'medium', 'high']),
                'location': random.choice([
                    'Agra Cantt Junction',
                    'Delhi Junction Signal 42',
                    'Mumbai Central Platform 4',
                    'Chennai Central Yard'
                ]),
                'estimated_time': (datetime.now() + timedelta(minutes=random.randint(5, 30))).isoformat(),
                'train1': self._generate_random_train_info(),
                'train2': self._generate_random_train_info(),
                'conflict_severity': random.choice(['low', 'medium', 'high']),
                'potential_delay': random.randint(3, 20),
                'status': 'active',
                'detected_at': datetime.now().isoformat()
            }
            
            self.active_conflicts[new_conflict['id']] = new_conflict
            new_conflicts.append(new_conflict)
            
            # Add to history
            self.conflict_history.append({
                'timestamp': datetime.now().isoformat(),
                'action': 'conflict_detected',
                'conflict': new_conflict
            })
        
        return new_conflicts
    
    def _generate_random_train_info(self) -> Dict:
        """Generate random train information for conflict simulation"""
        train_names = [
            'Rajdhani Express', 'Shatabdi Express', 'Duronto Express',
            'Garib Rath', 'Jan Shatabdi', 'Freight Special',
            'Passenger Local', 'Express Special'
        ]
        
        train_types = ['Express', 'Passenger', 'Freight']
        train_type = random.choice(train_types)
        
        return {
            'id': str(random.randint(10000, 99999)),
            'name': random.choice(train_names),
            'type': train_type,
            'priority': 'high' if train_type == 'Express' else ('medium' if train_type == 'Passenger' else 'low'),
            'current_delay': random.randint(0, 20),
            'estimated_arrival': (datetime.now() + timedelta(minutes=random.randint(5, 30))).isoformat()
        }
    
    def get_active_conflicts(self) -> List[Dict]:
        """Get all currently active conflicts"""
        # Clean up old resolved conflicts
        current_time = datetime.now()
        conflicts_to_remove = []
        
        for conflict_id, conflict in self.active_conflicts.items():
            # Remove conflicts that are older than 30 minutes or marked as resolved
            estimated_time = conflict.get('estimated_time')
            try:
                if isinstance(estimated_time, str):
                    estimated_time_dt = datetime.fromisoformat(estimated_time.replace('Z', '+00:00'))
                    if conflict.get('status') == 'resolved' or (estimated_time_dt and current_time > estimated_time_dt + timedelta(minutes=30)):
                        conflicts_to_remove.append(conflict_id)
                elif conflict.get('status') == 'resolved':
                    conflicts_to_remove.append(conflict_id)
            except (ValueError, AttributeError):
                # If datetime parsing fails, remove old conflicts based on status only
                if conflict.get('status') == 'resolved':
                    conflicts_to_remove.append(conflict_id)
        
        for conflict_id in conflicts_to_remove:
            del self.active_conflicts[conflict_id]
        
        # Sort by priority and estimated time
        conflicts = list(self.active_conflicts.values())
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        
        conflicts.sort(key=lambda x: (
            priority_order.get(x.get('priority', 'low'), 1),
            x.get('estimated_time', datetime.now().isoformat())
        ), reverse=True)
        
        return conflicts
    
    def resolve_conflict(self, conflict_id: str, resolution_method: str) -> bool:
        """Mark a conflict as resolved"""
        if conflict_id in self.active_conflicts:
            self.active_conflicts[conflict_id]['status'] = 'resolved'
            self.active_conflicts[conflict_id]['resolved_at'] = datetime.now().isoformat()
            self.active_conflicts[conflict_id]['resolution_method'] = resolution_method
            
            # Add to history
            self.conflict_history.append({
                'timestamp': datetime.now().isoformat(),
                'action': 'conflict_resolved',
                'conflict_id': conflict_id,
                'resolution_method': resolution_method
            })
            
            return True
        return False
    
    def get_conflict_by_id(self, conflict_id: str) -> Dict:
        """Get specific conflict details"""
        return self.active_conflicts.get(conflict_id, {})
    
    def analyze_conflict_patterns(self) -> Dict:
        """Analyze historical conflict patterns for insights"""
        if not self.conflict_history:
            return {'message': 'No historical data available'}
        
        # Analyze conflict frequency by location
        location_frequency = {}
        conflict_types_freq = {}
        
        for entry in self.conflict_history:
            if entry.get('action') == 'conflict_detected':
                conflict = entry.get('conflict', {})
                location = conflict.get('location', 'Unknown')
                conflict_type = conflict.get('type', 'Unknown')
                
                location_frequency[location] = location_frequency.get(location, 0) + 1
                conflict_types_freq[conflict_type] = conflict_types_freq.get(conflict_type, 0) + 1
        
        return {
            'total_conflicts_detected': len([e for e in self.conflict_history if e.get('action') == 'conflict_detected']),
            'total_conflicts_resolved': len([e for e in self.conflict_history if e.get('action') == 'conflict_resolved']),
            'hotspot_locations': sorted(location_frequency.items(), key=lambda x: x[1], reverse=True)[:5],
            'common_conflict_types': sorted(conflict_types_freq.items(), key=lambda x: x[1], reverse=True),
            'analysis_timestamp': datetime.now().isoformat()
        }
    
    def get_conflict_statistics(self) -> Dict:
        """Get real-time conflict statistics"""
        active_conflicts = self.get_active_conflicts()
        
        high_priority = len([c for c in active_conflicts if c.get('priority') == 'high'])
        medium_priority = len([c for c in active_conflicts if c.get('priority') == 'medium'])
        low_priority = len([c for c in active_conflicts if c.get('priority') == 'low'])
        
        avg_potential_delay = sum(c.get('potential_delay', 0) for c in active_conflicts) / len(active_conflicts) if active_conflicts else 0
        
        return {
            'total_active_conflicts': len(active_conflicts),
            'high_priority_conflicts': high_priority,
            'medium_priority_conflicts': medium_priority,
            'low_priority_conflicts': low_priority,
            'average_potential_delay': round(avg_potential_delay, 1),
            'most_common_locations': self._get_most_common_conflict_locations(),
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_most_common_conflict_locations(self) -> List[str]:
        """Get most common conflict locations"""
        locations = [conflict.get('location', '') for conflict in self.active_conflicts.values()]
        location_counts = {}
        
        for location in locations:
            if location:
                location_counts[location] = location_counts.get(location, 0) + 1
        
        return sorted(location_counts.keys(), key=location_counts.get, reverse=True)[:3]

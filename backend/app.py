#!/usr/bin/env python3
"""
RailOptiX Backend - Intelligent Railway Traffic Optimizer
Flask API with real-time optimization engine for Indian Railways
"""

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
import time
import threading
from datetime import datetime, timedelta
import random
import uuid

from optimization_engine import TrainOptimizer
from data_manager import DataManager
from conflict_detector import ConflictDetector

app = Flask(__name__)
app.config['SECRET_KEY'] = 'railoptix_secret_2024'

# Enable CORS for all origins (for development)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize SocketIO with CORS support
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Initialize core components
data_manager = DataManager()
optimizer = TrainOptimizer()
conflict_detector = ConflictDetector()

# Global state
current_trains = {}
active_conflicts = {}
kpi_metrics = {
    'avg_delay_reduced': -6,
    'throughput_increase': 12,
    'replan_time': 4,
    'suggestion_acceptance': 78
}

@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        "service": "RailOptiX Backend",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/api/trains', methods=['GET'])
def get_trains():
    """Get all active trains with their current status"""
    trains = data_manager.get_active_trains()
    return jsonify({
        "status": "success",
        "data": trains,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/conflicts', methods=['GET'])
def get_conflicts():
    """Get all active conflicts and suggestions"""
    conflicts = conflict_detector.get_active_conflicts()
    suggestions = optimizer.get_recommendations(conflicts)
    
    return jsonify({
        "status": "success",
        "conflicts": conflicts,
        "suggestions": suggestions,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/accept-suggestion', methods=['POST'])
def accept_suggestion():
    """Accept an AI suggestion and implement the recommendation"""
    data = request.get_json()
    suggestion_id = data.get('suggestion_id')
    conflict_id = data.get('conflict_id')
    
    # Implement the suggestion
    result = optimizer.implement_suggestion(suggestion_id, conflict_id)
    
    if result['success']:
        # Update KPIs
        global kpi_metrics
        kpi_metrics['suggestion_acceptance'] = min(95, kpi_metrics['suggestion_acceptance'] + 1)
        kpi_metrics['avg_delay_reduced'] = kpi_metrics['avg_delay_reduced'] - 2
        
        # Broadcast update to all clients
        socketio.emit('suggestion_implemented', {
            'suggestion_id': suggestion_id,
            'conflict_id': conflict_id,
            'result': result,
            'kpis': kpi_metrics
        })
    
    return jsonify(result)

@app.route('/api/kpis', methods=['GET'])
def get_kpis():
    """Get current KPI metrics"""
    return jsonify({
        "status": "success",
        "kpis": kpi_metrics,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/simulate', methods=['POST'])
def run_simulation():
    """Run what-if simulation with given parameters"""
    data = request.get_json()
    scenario = data.get('scenario', {})
    
    # Run simulation
    simulation_results = optimizer.run_simulation(scenario)
    
    return jsonify({
        "status": "success",
        "simulation": simulation_results,
        "timestamp": datetime.now().isoformat()
    })

# SocketIO Events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f'Client connected: {request.sid}')
    emit('connected', {
        'message': 'Connected to RailOptiX Backend',
        'timestamp': datetime.now().isoformat()
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f'Client disconnected: {request.sid}')

@socketio.on('request_update')
def handle_update_request():
    """Handle client request for data update"""
    trains = data_manager.get_active_trains()
    conflicts = conflict_detector.get_active_conflicts()
    
    emit('data_update', {
        'trains': trains,
        'conflicts': conflicts,
        'kpis': kpi_metrics,
        'timestamp': datetime.now().isoformat()
    })

def simulate_real_time_updates():
    """Background thread to simulate real-time train movements and conflicts"""
    while True:
        try:
            # Update train positions
            data_manager.update_train_positions()
            
            # Check for new conflicts
            new_conflicts = conflict_detector.detect_conflicts()
            
            # Generate suggestions for new conflicts
            if new_conflicts:
                suggestions = optimizer.get_recommendations(new_conflicts)
                
                # Broadcast to all connected clients
                socketio.emit('conflict_detected', {
                    'conflicts': new_conflicts,
                    'suggestions': suggestions,
                    'timestamp': datetime.now().isoformat()
                })
            
            # Update KPIs periodically
            if random.random() < 0.1:  # 10% chance
                kpi_metrics['replan_time'] = random.randint(2, 8)
                socketio.emit('kpi_update', {
                    'kpis': kpi_metrics,
                    'timestamp': datetime.now().isoformat()
                })
            
            time.sleep(5)  # Update every 5 seconds
            
        except Exception as e:
            print(f"Error in real-time updates: {e}")
            time.sleep(10)

if __name__ == '__main__':
    # Start background thread for real-time updates
    update_thread = threading.Thread(target=simulate_real_time_updates, daemon=True)
    update_thread.start()
    
    print("🚆 RailOptiX Backend Starting...")
    print("📡 Real-time optimization engine ready")
    print("🔗 WebSocket server listening...")
    
    # Run the application
    import os

socketio.run(app,
             host="0.0.0.0",
             port=int(os.environ.get("PORT", 5000)),
             debug=False,
             use_reloader=False,
             allow_unsafe_werkzeug=True)

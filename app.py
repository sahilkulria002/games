from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
import json
import time
import random
import threading
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'snake_game_secret'
socketio = SocketIO(app, cors_allowed_origins="*")

# Game state management
game_sessions = {}
leaderboard = []
ai_players = {}

class SnakeAI:
    def __init__(self, game_id, player_id):
        self.game_id = game_id
        self.player_id = player_id
        self.snake = [{"x": 5, "y": 5}]
        self.direction = {"x": 1, "y": 0}
        self.score = 0
        self.difficulty = "medium"
        
    def find_path_to_food(self, food_pos, obstacles):
        """A* pathfinding algorithm to find optimal path to food"""
        # Simplified AI logic for demo
        head = self.snake[0]
        dx = food_pos["x"] - head["x"]
        dy = food_pos["y"] - head["y"]
        
        # Choose direction based on distance to food
        if abs(dx) > abs(dy):
            if dx > 0:
                return {"x": 1, "y": 0}
            else:
                return {"x": -1, "y": 0}
        else:
            if dy > 0:
                return {"x": 0, "y": 1}
            else:
                return {"x": 0, "y": -1}
    
    def get_next_move(self, game_state):
        """Calculate next move for AI snake"""
        if "food" in game_state:
            new_direction = self.find_path_to_food(game_state["food"], game_state.get("obstacles", []))
            # Avoid immediate collision with self
            head = self.snake[0]
            next_pos = {"x": head["x"] + new_direction["x"], "y": head["y"] + new_direction["y"]}
            
            # Check if next position would collide with snake body
            if next_pos not in self.snake[1:]:
                self.direction = new_direction
        
        return self.direction

class GameSession:
    def __init__(self, game_id):
        self.game_id = game_id
        self.players = {}
        self.game_state = {
            "food": {"x": 10, "y": 10},
            "power_ups": [],
            "obstacles": [],
            "game_mode": "classic",
            "started": False,
            "ended": False
        }
        self.ai_players = {}
        
    def add_player(self, player_id, player_name):
        self.players[player_id] = {
            "name": player_name,
            "snake": [{"x": random.randint(5, 15), "y": random.randint(5, 15)}],
            "direction": {"x": 1, "y": 0},
            "score": 0,
            "power_ups": [],
            "alive": True
        }
        
    def add_ai_player(self, difficulty="medium"):
        ai_id = f"ai_{len(self.ai_players)}"
        self.ai_players[ai_id] = SnakeAI(self.game_id, ai_id)
        return ai_id
    
    def update_game_state(self):
        if not self.game_state["started"] or self.game_state["ended"]:
            return
            
        # Update AI players
        for ai_id, ai_player in self.ai_players.items():
            move = ai_player.get_next_move(self.game_state)
            # Update AI snake position
            head = ai_player.snake[0]
            new_head = {"x": head["x"] + move["x"], "y": head["y"] + move["y"]}
            ai_player.snake.insert(0, new_head)
            
            # Check food collision for AI
            if new_head["x"] == self.game_state["food"]["x"] and new_head["y"] == self.game_state["food"]["y"]:
                ai_player.score += 10
                self.generate_food()
            else:
                ai_player.snake.pop()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/leaderboard')
def get_leaderboard():
    return jsonify(sorted(leaderboard, key=lambda x: x['score'], reverse=True)[:10])

@app.route('/api/save_score', methods=['POST'])
def save_score():
    data = request.get_json()
    score_entry = {
        "name": data.get('name', 'Anonymous'),
        "score": data.get('score', 0),
        "timestamp": datetime.now().isoformat(),
        "game_mode": data.get('game_mode', 'classic')
    }
    leaderboard.append(score_entry)
    return jsonify({"status": "success"})

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    emit('connected', {'data': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

@socketio.on('create_game')
def handle_create_game(data):
    game_id = f"game_{int(time.time())}"
    game_sessions[game_id] = GameSession(game_id)
    
    player_name = data.get('player_name', 'Player')
    game_sessions[game_id].add_player(request.sid, player_name)
    
    # Add AI players if requested
    if data.get('add_ai', False):
        ai_id = game_sessions[game_id].add_ai_player(data.get('ai_difficulty', 'medium'))
    
    join_room(game_id)
    emit('game_created', {
        'game_id': game_id,
        'player_id': request.sid,
        'game_state': game_sessions[game_id].game_state
    })

@socketio.on('join_game')
def handle_join_game(data):
    game_id = data['game_id']
    player_name = data.get('player_name', 'Player')
    
    if game_id in game_sessions:
        game_sessions[game_id].add_player(request.sid, player_name)
        join_room(game_id)
        
        emit('game_joined', {
            'game_id': game_id,
            'player_id': request.sid,
            'game_state': game_sessions[game_id].game_state
        })
        
        # Notify other players
        emit('player_joined', {
            'player_id': request.sid,
            'player_name': player_name
        }, room=game_id, include_self=False)

@socketio.on('start_game')
def handle_start_game(data):
    game_id = data['game_id']
    if game_id in game_sessions:
        game_sessions[game_id].game_state['started'] = True
        emit('game_started', room=game_id)
        
        # Start game loop for this session
        threading.Thread(target=game_loop, args=(game_id,), daemon=True).start()

@socketio.on('player_move')
def handle_player_move(data):
    game_id = data['game_id']
    direction = data['direction']
    
    if game_id in game_sessions and request.sid in game_sessions[game_id].players:
        game_sessions[game_id].players[request.sid]['direction'] = direction

def game_loop(game_id):
    """Main game loop running on server"""
    while game_id in game_sessions and game_sessions[game_id].game_state['started']:
        game_sessions[game_id].update_game_state()
        
        # Emit game state to all players
        socketio.emit('game_update', {
            'game_state': game_sessions[game_id].game_state,
            'players': game_sessions[game_id].players,
            'ai_players': {ai_id: {
                'snake': ai.snake,
                'score': ai.score
            } for ai_id, ai in game_sessions[game_id].ai_players.items()}
        }, room=game_id)
        
        time.sleep(0.1)  # 100ms game tick

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)

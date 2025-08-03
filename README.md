# Advanced Snake Game 🐍

An advanced, web-based Snake game featuring smooth movement, mouse control, shooting mechanics, and exciting special effects!

## Features

### 🎮 Game Modes
- **Classic Snake**: Traditional arrow-key controlled snake game
- **Smooth Snake Shooter**: Advanced mouse-controlled snake with shooting mechanics

### ✨ Advanced Features
- **Smooth Movement**: Non-pixelated, fluid snake movement
- **Mouse Control**: Snake follows your mouse pointer with intelligent behavior patterns
- **Shooting System**: Click to shoot bullets at targets
- **Multiple Moving Targets**: Dynamic targets that chase the snake
- **Variable Snake Length**: Snake grows when eating stunned targets
- **Special Abilities**: Magnetic field, time slow, multi-shot, and shield effects
- **Interactive Mouse Effects**: Special powers activate when snake reaches mouse cursor
- **Stunning Visual Effects**: Particle systems, explosions, glowing effects, and smooth animations

### 🎯 Gameplay Mechanics
- Hit targets with bullets to stun them for 5 seconds
- Eat stunned targets to gain points and grow your snake
- Combo system for increased scoring
- Health system with damage from moving targets
- Power-ups and special abilities
- Real-time multiplayer support (via WebSocket)

### 🎨 Visual Features
- Gradient backgrounds with animated stars
- Glowing snake with animated segments
- Particle effects and explosions
- Smooth bullet trails
- Energy rings and special effect overlays
- Dynamic crosshair
- Modern UI with responsive design

## 🚀 Getting Started

### Prerequisites
- Python 3.7+
- Flask
- Flask-SocketIO

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd games
```

2. Install dependencies:
```bash
pip install flask flask-socketio
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## 🎲 How to Play

### Smooth Snake Shooter Mode
1. **Movement**: Move your mouse to control the snake
2. **Shooting**: Click or press Space to shoot bullets
3. **Strategy**: 
   - Shoot targets to stun them
   - Eat stunned targets (orange glow) for points and growth
   - Avoid moving targets (they damage you)
   - Get close to your mouse cursor for special abilities

### Controls
- **Mouse Movement**: Control snake direction
- **Left Click / Space**: Shoot bullets
- **Start Button**: Begin the game
- **Pause Button**: Pause/Resume game

### Special Abilities
When your snake gets very close to the mouse cursor, special abilities activate:
- **Magnetic Field**: Attracts all targets towards you
- **Time Slow**: Slows down all game elements
- **Multi Shot**: Fires bullets in multiple directions
- **Shield**: Protects from damage temporarily

### Game Settings
- **Target Speed**: Adjust how fast targets move (configurable before game start)
- **Snake Behavior**: Choose between Follow, Orbit, or Chase patterns
- **Power-ups**: Toggle special power-ups on/off

## 🏗️ Project Structure

```
games/
├── app.py                     # Flask backend with multiplayer support
├── templates/
│   └── index.html            # Advanced game template
├── static/
│   ├── style.css            # Modern game styling
│   ├── smooth-snake.js      # Main smooth snake game logic
│   └── advanced-game.js     # Multiplayer game features
├── index.html               # Classic snake game (standalone)
├── script.js               # Classic game logic
├── style.css               # Classic game styling
└── README.md               # This file
```

## 🔧 Technical Features

- **Client-Side**: HTML5 Canvas, JavaScript ES6+, CSS3 animations
- **Server-Side**: Python Flask, WebSocket support via Flask-SocketIO
- **Real-time Multiplayer**: Socket.IO for real-time communication
- **AI Players**: Intelligent AI opponents with pathfinding
- **Responsive Design**: Works on desktop and mobile devices

## 🎯 Game Features Details

### Snake Behaviors
- **Follow**: Snake smoothly follows mouse with deceleration
- **Orbit**: Snake orbits around mouse cursor when close
- **Chase**: Snake chases mouse with figure-8 patterns

### Scoring System
- Hit targets: 5-40 points (varies by target type)
- Eat stunned targets: 20-40 points + combo multiplier
- Combo system: Build multipliers for consecutive hits
- Bonus points for special achievements

### Visual Effects
- Particle explosions on target hits
- Glowing snake segments with color variations
- Energy rings for special abilities
- Floating score text
- Dynamic background effects

## 🚀 Future Enhancements

- [ ] More power-up types
- [ ] Boss battles
- [ ] Level progression system
- [ ] Persistent leaderboards
- [ ] Sound effects and music
- [ ] Mobile touch controls optimization
- [ ] More snake behavior patterns

## 🤝 Contributing

Feel free to contribute to this project! Some areas for improvement:
- Additional special abilities
- New visual effects
- Mobile optimization
- Performance improvements
- New game modes

## 📄 License

This project is open source and available under the MIT License.

## 🎮 Enjoy Playing!

Have fun with your advanced snake game! The combination of smooth movement, shooting mechanics, and special effects creates a unique and engaging gaming experience.

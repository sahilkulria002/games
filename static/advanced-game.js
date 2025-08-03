// Advanced Snake Game Engine
class AdvancedSnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.socket = io();
        
        // Game state
        this.gameState = {
            mode: 'classic',
            running: false,
            paused: false,
            started: false,
            gameTime: 0,
            score: 0,
            highScore: this.getHighScore(),
            speed: 5,
            foodEaten: 0
        };
        
        // Snake properties
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // Game objects
        this.food = null;
        this.powerUps = [];
        this.obstacles = [];
        
        // Settings
        this.settings = {
            gridSize: 20,
            theme: 'neon',
            powerUpsEnabled: true,
            musicEnabled: true,
            soundEnabled: true
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.loadSettings();
        this.updateUI();
        this.startBackgroundAnimation();
        this.loadLeaderboard();
        
        // Initialize game state
        this.reset();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.tileCount = this.canvas.width / this.settings.gridSize;
    }
    
    bindEvents() {
        // Game controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        
        // Modal controls
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // Game over modal
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('saveScoreBtn').addEventListener('click', () => this.saveScore());
        
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMode(e.target.dataset.mode));
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Fullscreen
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        
        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        
        // Socket events
        this.socket.on('connect', () => console.log('Connected to server'));
        this.socket.on('game_update', (data) => this.handleGameUpdate(data));
    }
    
    handleKeyPress(e) {
        if (!this.gameState.running) return;
        
        switch(e.code) {
            case 'ArrowUp':
                e.preventDefault();
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
            case 'Space':
                e.preventDefault();
                this.togglePause();
                break;
            case 'KeyR':
                e.preventDefault();
                this.restartGame();
                break;
        }
    }
    
    selectMode(mode) {
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        this.gameState.mode = mode;
        
        if (mode === 'multiplayer') {
            this.openMultiplayerModal();
        }
    }
    
    reset() {
        // Reset snake to center
        const centerX = Math.floor(this.tileCount / 2);
        const centerY = Math.floor(this.tileCount / 2);
        
        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];
        
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        this.gameState.score = 0;
        this.gameState.foodEaten = 0;
        this.gameState.gameTime = 0;
        this.gameState.running = false;
        this.gameState.paused = false;
        this.gameState.started = false;
        
        this.generateFood();
        this.powerUps = [];
        this.obstacles = [];
        
        // Generate obstacles for survival mode
        if (this.gameState.mode === 'survival') {
            this.generateObstacles();
        }
        
        this.updateUI();
        this.draw();
    }
    
    startGame() {
        if (this.gameState.running) return;
        
        this.gameState.running = true;
        this.gameState.started = true;
        this.gameState.paused = false;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.startGameTimer();
        this.gameLoop();
        
        // Play start sound
        this.playSound('start');
    }
    
    togglePause() {
        if (!this.gameState.running) return;
        
        this.gameState.paused = !this.gameState.paused;
        document.getElementById('pauseBtn').innerHTML = this.gameState.paused ? 
            '<i class="fas fa-play"></i> Resume' : '<i class="fas fa-pause"></i> Pause';
        
        if (!this.gameState.paused) {
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.reset();
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> Pause';
        this.closeModal('gameOverModal');
    }
    
    gameLoop() {
        if (!this.gameState.running || this.gameState.paused) return;
        
        this.update();
        this.draw();
        
        const speed = Math.max(50, 200 - (this.gameState.speed * 15));
        setTimeout(() => this.gameLoop(), speed);
    }
    
    update() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Move snake
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        // Check obstacle collision
        if (this.obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }
        
        // Check power-up collisions
        this.powerUps = this.powerUps.filter(powerUp => {
            if (head.x === powerUp.x && head.y === powerUp.y) {
                this.activatePowerUp(powerUp);
                return false;
            }
            return true;
        });
        
        // Occasionally generate power-ups
        if (this.settings.powerUpsEnabled && Math.random() < 0.005) {
            this.generatePowerUp();
        }
        
        // Increase speed gradually
        this.gameState.speed = Math.min(10, 1 + Math.floor(this.gameState.score / 100));
        
        this.updateUI();
    }
    
    eatFood() {
        this.gameState.score += 10;
        this.gameState.foodEaten++;
        this.generateFood();
        this.playSound('eat');
        
        // Add visual effect
        this.createParticleEffect(this.food.x * this.settings.gridSize, this.food.y * this.settings.gridSize);
        
        // Check for high score
        if (this.gameState.score > this.gameState.highScore) {
            this.gameState.highScore = this.gameState.score;
            this.setHighScore(this.gameState.score);
        }
    }
    
    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (
            this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y) ||
            this.obstacles.some(obs => obs.x === this.food.x && obs.y === this.food.y)
        );
    }
    
    generatePowerUp() {
        const types = ['speed', 'slow', 'grow', 'shrink', 'points'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let powerUp;
        do {
            powerUp = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount),
                type: type,
                duration: 5000 // 5 seconds
            };
        } while (
            this.snake.some(segment => segment.x === powerUp.x && segment.y === powerUp.y) ||
            this.obstacles.some(obs => obs.x === powerUp.x && obs.y === powerUp.y) ||
            (this.food.x === powerUp.x && this.food.y === powerUp.y)
        );
        
        this.powerUps.push(powerUp);
    }
    
    generateObstacles() {
        const obstacleCount = Math.floor(this.tileCount / 3);
        this.obstacles = [];
        
        for (let i = 0; i < obstacleCount; i++) {
            let obstacle;
            do {
                obstacle = {
                    x: Math.floor(Math.random() * this.tileCount),
                    y: Math.floor(Math.random() * this.tileCount)
                };
            } while (
                this.snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
                this.obstacles.some(obs => obs.x === obstacle.x && obs.y === obstacle.y)
            );
            
            this.obstacles.push(obstacle);
        }
    }
    
    activatePowerUp(powerUp) {
        this.playSound('powerup');
        
        switch(powerUp.type) {
            case 'speed':
                this.gameState.speed = Math.min(10, this.gameState.speed + 2);
                break;
            case 'slow':
                this.gameState.speed = Math.max(1, this.gameState.speed - 2);
                break;
            case 'grow':
                // Add extra segments
                for (let i = 0; i < 3; i++) {
                    this.snake.push({ ...this.snake[this.snake.length - 1] });
                }
                break;
            case 'shrink':
                // Remove segments if possible
                if (this.snake.length > 3) {
                    this.snake.splice(-2, 2);
                }
                break;
            case 'points':
                this.gameState.score += 50;
                break;
        }
        
        this.updatePowerUpDisplay();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = '#666';
            this.ctx.fillRect(
                obstacle.x * this.settings.gridSize,
                obstacle.y * this.settings.gridSize,
                this.settings.gridSize - 1,
                this.settings.gridSize - 1
            );
        });
        
        // Draw snake
        this.drawSnake();
        
        // Draw food
        this.drawFood();
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => {
            this.drawPowerUp(powerUp);
        });
        
        // Draw pause overlay
        if (this.gameState.paused) {
            this.drawPauseOverlay();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            const pos = i * this.settings.gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.settings.gridSize;
            const y = segment.y * this.settings.gridSize;
            
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = this.getThemeColor('head');
                this.ctx.fillRect(x + 1, y + 1, this.settings.gridSize - 2, this.settings.gridSize - 2);
                
                // Draw eyes
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(x + 4, y + 4, 3, 3);
                this.ctx.fillRect(x + this.settings.gridSize - 7, y + 4, 3, 3);
            } else {
                // Snake body
                this.ctx.fillStyle = this.getThemeColor('body');
                this.ctx.fillRect(x + 1, y + 1, this.settings.gridSize - 2, this.settings.gridSize - 2);
            }
        });
    }
    
    drawFood() {
        if (!this.food) return;
        
        const x = this.food.x * this.settings.gridSize + this.settings.gridSize / 2;
        const y = this.food.y * this.settings.gridSize + this.settings.gridSize / 2;
        
        this.ctx.fillStyle = this.getThemeColor('food');
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.settings.gridSize / 2 - 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawPowerUp(powerUp) {
        const x = powerUp.x * this.settings.gridSize + this.settings.gridSize / 2;
        const y = powerUp.y * this.settings.gridSize + this.settings.gridSize / 2;
        
        this.ctx.fillStyle = this.getPowerUpColor(powerUp.type);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.settings.gridSize / 3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw power-up symbol
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.getPowerUpSymbol(powerUp.type), x, y + 4);
    }
    
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    getThemeColor(element) {
        const themes = {
            neon: {
                head: '#00ff88',
                body: '#ff0088',
                food: '#ffd93d'
            },
            retro: {
                head: '#00ff00',
                body: '#ffff00',
                food: '#ff0000'
            },
            matrix: {
                head: '#00ff00',
                body: '#008800',
                food: '#00ff00'
            },
            rainbow: {
                head: `hsl(${Date.now() % 360}, 100%, 50%)`,
                body: `hsl(${(Date.now() + 120) % 360}, 100%, 50%)`,
                food: `hsl(${(Date.now() + 240) % 360}, 100%, 50%)`
            }
        };
        
        return themes[this.settings.theme][element] || '#fff';
    }
    
    getPowerUpColor(type) {
        const colors = {
            speed: '#ff4444',
            slow: '#4444ff',
            grow: '#44ff44',
            shrink: '#ffaa44',
            points: '#ff44ff'
        };
        return colors[type] || '#fff';
    }
    
    getPowerUpSymbol(type) {
        const symbols = {
            speed: '⚡',
            slow: '🐌',
            grow: '⬆',
            shrink: '⬇',
            points: '★'
        };
        return symbols[type] || '?';
    }
    
    createParticleEffect(x, y) {
        // Simple particle effect implementation
        // This would be enhanced with a proper particle system
        console.log(`Particle effect at ${x}, ${y}`);
    }
    
    gameOver() {
        this.gameState.running = false;
        this.gameState.paused = false;
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        // Update final stats
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('finalTime').textContent = this.formatTime(this.gameState.gameTime);
        document.getElementById('foodEaten').textContent = this.gameState.foodEaten;
        
        // Show game over modal
        this.openModal('gameOverModal');
        
        this.playSound('gameOver');
    }
    
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameState.running && !this.gameState.paused) {
                this.gameState.gameTime++;
                this.updateUI();
            }
        }, 1000);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('highScore').textContent = this.gameState.highScore;
        document.getElementById('gameTime').textContent = this.formatTime(this.gameState.gameTime);
        document.getElementById('speed').textContent = this.gameState.speed + 'x';
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Settings and UI methods
    openSettings() {
        this.openModal('settingsModal');
    }
    
    closeSettings() {
        this.closeModal('settingsModal');
    }
    
    saveSettings() {
        this.settings.theme = document.getElementById('themeSelect').value;
        this.settings.powerUpsEnabled = document.getElementById('powerUpsToggle').checked;
        this.settings.musicEnabled = document.getElementById('musicToggle').checked;
        
        localStorage.setItem('snakeSettings', JSON.stringify(this.settings));
        this.closeSettings();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('snakeSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // Update UI
        document.getElementById('themeSelect').value = this.settings.theme;
        document.getElementById('powerUpsToggle').checked = this.settings.powerUpsEnabled;
        document.getElementById('musicToggle').checked = this.settings.musicEnabled;
    }
    
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    // Score management
    getHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore') || '0');
    }
    
    setHighScore(score) {
        localStorage.setItem('snakeHighScore', score.toString());
    }
    
    saveScore() {
        const name = document.getElementById('playerName').value || 'Anonymous';
        
        fetch('/api/save_score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                score: this.gameState.score,
                game_mode: this.gameState.mode
            })
        }).then(() => {
            this.loadLeaderboard();
            this.closeModal('gameOverModal');
        });
    }
    
    loadLeaderboard() {
        fetch('/api/leaderboard')
            .then(response => response.json())
            .then(data => {
                const list = document.getElementById('leaderboardList');
                list.innerHTML = data.map((entry, index) => `
                    <div class="leaderboard-entry">
                        <span>${index + 1}. ${entry.name}</span>
                        <span>${entry.score}</span>
                    </div>
                `).join('');
            });
    }
    
    // Sound system
    playSound(type) {
        if (!this.settings.soundEnabled) return;
        
        // Web Audio API implementation would go here
        // For now, we'll use a simple beep
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies = {
            start: 440,
            eat: 880,
            powerup: 1320,
            gameOver: 220
        };
        
        oscillator.frequency.value = frequencies[type] || 440;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        const icon = document.getElementById('soundToggle').querySelector('i');
        icon.className = this.settings.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    startBackgroundAnimation() {
        // Particle system for background would be implemented here
        // For now, we'll just add some basic animations
        this.animateParticles();
    }
    
    animateParticles() {
        // Simple particle animation
        const particles = document.getElementById('particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            particle.style.opacity = Math.random();
            particles.appendChild(particle);
            
            // Animate particle
            const animate = () => {
                const currentTop = parseInt(particle.style.top);
                if (currentTop > window.innerHeight) {
                    particle.style.top = '-10px';
                    particle.style.left = Math.random() * window.innerWidth + 'px';
                } else {
                    particle.style.top = (currentTop + 1) + 'px';
                }
                requestAnimationFrame(animate);
            };
            animate();
        }
    }
    
    // Multiplayer methods
    openMultiplayerModal() {
        this.openModal('multiplayerModal');
    }
    
    handleGameUpdate(data) {
        // Handle multiplayer game updates
        console.log('Game update received:', data);
    }
    
    updatePowerUpDisplay() {
        // Update power-up display in UI
        const display = document.getElementById('powerUpsDisplay');
        display.innerHTML = '<h4>Active Power-ups</h4>';
        // Add active power-ups here
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new AdvancedSnakeGame();
});

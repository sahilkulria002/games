// Advanced Smooth Snake Game with Mouse Control and Shooting
class SmoothSnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = {
            running: false,
            paused: false,
            score: 0,
            level: 1,
            targetsHit: 0,
            bulletsFired: 0,
            gameTime: 0
        };
        
        // Mouse position
        this.mouse = { x: 0, y: 0 };
        
        // Snake properties
        this.snake = {
            segments: [],
            head: { x: 400, y: 300 },
            direction: { x: 1, y: 0 },
            speed: 3,
            size: 8,
            maxLength: 15
        };
        
        // Game objects
        this.targets = [];
        this.bullets = [];
        this.particles = [];
        
        // Settings
        this.settings = {
            difficulty: 'medium',
            snakeSpeed: 5,
            targetCount: 8,
            bulletSpeed: 8,
            targetSpeed: 2
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.loadSettings();
        this.initializeSnake();
        this.generateTargets();
        this.updateUI();
        this.draw();
    }
    
    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mouseenter', () => this.showCrosshair());
        this.canvas.addEventListener('mouseleave', () => this.hideCrosshair());
        
        // Control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        
        // Settings
        document.getElementById('difficulty').addEventListener('change', (e) => this.updateDifficulty(e.target.value));
        document.getElementById('snakeSpeed').addEventListener('input', (e) => this.updateSnakeSpeed(e.target.value));
        document.getElementById('targetCount').addEventListener('input', (e) => this.updateTargetCount(e.target.value));
        
        // Modal buttons
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        
        // Update crosshair position
        const crosshair = document.getElementById('crosshair');
        crosshair.style.left = (e.clientX - rect.left) + 'px';
        crosshair.style.top = (e.clientY - rect.top) + 'px';
        
        // Update snake direction towards mouse
        if (this.gameState.running && !this.gameState.paused) {
            this.updateSnakeDirection();
        }
    }
    
    handleClick(e) {
        if (this.gameState.running && !this.gameState.paused) {
            this.shootBullet();
            this.createShootingEffect(e);
        }
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePause();
                break;
            case 'KeyR':
                e.preventDefault();
                this.restartGame();
                break;
            case 'Escape':
                e.preventDefault();
                if (this.gameState.running) {
                    this.togglePause();
                }
                break;
        }
    }
    
    showCrosshair() {
        document.getElementById('crosshair').style.display = 'block';
        document.body.classList.add('game-active');
    }
    
    hideCrosshair() {
        document.getElementById('crosshair').style.display = 'none';
        document.body.classList.remove('game-active');
    }
    
    initializeSnake() {
        this.snake.segments = [];
        this.snake.head = { x: this.centerX, y: this.centerY };
        
        // Create initial snake segments
        for (let i = 0; i < 5; i++) {
            this.snake.segments.push({
                x: this.centerX - (i * this.snake.size),
                y: this.centerY,
                size: this.snake.size - (i * 0.5)
            });
        }
    }
    
    generateTargets() {
        this.targets = [];
        const count = this.settings.targetCount;
        
        for (let i = 0; i < count; i++) {
            this.targets.push({
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: Math.random() * (this.canvas.height - 40) + 20,
                size: 8 + Math.random() * 4,
                speed: this.settings.targetSpeed + Math.random() * 2,
                direction: Math.random() * Math.PI * 2,
                color: this.getRandomTargetColor(),
                points: Math.floor(Math.random() * 5) + 1,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomTargetColor() {
        const colors = ['#ff0088', '#00ff88', '#0088ff', '#ff8800', '#8800ff', '#ffff00'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateSnakeDirection() {
        const dx = this.mouse.x - this.snake.head.x;
        const dy = this.mouse.y - this.snake.head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            this.snake.direction.x = dx / distance;
            this.snake.direction.y = dy / distance;
        }
    }
    
    shootBullet() {
        const bulletSpeed = this.settings.bulletSpeed;
        const angle = Math.atan2(
            this.mouse.y - this.snake.head.y,
            this.mouse.x - this.snake.head.x
        );
        
        this.bullets.push({
            x: this.snake.head.x,
            y: this.snake.head.y,
            vx: Math.cos(angle) * bulletSpeed,
            vy: Math.sin(angle) * bulletSpeed,
            size: 4,
            life: 1.0,
            trail: []
        });
        
        this.gameState.bulletsFired++;
        this.playShootSound();
    }
    
    createShootingEffect(e) {
        const effect = document.createElement('div');
        effect.className = 'shooting-effect';
        effect.style.left = (e.clientX - 10) + 'px';
        effect.style.top = (e.clientY - 10) + 'px';
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 300);
    }
    
    startGame() {
        this.gameState.running = true;
        this.gameState.paused = false;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.gameLoop();
        this.startGameTimer();
    }
    
    togglePause() {
        if (!this.gameState.running) return;
        
        this.gameState.paused = !this.gameState.paused;
        document.getElementById('pauseBtn').textContent = this.gameState.paused ? '▶️ Resume' : '⏸️ Pause';
        
        if (!this.gameState.paused) {
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameState = {
            running: false,
            paused: false,
            score: 0,
            level: 1,
            targetsHit: 0,
            bulletsFired: 0,
            gameTime: 0
        };
        
        this.bullets = [];
        this.particles = [];
        this.initializeSnake();
        this.generateTargets();
        this.updateUI();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '⏸️ Pause';
        
        this.closeModal();
        this.draw();
    }
    
    gameLoop() {
        if (!this.gameState.running || this.gameState.paused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update snake
        this.updateSnake();
        
        // Update targets
        this.updateTargets();
        
        // Update bullets
        this.updateBullets();
        
        // Update particles
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
        
        // Update game state
        this.updateGameState();
        
        // Update UI
        this.updateUI();
    }
    
    updateSnake() {
        // Move snake head
        this.snake.head.x += this.snake.direction.x * this.snake.speed;
        this.snake.head.y += this.snake.direction.y * this.snake.speed;
        
        // Keep snake within bounds
        this.snake.head.x = Math.max(this.snake.size, Math.min(this.canvas.width - this.snake.size, this.snake.head.x));
        this.snake.head.y = Math.max(this.snake.size, Math.min(this.canvas.height - this.snake.size, this.snake.head.y));
        
        // Update segments
        if (this.snake.segments.length > 0) {
            // Move first segment towards head
            const firstSegment = this.snake.segments[0];
            const dx = this.snake.head.x - firstSegment.x;
            const dy = this.snake.head.y - firstSegment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.snake.size * 1.5) {
                firstSegment.x += (dx / distance) * this.snake.speed * 0.8;
                firstSegment.y += (dy / distance) * this.snake.speed * 0.8;
            }
            
            // Move other segments
            for (let i = 1; i < this.snake.segments.length; i++) {
                const segment = this.snake.segments[i];
                const prevSegment = this.snake.segments[i - 1];
                const dx = prevSegment.x - segment.x;
                const dy = prevSegment.y - segment.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > this.snake.size * 1.2) {
                    segment.x += (dx / distance) * this.snake.speed * 0.7;
                    segment.y += (dy / distance) * this.snake.speed * 0.7;
                }
            }
        }
    }
    
    updateTargets() {
        this.targets.forEach(target => {
            // Move target
            target.x += Math.cos(target.direction) * target.speed;
            target.y += Math.sin(target.direction) * target.speed;
            
            // Bounce off walls
            if (target.x <= target.size || target.x >= this.canvas.width - target.size) {
                target.direction = Math.PI - target.direction;
            }
            if (target.y <= target.size || target.y >= this.canvas.height - target.size) {
                target.direction = -target.direction;
            }
            
            // Keep within bounds
            target.x = Math.max(target.size, Math.min(this.canvas.width - target.size, target.x));
            target.y = Math.max(target.size, Math.min(this.canvas.height - target.size, target.y));
            
            // Update pulse phase
            target.pulsePhase += 0.1;
            
            // Occasionally change direction
            if (Math.random() < 0.02) {
                target.direction += (Math.random() - 0.5) * 0.5;
            }
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            // Move bullet
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Add to trail
            bullet.trail.push({ x: bullet.x, y: bullet.y });
            if (bullet.trail.length > 5) {
                bullet.trail.shift();
            }
            
            // Decrease life
            bullet.life -= 0.01;
            
            // Remove if out of bounds or life expired
            return bullet.x >= 0 && bullet.x <= this.canvas.width &&
                   bullet.y >= 0 && bullet.y <= this.canvas.height &&
                   bullet.life > 0;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.size *= 0.98;
            
            return particle.life > 0 && particle.size > 0.5;
        });
    }
    
    checkCollisions() {
        // Check bullet-target collisions
        this.bullets.forEach((bullet, bulletIndex) => {
            this.targets.forEach((target, targetIndex) => {
                const dx = bullet.x - target.x;
                const dy = bullet.y - target.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < bullet.size + target.size) {
                    // Hit!
                    this.gameState.score += target.points * 10;
                    this.gameState.targetsHit++;
                    
                    // Create explosion effect
                    this.createExplosion(target.x, target.y, target.color);
                    
                    // Remove bullet and target
                    this.bullets.splice(bulletIndex, 1);
                    this.targets.splice(targetIndex, 1);
                    
                    // Generate new target
                    this.generateNewTarget();
                    
                    this.playHitSound();
                }
            });
        });
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 4 + 2,
                color: color,
                life: 1.0
            });
        }
    }
    
    generateNewTarget() {
        this.targets.push({
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: Math.random() * (this.canvas.height - 40) + 20,
            size: 8 + Math.random() * 4,
            speed: this.settings.targetSpeed + Math.random() * 2,
            direction: Math.random() * Math.PI * 2,
            color: this.getRandomTargetColor(),
            points: Math.floor(Math.random() * 5) + 1,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    
    updateGameState() {
        // Level progression
        const newLevel = Math.floor(this.gameState.score / 500) + 1;
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.settings.targetSpeed += 0.5;
            this.settings.targetCount = Math.min(15, this.settings.targetCount + 1);
            this.generateTargets();
        }
    }
    
    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.canvas.width
        );
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0.9)');
        gradient.addColorStop(1, 'rgba(26, 26, 46, 0.9)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.drawParticles();
        
        // Draw targets
        this.drawTargets();
        
        // Draw bullets
        this.drawBullets();
        
        // Draw snake
        this.drawSnake();
        
        // Draw pause overlay
        if (this.gameState.paused) {
            this.drawPauseOverlay();
        }
    }
    
    drawSnake() {
        // Draw snake segments
        this.snake.segments.forEach((segment, index) => {
            const opacity = 1 - (index * 0.1);
            const size = segment.size || (this.snake.size - index * 0.5);
            
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            
            // Body gradient
            const gradient = this.ctx.createRadialGradient(
                segment.x, segment.y, 0,
                segment.x, segment.y, size
            );
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#0088ff');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ff88';
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
        
        // Draw snake head
        this.ctx.save();
        
        // Head gradient
        const headGradient = this.ctx.createRadialGradient(
            this.snake.head.x, this.snake.head.y, 0,
            this.snake.head.x, this.snake.head.y, this.snake.size
        );
        headGradient.addColorStop(0, '#ff0088');
        headGradient.addColorStop(1, '#ff8800');
        
        this.ctx.fillStyle = headGradient;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff0088';
        this.ctx.beginPath();
        this.ctx.arc(this.snake.head.x, this.snake.head.y, this.snake.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw eyes
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowBlur = 0;
        const eyeOffset = this.snake.size * 0.3;
        const eyeSize = this.snake.size * 0.2;
        
        this.ctx.beginPath();
        this.ctx.arc(this.snake.head.x - eyeOffset, this.snake.head.y - eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(this.snake.head.x + eyeOffset, this.snake.head.y - eyeOffset, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawTargets() {
        this.targets.forEach(target => {
            this.ctx.save();
            
            // Pulsing effect
            const pulseSize = target.size + Math.sin(target.pulsePhase) * 2;
            
            // Target gradient
            const gradient = this.ctx.createRadialGradient(
                target.x, target.y, 0,
                target.x, target.y, pulseSize
            );
            gradient.addColorStop(0, target.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = target.color;
            
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw points value
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Orbitron';
            this.ctx.textAlign = 'center';
            this.ctx.shadowBlur = 0;
            this.ctx.fillText(target.points, target.x, target.y + 4);
            
            this.ctx.restore();
        });
    }
    
    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.save();
            this.ctx.globalAlpha = bullet.life;
            
            // Draw bullet trail
            if (bullet.trail.length > 1) {
                this.ctx.strokeStyle = '#ff0088';
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#ff0088';
                
                this.ctx.beginPath();
                this.ctx.moveTo(bullet.trail[0].x, bullet.trail[0].y);
                for (let i = 1; i < bullet.trail.length; i++) {
                    this.ctx.lineTo(bullet.trail[i].x, bullet.trail[i].y);
                }
                this.ctx.stroke();
            }
            
            // Draw bullet
            this.ctx.fillStyle = '#fff';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#ff0088';
            this.ctx.beginPath();
            this.ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = particle.color;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ff88';
        this.ctx.fillText('PAUSED', this.centerX, this.centerY);
    }
    
    // UI and settings methods
    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('targets').textContent = this.gameState.targetsHit;
        document.getElementById('level').textContent = this.gameState.level;
    }
    
    updateDifficulty(difficulty) {
        this.settings.difficulty = difficulty;
        switch(difficulty) {
            case 'easy':
                this.settings.targetSpeed = 1;
                this.settings.targetCount = 5;
                break;
            case 'medium':
                this.settings.targetSpeed = 2;
                this.settings.targetCount = 8;
                break;
            case 'hard':
                this.settings.targetSpeed = 3;
                this.settings.targetCount = 12;
                break;
            case 'insane':
                this.settings.targetSpeed = 4;
                this.settings.targetCount = 15;
                break;
        }
        this.generateTargets();
    }
    
    updateSnakeSpeed(speed) {
        this.settings.snakeSpeed = parseInt(speed);
        this.snake.speed = this.settings.snakeSpeed * 0.8;
        document.getElementById('speedValue').textContent = speed;
    }
    
    updateTargetCount(count) {
        this.settings.targetCount = parseInt(count);
        document.getElementById('targetCountValue').textContent = count;
        this.generateTargets();
    }
    
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameState.running && !this.gameState.paused) {
                this.gameState.gameTime++;
            }
        }, 1000);
    }
    
    closeModal() {
        document.getElementById('gameOverModal').style.display = 'none';
    }
    
    gameOver() {
        this.gameState.running = false;
        
        // Calculate accuracy
        const accuracy = this.gameState.bulletsFired > 0 ? 
            Math.round((this.gameState.targetsHit / this.gameState.bulletsFired) * 100) : 0;
        
        // Update modal
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('finalTargets').textContent = this.gameState.targetsHit;
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('finalLevel').textContent = this.gameState.level;
        
        // Show modal
        document.getElementById('gameOverModal').style.display = 'block';
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
    
    // Sound effects
    playShootSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    playHitSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    loadSettings() {
        // Load settings from localStorage if available
        const saved = localStorage.getItem('smoothSnakeSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('smoothSnakeSettings', JSON.stringify(this.settings));
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.smoothSnakeGame = new SmoothSnakeGame();
});

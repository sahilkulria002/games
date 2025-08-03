// Smooth Snake Game with Mouse Control and Shooting

class SmoothSnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cursor = 'crosshair';
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.health = 100;
        this.targetsHit = 0;
        
        // Mouse position
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        
        // Snake properties
        this.snake = [];
        this.snakeLength = 8;
        this.snakeSpeed = 2;
        this.snakeRadius = 8;
        
        // Initialize snake at center
        for (let i = 0; i < this.snakeLength; i++) {
            this.snake.push({
                x: this.canvas.width / 2 - i * 15,
                y: this.canvas.height / 2,
                angle: 0
            });
        }
        
        // Targets
        this.targets = [];
        this.maxTargets = 5;
        this.targetSpeed = 1;
        
        // Bullets
        this.bullets = [];
        this.bulletSpeed = 8;
        this.bulletRadius = 3;
        this.bulletCooldown = 0;
        
        // Visual effects
        this.particles = [];
        this.explosions = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.spawnTargets();
        this.draw();
    }
    
    bindEvents() {
        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        // Mouse click to shoot
        this.canvas.addEventListener('click', (e) => {
            if (this.gameRunning && !this.gamePaused) {
                this.shoot();
            }
        });
        
        // Game controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.restartGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameRunning && !this.gamePaused) {
                    this.shoot();
                }
            }
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';
        this.gameLoop();
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gamePaused ? 'Resume' : 'Pause';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.health = 100;
        this.targetsHit = 0;
        this.bullets = [];
        this.particles = [];
        this.explosions = [];
        
        // Reset snake
        this.snake = [];
        for (let i = 0; i < this.snakeLength; i++) {
            this.snake.push({
                x: this.canvas.width / 2 - i * 15,
                y: this.canvas.height / 2,
                angle: 0
            });
        }
        
        this.spawnTargets();
        this.updateUI();
        this.closeModal();
        
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        this.draw();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.updateSnake();
        this.updateTargets();
        this.updateBullets();
        this.updateParticles();
        this.updateExplosions();
        this.checkCollisions();
        this.updateUI();
        
        if (this.bulletCooldown > 0) {
            this.bulletCooldown--;
        }
        
        // Check game over conditions
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    updateSnake() {
        // Calculate angle to mouse
        const head = this.snake[0];
        const dx = this.mouseX - head.x;
        const dy = this.mouseY - head.y;
        const targetAngle = Math.atan2(dy, dx);
        
        // Smooth angle transition
        let angleDiff = targetAngle - head.angle;
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        head.angle += angleDiff * 0.1;
        
        // Move head towards mouse
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 20) {
            head.x += Math.cos(head.angle) * this.snakeSpeed;
            head.y += Math.sin(head.angle) * this.snakeSpeed;
        }
        
        // Keep head within bounds
        head.x = Math.max(this.snakeRadius, Math.min(this.canvas.width - this.snakeRadius, head.x));
        head.y = Math.max(this.snakeRadius, Math.min(this.canvas.height - this.snakeRadius, head.y));
        
        // Update body segments
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            const target = this.snake[i - 1];
            
            const dx = target.x - segment.x;
            const dy = target.y - segment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 15) {
                const moveX = (dx / distance) * this.snakeSpeed;
                const moveY = (dy / distance) * this.snakeSpeed;
                segment.x += moveX;
                segment.y += moveY;
            }
            
            segment.angle = Math.atan2(dy, dx);
        }
    }
    
    updateTargets() {
        // Spawn new targets if needed
        while (this.targets.length < this.maxTargets) {
            this.spawnTarget();
        }
        
        // Update existing targets
        this.targets.forEach(target => {
            // Move towards snake head
            const head = this.snake[0];
            const dx = head.x - target.x;
            const dy = head.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                target.x += (dx / distance) * this.targetSpeed;
                target.y += (dy / distance) * this.targetSpeed;
            }
            
            // Rotate target
            target.rotation += 0.05;
            
            // Pulsate effect
            target.pulsePhase += 0.1;
            target.currentRadius = target.radius + Math.sin(target.pulsePhase) * 2;
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            // Remove bullets that are off-screen or expired
            return bullet.x > 0 && bullet.x < this.canvas.width &&
                   bullet.y > 0 && bullet.y < this.canvas.height &&
                   bullet.life > 0;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            
            return particle.life > 0;
        });
    }
    
    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            explosion.radius += explosion.expandSpeed;
            explosion.life--;
            explosion.alpha = explosion.life / explosion.maxLife;
            
            return explosion.life > 0;
        });
    }
    
    checkCollisions() {
        const head = this.snake[0];
        
        // Check target collisions with snake
        this.targets = this.targets.filter(target => {
            const dx = head.x - target.x;
            const dy = head.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.snakeRadius + target.currentRadius) {
                this.health -= 10;
                this.createExplosion(target.x, target.y, 'damage');
                return false;
            }
            return true;
        });
        
        // Check bullet collisions with targets
        this.bullets.forEach(bullet => {
            this.targets = this.targets.filter(target => {
                const dx = bullet.x - target.x;
                const dy = bullet.y - target.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.bulletRadius + target.currentRadius) {
                    this.score += target.points;
                    this.targetsHit++;
                    this.createExplosion(target.x, target.y, 'hit');
                    this.createParticles(target.x, target.y, target.color);
                    
                    // Remove bullet
                    bullet.life = 0;
                    return false;
                }
                return true;
            });
        });
    }
    
    shoot() {
        if (this.bulletCooldown > 0) return;
        
        const head = this.snake[0];
        const bullet = {
            x: head.x,
            y: head.y,
            vx: Math.cos(head.angle) * this.bulletSpeed,
            vy: Math.sin(head.angle) * this.bulletSpeed,
            life: 100,
            trail: []
        };
        
        this.bullets.push(bullet);
        this.bulletCooldown = 10;
        
        // Create muzzle flash
        this.createParticles(head.x, head.y, '#ffff00', 3);
    }
    
    spawnTargets() {
        this.targets = [];
        for (let i = 0; i < this.maxTargets; i++) {
            this.spawnTarget();
        }
    }
    
    spawnTarget() {
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ff44ff', '#ffff44'];
        const points = [10, 15, 20, 25, 30];
        const radii = [12, 15, 18, 20, 25];
        
        const typeIndex = Math.floor(Math.random() * colors.length);
        
        // Spawn from edges
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // Top
                x = Math.random() * this.canvas.width;
                y = -30;
                break;
            case 1: // Right
                x = this.canvas.width + 30;
                y = Math.random() * this.canvas.height;
                break;
            case 2: // Bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 30;
                break;
            case 3: // Left
                x = -30;
                y = Math.random() * this.canvas.height;
                break;
        }
        
        this.targets.push({
            x: x,
            y: y,
            radius: radii[typeIndex],
            currentRadius: radii[typeIndex],
            color: colors[typeIndex],
            points: points[typeIndex],
            rotation: 0,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    
    createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 2;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1,
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    createExplosion(x, y, type) {
        const colors = type === 'hit' ? ['#ffff00', '#ff8800'] : ['#ff4444', '#880000'];
        
        this.explosions.push({
            x: x,
            y: y,
            radius: 5,
            expandSpeed: 3,
            colors: colors,
            life: 20,
            maxLife: 20,
            alpha: 1
        });
    }
    
    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, '#001122');
        gradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.drawStars();
        
        // Draw explosions
        this.explosions.forEach(explosion => {
            this.drawExplosion(explosion);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
        
        // Draw targets
        this.targets.forEach(target => {
            this.drawTarget(target);
        });
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.drawBullet(bullet);
        });
        
        // Draw snake
        this.drawSnake();
        
        // Draw crosshair
        this.drawCrosshair();
        
        // Draw UI elements
        if (this.gamePaused) {
            this.drawPauseOverlay();
        }
    }
    
    drawStars() {
        // Static stars for background
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 100; i++) {
            const x = (i * 123) % this.canvas.width;
            const y = (i * 456) % this.canvas.height;
            const size = Math.sin(i) * 0.5 + 0.5;
            this.ctx.globalAlpha = size;
            this.ctx.fillRect(x, y, 1, 1);
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawSnake() {
        // Draw snake body
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        for (let i = this.snake.length - 1; i >= 0; i--) {
            const segment = this.snake[i];
            const alpha = (i + 1) / this.snake.length;
            
            if (i === 0) {
                // Draw head
                this.ctx.save();
                this.ctx.translate(segment.x, segment.y);
                this.ctx.rotate(segment.angle);
                
                // Head body
                this.ctx.fillStyle = '#00ff88';
                this.ctx.shadowColor = '#00ff88';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.snakeRadius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Eyes
                this.ctx.fillStyle = '#ffffff';
                this.ctx.shadowBlur = 0;
                this.ctx.beginPath();
                this.ctx.arc(-3, -3, 2, 0, Math.PI * 2);
                this.ctx.arc(-3, 3, 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            } else {
                // Draw body segment
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = `hsl(${120 + i * 10}, 100%, 50%)`;
                this.ctx.shadowColor = this.ctx.fillStyle;
                this.ctx.shadowBlur = 5;
                this.ctx.beginPath();
                this.ctx.arc(segment.x, segment.y, this.snakeRadius - i * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur = 0;
    }
    
    drawTarget(target) {
        this.ctx.save();
        this.ctx.translate(target.x, target.y);
        this.ctx.rotate(target.rotation);
        
        // Outer glow
        this.ctx.shadowColor = target.color;
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = target.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner core
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius / 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rotating lines
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i) / 4;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(angle) * target.currentRadius / 2, Math.sin(angle) * target.currentRadius / 2);
            this.ctx.lineTo(Math.cos(angle) * target.currentRadius, Math.sin(angle) * target.currentRadius);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawBullet(bullet) {
        // Trail effect
        bullet.trail.push({ x: bullet.x, y: bullet.y });
        if (bullet.trail.length > 5) {
            bullet.trail.shift();
        }
        
        // Draw trail
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        bullet.trail.forEach((point, index) => {
            this.ctx.globalAlpha = (index + 1) / bullet.trail.length;
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        this.ctx.stroke();
        
        // Draw bullet
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, this.bulletRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    drawParticle(particle) {
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    drawExplosion(explosion) {
        this.ctx.globalAlpha = explosion.alpha;
        
        explosion.colors.forEach((color, index) => {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.radius + index * 5, 0, Math.PI * 2);
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    drawCrosshair() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.7;
        
        // Cross lines
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX - 15, this.mouseY);
        this.ctx.lineTo(this.mouseX + 15, this.mouseY);
        this.ctx.moveTo(this.mouseX, this.mouseY - 15);
        this.ctx.lineTo(this.mouseX, this.mouseY + 15);
        this.ctx.stroke();
        
        // Circle
        this.ctx.beginPath();
        this.ctx.arc(this.mouseX, this.mouseY, 20, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.globalAlpha = 1;
    }
    
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('targets').textContent = this.targets.length;
        document.getElementById('health').textContent = this.health;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('targetsHit').textContent = this.targetsHit;
        this.openModal();
    }
    
    openModal() {
        document.getElementById('gameOverModal').classList.remove('hidden');
    }
    
    closeModal() {
        document.getElementById('gameOverModal').classList.add('hidden');
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.smoothGame = new SmoothSnakeGame();
});

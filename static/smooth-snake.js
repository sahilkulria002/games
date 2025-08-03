// Enhanced Smooth Snake Game with Advanced Features

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
        this.combo = 0;
        this.comboTimer = 0;
        
        // Mouse position
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        
        // Snake properties
        this.snake = [];
        this.snakeLength = 8;
        this.snakeSpeed = 2;
        this.snakeRadius = 8;
        this.snakeBehavior = 'follow'; // follow, orbit, chase
        this.orbitAngle = 0;
        this.orbitRadius = 50;
        
        // Initialize snake at center
        this.resetSnake();
        
        // Game settings
        this.targetSpeed = 1.0;
        this.powerUpsEnabled = true;
        
        // Targets
        this.targets = [];
        this.maxTargets = 5;
        this.stunnedTargets = [];
        
        // Bullets
        this.bullets = [];
        this.bulletSpeed = 8;
        this.bulletRadius = 3;
        this.bulletCooldown = 0;
        
        // Power-ups
        this.powerUps = [];
        this.activePowerUps = [];
        
        // Mouse interaction effects
        this.mouseBoostTimer = 0;
        this.mouseBoostActive = false;
        this.specialAbilityTimer = 0;
        this.specialAbilityActive = false;
        this.magneticField = false;
        this.magneticFieldTimer = 0;
        this.timeSlowActive = false;
        this.timeSlowTimer = 0;
        
        // Visual effects
        this.particles = [];
        this.explosions = [];
        this.floatingTexts = [];
        this.mouseEffects = [];
        this.energyRings = [];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.bindSettings();
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
    
    bindSettings() {
        // Target speed slider
        const speedSlider = document.getElementById('targetSpeedSlider');
        const speedValue = document.getElementById('targetSpeedValue');
        
        speedSlider.addEventListener('input', (e) => {
            this.targetSpeed = parseFloat(e.target.value);
            speedValue.textContent = this.targetSpeed.toFixed(1);
        });
        
        // Snake behavior
        document.getElementById('snakeBehavior').addEventListener('change', (e) => {
            this.snakeBehavior = e.target.value;
        });
        
        // Power-ups toggle
        document.getElementById('powerUpsEnabled').addEventListener('change', (e) => {
            this.powerUpsEnabled = e.target.checked;
        });
    }
    
    resetSnake() {
        this.snake = [];
        for (let i = 0; i < this.snakeLength; i++) {
            this.snake.push({
                x: this.canvas.width / 2 - i * 15,
                y: this.canvas.height / 2,
                angle: 0
            });
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        
        // Hide settings panel
        document.getElementById('settingsPanel').style.display = 'none';
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
        this.combo = 0;
        this.comboTimer = 0;
        this.snakeLength = 8;
        this.bullets = [];
        this.particles = [];
        this.explosions = [];
        this.floatingTexts = [];
        this.stunnedTargets = [];
        this.powerUps = [];
        this.activePowerUps = [];
        
        this.resetSnake();
        this.spawnTargets();
        this.updateUI();
        this.closeModal();
        
        // Show settings panel
        document.getElementById('settingsPanel').style.display = 'block';
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
        this.updateStunnedTargets();
        this.updateBullets();
        this.updatePowerUps();
        this.updateActivePowerUps();
        this.updateParticles();
        this.updateExplosions();
        this.updateFloatingTexts();
        this.updateCombo();
        this.updateMouseInteraction();
        this.updateSpecialAbilities();
        this.checkCollisions();
        this.updateUI();
        
        if (this.bulletCooldown > 0) {
            this.bulletCooldown--;
        }
        
        // Spawn power-ups occasionally
        if (this.powerUpsEnabled && Math.random() < 0.003) {
            this.spawnPowerUp();
        }
        
        // Check game over conditions
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    updateSnake() {
        const head = this.snake[0];
        const dx = this.mouseX - head.x;
        const dy = this.mouseY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetAngle = Math.atan2(dy, dx);
        let moveX = 0, moveY = 0;
        
        switch (this.snakeBehavior) {
            case 'follow':
                // Smooth approach with deceleration
                if (distance > 25) {
                    const speed = Math.min(this.snakeSpeed, distance * 0.1);
                    moveX = Math.cos(targetAngle) * speed;
                    moveY = Math.sin(targetAngle) * speed;
                } else if (distance > 15) {
                    // Gentle hover when very close
                    const hoverSpeed = this.snakeSpeed * 0.3;
                    moveX = Math.cos(targetAngle) * hoverSpeed;
                    moveY = Math.sin(targetAngle) * hoverSpeed;
                }
                break;
                
            case 'orbit':
                // Enhanced orbit behavior
                if (distance < this.orbitRadius + 30) {
                    this.orbitAngle += 0.08;
                    const orbitX = this.mouseX + Math.cos(this.orbitAngle) * this.orbitRadius;
                    const orbitY = this.mouseY + Math.sin(this.orbitAngle) * this.orbitRadius;
                    targetAngle = Math.atan2(orbitY - head.y, orbitX - head.x);
                    moveX = Math.cos(targetAngle) * this.snakeSpeed;
                    moveY = Math.sin(targetAngle) * this.snakeSpeed;
                    
                    // Create orbit trail particles
                    if (Math.random() < 0.3) {
                        this.createParticles(head.x, head.y, '#00ffff', 2);
                    }
                } else {
                    moveX = Math.cos(targetAngle) * this.snakeSpeed;
                    moveY = Math.sin(targetAngle) * this.snakeSpeed;
                }
                break;
                
            case 'chase':
                // Enhanced chase with figure-8 pattern
                if (distance > 60) {
                    moveX = Math.cos(targetAngle) * this.snakeSpeed;
                    moveY = Math.sin(targetAngle) * this.snakeSpeed;
                } else {
                    // Figure-8 pattern around mouse
                    const time = Date.now() * 0.005;
                    const figure8X = this.mouseX + Math.sin(time) * 40;
                    const figure8Y = this.mouseY + Math.sin(time * 2) * 20;
                    const figure8Angle = Math.atan2(figure8Y - head.y, figure8X - head.x);
                    moveX = Math.cos(figure8Angle) * this.snakeSpeed * 0.9;
                    moveY = Math.sin(figure8Angle) * this.snakeSpeed * 0.9;
                    
                    // Create chase trail
                    if (Math.random() < 0.2) {
                        this.createParticles(head.x, head.y, '#ff8800', 1);
                    }
                }
                break;
        }
        
        // Smooth angle transition with momentum
        let angleDiff = targetAngle - head.angle;
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        head.angle += angleDiff * 0.15;
        
        // Move head with momentum
        head.x += moveX;
        head.y += moveY;
        
        // Keep head within bounds with bounce effect
        if (head.x < this.snakeRadius) {
            head.x = this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        if (head.x > this.canvas.width - this.snakeRadius) {
            head.x = this.canvas.width - this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        if (head.y < this.snakeRadius) {
            head.y = this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        if (head.y > this.canvas.height - this.snakeRadius) {
            head.y = this.canvas.height - this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        
        // Update body segments with improved physics
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            const target = this.snake[i - 1];
            
            const dx = target.x - segment.x;
            const dy = target.y - segment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const segmentGap = 12 + (i * 0.5); // Slightly varying gaps
            
            if (distance > segmentGap) {
                const moveX = (dx / distance) * this.snakeSpeed * 0.9;
                const moveY = (dy / distance) * this.snakeSpeed * 0.9;
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
    
    updateStunnedTargets() {
        this.stunnedTargets = this.stunnedTargets.filter(target => {
            target.stunTimer--;
            
            // Pulsing effect for stunned targets
            target.pulsePhase += 0.2;
            target.currentRadius = target.radius + Math.sin(target.pulsePhase) * 5;
            
            return target.stunTimer > 0;
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            return bullet.x > 0 && bullet.x < this.canvas.width &&
                   bullet.y > 0 && bullet.y < this.canvas.height &&
                   bullet.life > 0;
        });
    }
    
    updatePowerUps() {
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.rotation += 0.1;
            powerUp.pulsePhase += 0.1;
            powerUp.currentRadius = powerUp.radius + Math.sin(powerUp.pulsePhase) * 3;
            powerUp.life--;
            
            return powerUp.life > 0;
        });
    }
    
    updateActivePowerUps() {
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            powerUp.duration--;
            return powerUp.duration > 0;
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
    
    updateFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter(text => {
            text.y -= 2;
            text.life--;
            text.alpha = text.life / text.maxLife;
            
            return text.life > 0;
        });
    }
    
    updateCombo() {
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) {
                this.combo = 0;
                document.getElementById('comboDisplay').classList.remove('active');
            }
        }
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
                this.resetCombo();
                return false;
            }
            return true;
        });
        
        // Check stunned target collisions with snake (eating)
        this.stunnedTargets = this.stunnedTargets.filter(target => {
            const dx = head.x - target.x;
            const dy = head.y - target.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.snakeRadius + target.currentRadius) {
                this.eatStunnedTarget(target);
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
                    this.hitTarget(target);
                    bullet.life = 0;
                    return false;
                }
                return true;
            });
        });
        
        // Check power-up collisions with snake
        this.powerUps = this.powerUps.filter(powerUp => {
            const dx = head.x - powerUp.x;
            const dy = head.y - powerUp.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.snakeRadius + powerUp.currentRadius) {
                this.collectPowerUp(powerUp);
                return false;
            }
            return true;
        });
    }
    
    hitTarget(target) {
        // Stun the target for 5 seconds
        target.stunTimer = 300; // 5 seconds at 60fps
        target.stunned = true;
        this.stunnedTargets.push(target);
        
        this.increaseCombo();
        this.createExplosion(target.x, target.y, 'hit');
        this.createParticles(target.x, target.y, target.color);
        
        // Small score for hitting
        const hitScore = 5 * this.combo;
        this.score += hitScore;
        this.createFloatingText(target.x, target.y, `+${hitScore}`, '#ffff00');
    }
    
    eatStunnedTarget(target) {
        // Big score for eating
        const eatScore = target.points * this.combo;
        this.score += eatScore;
        this.targetsHit++;
        
        // Grow snake
        this.growSnake();
        
        this.increaseCombo();
        this.createExplosion(target.x, target.y, 'eat');
        this.createParticles(target.x, target.y, '#00ff88');
        this.createFloatingText(target.x, target.y, `+${eatScore}`, '#00ff88');
    }
    
    growSnake() {
        const tail = this.snake[this.snake.length - 1];
        this.snake.push({
            x: tail.x - 15,
            y: tail.y,
            angle: tail.angle
        });
        this.snakeLength++;
    }
    
    increaseCombo() {
        this.combo++;
        this.comboTimer = 180; // 3 seconds
        document.getElementById('comboDisplay').classList.add('active');
        document.getElementById('comboMultiplier').textContent = this.combo;
    }
    
    resetCombo() {
        this.combo = 0;
        this.comboTimer = 0;
        document.getElementById('comboDisplay').classList.remove('active');
    }
    
    createFloatingText(x, y, text, color, size = 16) {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            size: size,
            life: 60,
            maxLife: 60,
            alpha: 1
        });
    }
    
    shoot() {
        if (this.bulletCooldown > 0) return;
        
        const head = this.snake[0];
        const baseAngle = head.angle;
        
        // Enhanced shooting during mouse boost
        if (this.mouseBoostActive) {
            // Triple shot during boost
            const angles = [baseAngle - 0.3, baseAngle, baseAngle + 0.3];
            angles.forEach(angle => {
                const bullet = {
                    x: head.x,
                    y: head.y,
                    vx: Math.cos(angle) * this.bulletSpeed * 1.5,
                    vy: Math.sin(angle) * this.bulletSpeed * 1.5,
                    life: 120,
                    trail: [],
                    boosted: true
                };
                this.bullets.push(bullet);
            });
            this.bulletCooldown = 8;
        } else {
            // Normal single shot
            const bullet = {
                x: head.x,
                y: head.y,
                vx: Math.cos(baseAngle) * this.bulletSpeed,
                vy: Math.sin(baseAngle) * this.bulletSpeed,
                life: 100,
                trail: [],
                boosted: false
            };
            this.bullets.push(bullet);
            this.bulletCooldown = 15;
        }
        
        this.createParticles(head.x, head.y, '#ffff00', 3);
    }
    
    spawnTarget() {
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ff44ff', '#ffff44'];
        const points = [20, 25, 30, 35, 40];
        const radii = [15, 18, 20, 22, 25];
        
        const typeIndex = Math.floor(Math.random() * colors.length);
        
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: x = Math.random() * this.canvas.width; y = -30; break;
            case 1: x = this.canvas.width + 30; y = Math.random() * this.canvas.height; break;
            case 2: x = Math.random() * this.canvas.width; y = this.canvas.height + 30; break;
            case 3: x = -30; y = Math.random() * this.canvas.height; break;
        }
        
        this.targets.push({
            x: x, y: y,
            radius: radii[typeIndex],
            currentRadius: radii[typeIndex],
            color: colors[typeIndex],
            points: points[typeIndex],
            rotation: 0,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    
    spawnTargets() {
        this.targets = [];
        for (let i = 0; i < this.maxTargets; i++) {
            this.spawnTarget();
        }
    }
    
    spawnPowerUp() {
        const types = ['speed', 'shield', 'multishot', 'growth'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 100) + 50,
            type: type,
            radius: 12,
            currentRadius: 12,
            rotation: 0,
            pulsePhase: 0,
            life: 600 // 10 seconds
        });
    }
    
    collectPowerUp(powerUp) {
        this.activePowerUps.push({
            type: powerUp.type,
            duration: 300 // 5 seconds
        });
        
        this.showPowerUpNotification(powerUp.type);
        this.createExplosion(powerUp.x, powerUp.y, 'powerup');
    }
    
    showPowerUpNotification(type) {
        const notification = document.getElementById('powerUpNotification');
        notification.textContent = `${type.toUpperCase()} Activated!`;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 2000);
    }
    
    createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 2;
            
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 30, maxLife: 30,
                alpha: 1,
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    createExplosion(x, y, type) {
        const colors = {
            hit: ['#ffff00', '#ff8800'],
            damage: ['#ff4444', '#880000'],
            eat: ['#00ff88', '#0088ff'],
            powerup: ['#ff44ff', '#8800ff']
        };
        
        this.explosions.push({
            x: x, y: y,
            radius: 5,
            expandSpeed: 3,
            colors: colors[type] || colors.hit,
            life: 20, maxLife: 20,
            alpha: 1
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.drawSnake();
        
        // Draw targets
        this.targets.forEach(target => {
            this.drawTarget(target);
        });
        
        // Draw stunned targets
        this.stunnedTargets.forEach(target => {
            this.drawStunnedTarget(target);
        });
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.drawBullet(bullet);
        });
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => {
            this.drawPowerUp(powerUp);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
        
        // Draw explosions
        this.explosions.forEach(explosion => {
            this.drawExplosion(explosion);
        });
        
        // Draw floating texts
        this.floatingTexts.forEach(text => {
            this.drawFloatingText(text);
        });
        
        // Draw energy rings
        this.energyRings.forEach(ring => {
            this.drawEnergyRing(ring);
        });
        
        // Draw mouse effects
        this.mouseEffects.forEach(effect => {
            this.drawMouseEffect(effect);
        });
        
        // Draw UI elements
        this.drawUI();
    }
    
    drawSnake() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.strokeStyle = '#005500';
        this.ctx.lineWidth = 2;
        
        this.snake.forEach(segment => {
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, this.snakeRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }
    
    drawTarget(target) {
        this.ctx.save();
        this.ctx.translate(target.x, target.y);
        this.ctx.rotate(target.rotation);
        
        this.ctx.fillStyle = target.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawStunnedTarget(target) {
        this.ctx.save();
        this.ctx.translate(target.x, target.y);
        this.ctx.rotate(target.rotation);
        
        // Stunned glow effect
        this.ctx.shadowColor = '#ff8800';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#ff8800';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Stunned indicator
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawBullet(bullet) {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, this.bulletRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPowerUp(powerUp) {
        this.ctx.save();
        this.ctx.translate(powerUp.x, powerUp.y);
        this.ctx.rotate(powerUp.rotation);
        
        // Power-up glow
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, powerUp.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Power-up symbol
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('★', 0, 5);
        
        this.ctx.restore();
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
        const colors = explosion.colors;
        const gradient = this.ctx.createRadialGradient(explosion.x, explosion.y, 0, explosion.x, explosion.y, explosion.radius);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawFloatingText(text) {
        this.ctx.globalAlpha = text.alpha;
        this.ctx.fillStyle = text.color;
        this.ctx.font = `${text.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = text.color;
        this.ctx.shadowBlur = 5;
        this.ctx.fillText(text.text, text.x, text.y);
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    
    drawSpecialEffects() {
        const head = this.snake[0];
        
        // Magnetic field visualization
        if (this.magneticField) {
            this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(head.x, head.y, 150, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Shield effect
        if (this.shieldActive) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(head.x, head.y, 25, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Time slow effect
        if (this.timeSlowActive) {
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Mouse boost indicator
        if (this.mouseBoostActive) {
            const pulseSize = Math.sin(Date.now() * 0.02) * 5 + 20;
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, pulseSize, 0, Math.PI * 2);
            this.ctx.stroke();
        }
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
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        
        // Hide settings panel
        document.getElementById('settingsPanel').style.display = 'none';
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
        
        // Show settings panel
        document.getElementById('settingsPanel').style.display = 'block';
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        this.draw();
    }
    
    resetSnake() {
        this.snake = [];
        for (let i = 0; i < this.snakeLength; i++) {
            this.snake.push({
                x: this.canvas.width / 2 - i * 15,
                y: this.canvas.height / 2,
                angle: 0
            });
        }
    }
    
    updateSnake() {
        const head = this.snake[0];
        const dx = this.mouseX - head.x;
        const dy = this.mouseY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetAngle = Math.atan2(dy, dx);
        let moveX = 0, moveY = 0;
        
        switch (this.snakeBehavior) {
            case 'follow':
                // Smooth approach with deceleration
                if (distance > 25) {
                    const speed = Math.min(this.snakeSpeed, distance * 0.1);
                    moveX = Math.cos(targetAngle) * speed;
                    moveY = Math.sin(targetAngle) * speed;
                } else if (distance > 15) {
                    // Gentle hover when very close
                    const hoverSpeed = this.snakeSpeed * 0.3;
                    moveX = Math.cos(targetAngle) * hoverSpeed;
                    moveY = Math.sin(targetAngle) * hoverSpeed;
                }
                break;
                
            case 'orbit':
                // Enhanced orbit behavior
                if (distance < this.orbitRadius + 30) {
                    this.orbitAngle += 0.08;
                    const orbitX = this.mouseX + Math.cos(this.orbitAngle) * this.orbitRadius;
                    const orbitY = this.mouseY + Math.sin(this.orbitAngle) * this.orbitRadius;
                    targetAngle = Math.atan2(orbitY - head.y, orbitX - head.x);
                    moveX = Math.cos(targetAngle) * this.snakeSpeed;
                    moveY = Math.sin(targetAngle) * this.snakeSpeed;
                    
                    // Create orbit trail particles
                    if (Math.random() < 0.3) {
                        this.createParticles(head.x, head.y, '#00ffff', 2);
                    }
                } else {
                    moveX = Math.cos(targetAngle) * this.snakeSpeed;
                    moveY = Math.sin(targetAngle) * this.snakeSpeed;
                }
                break;
                
            case 'chase':
                // Enhanced chase with figure-8 pattern
                if (distance > 60) {
                    moveX = Math.cos(targetAngle) * this.snakeSpeed;
                    moveY = Math.sin(targetAngle) * this.snakeSpeed;
                } else {
                    // Figure-8 pattern around mouse
                    const time = Date.now() * 0.005;
                    const figure8X = this.mouseX + Math.sin(time) * 40;
                    const figure8Y = this.mouseY + Math.sin(time * 2) * 20;
                    const figure8Angle = Math.atan2(figure8Y - head.y, figure8X - head.x);
                    moveX = Math.cos(figure8Angle) * this.snakeSpeed * 0.9;
                    moveY = Math.sin(figure8Angle) * this.snakeSpeed * 0.9;
                    
                    // Create chase trail
                    if (Math.random() < 0.2) {
                        this.createParticles(head.x, head.y, '#ff8800', 1);
                    }
                }
                break;
        }
        
        // Smooth angle transition with momentum
        let angleDiff = targetAngle - head.angle;
        if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        head.angle += angleDiff * 0.15;
        
        // Move head with momentum
        head.x += moveX;
        head.y += moveY;
        
        // Keep head within bounds with bounce effect
        if (head.x < this.snakeRadius) {
            head.x = this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        if (head.x > this.canvas.width - this.snakeRadius) {
            head.x = this.canvas.width - this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        if (head.y < this.snakeRadius) {
            head.y = this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        if (head.y > this.canvas.height - this.snakeRadius) {
            head.y = this.canvas.height - this.snakeRadius;
            this.createParticles(head.x, head.y, '#ffffff', 3);
        }
        
        // Update body segments with improved physics
        for (let i = 1; i < this.snake.length; i++) {
            const segment = this.snake[i];
            const target = this.snake[i - 1];
            
            const dx = target.x - segment.x;
            const dy = target.y - segment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const segmentGap = 12 + (i * 0.5); // Slightly varying gaps
            
            if (distance > segmentGap) {
                const moveX = (dx / distance) * this.snakeSpeed * 0.9;
                const moveY = (dy / distance) * this.snakeSpeed * 0.9;
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
    
    updateStunnedTargets() {
        this.stunnedTargets = this.stunnedTargets.filter(target => {
            target.stunTimer--;
            
            // Pulsing effect for stunned targets
            target.pulsePhase += 0.2;
            target.currentRadius = target.radius + Math.sin(target.pulsePhase) * 5;
            
            return target.stunTimer > 0;
        });
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;
            
            return bullet.x > 0 && bullet.x < this.canvas.width &&
                   bullet.y > 0 && bullet.y < this.canvas.height &&
                   bullet.life > 0;
        });
    }
    
    updatePowerUps() {
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.rotation += 0.1;
            powerUp.pulsePhase += 0.1;
            powerUp.currentRadius = powerUp.radius + Math.sin(powerUp.pulsePhase) * 3;
            powerUp.life--;
            
            return powerUp.life > 0;
        });
    }
    
    updateActivePowerUps() {
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            powerUp.duration--;
            return powerUp.duration > 0;
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
    
    updateFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter(text => {
            text.y -= 2;
            text.life--;
            text.alpha = text.life / text.maxLife;
            
            return text.life > 0;
        });
    }
    
    updateCombo() {
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) {
                this.combo = 0;
                document.getElementById('comboDisplay').classList.remove('active');
            }
        }
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
                this.resetCombo();
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
        const baseAngle = head.angle;
        
        // Enhanced shooting during mouse boost
        if (this.mouseBoostActive) {
            // Triple shot during boost
            const angles = [baseAngle - 0.3, baseAngle, baseAngle + 0.3];
            angles.forEach(angle => {
                const bullet = {
                    x: head.x,
                    y: head.y,
                    vx: Math.cos(angle) * this.bulletSpeed * 1.5,
                    vy: Math.sin(angle) * this.bulletSpeed * 1.5,
                    life: 120,
                    trail: [],
                    boosted: true
                };
                this.bullets.push(bullet);
            });
            this.bulletCooldown = 8;
        } else {
            // Normal single shot
            const bullet = {
                x: head.x,
                y: head.y,
                vx: Math.cos(baseAngle) * this.bulletSpeed,
                vy: Math.sin(baseAngle) * this.bulletSpeed,
                life: 100,
                trail: [],
                boosted: false
            };
            this.bullets.push(bullet);
            this.bulletCooldown = 15;
        }
        
        this.createParticles(head.x, head.y, '#ffff00', 3);
    }
    
    spawnTarget() {
        const colors = ['#ff4444', '#44ff44', '#4444ff', '#ff44ff', '#ffff44'];
        const points = [20, 25, 30, 35, 40];
        const radii = [15, 18, 20, 22, 25];
        
        const typeIndex = Math.floor(Math.random() * colors.length);
        
        let x, y;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: x = Math.random() * this.canvas.width; y = -30; break;
            case 1: x = this.canvas.width + 30; y = Math.random() * this.canvas.height; break;
            case 2: x = Math.random() * this.canvas.width; y = this.canvas.height + 30; break;
            case 3: x = -30; y = Math.random() * this.canvas.height; break;
        }
        
        this.targets.push({
            x: x, y: y,
            radius: radii[typeIndex],
            currentRadius: radii[typeIndex],
            color: colors[typeIndex],
            points: points[typeIndex],
            rotation: 0,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    
    spawnTargets() {
        this.targets = [];
        for (let i = 0; i < this.maxTargets; i++) {
            this.spawnTarget();
        }
    }
    
    spawnPowerUp() {
        const types = ['speed', 'shield', 'multishot', 'growth'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 100) + 50,
            type: type,
            radius: 12,
            currentRadius: 12,
            rotation: 0,
            pulsePhase: 0,
            life: 600 // 10 seconds
        });
    }
    
    collectPowerUp(powerUp) {
        this.activePowerUps.push({
            type: powerUp.type,
            duration: 300 // 5 seconds
        });
        
        this.showPowerUpNotification(powerUp.type);
        this.createExplosion(powerUp.x, powerUp.y, 'powerup');
    }
    
    showPowerUpNotification(type) {
        const notification = document.getElementById('powerUpNotification');
        notification.textContent = `${type.toUpperCase()} Activated!`;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 2000);
    }
    
    createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 2;
            
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 30, maxLife: 30,
                alpha: 1,
                radius: Math.random() * 3 + 1
            });
        }
    }
    
    createExplosion(x, y, type) {
        const colors = {
            hit: ['#ffff00', '#ff8800'],
            damage: ['#ff4444', '#880000'],
            eat: ['#00ff88', '#0088ff'],
            powerup: ['#ff44ff', '#8800ff']
        };
        
        this.explosions.push({
            x: x, y: y,
            radius: 5,
            expandSpeed: 3,
            colors: colors[type] || colors.hit,
            life: 20, maxLife: 20,
            alpha: 1
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.drawSnake();
        
        // Draw targets
        this.targets.forEach(target => {
            this.drawTarget(target);
        });
        
        // Draw stunned targets
        this.stunnedTargets.forEach(target => {
            this.drawStunnedTarget(target);
        });
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.drawBullet(bullet);
        });
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => {
            this.drawPowerUp(powerUp);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.drawParticle(particle);
        });
        
        // Draw explosions
        this.explosions.forEach(explosion => {
            this.drawExplosion(explosion);
        });
        
        // Draw floating texts
        this.floatingTexts.forEach(text => {
            this.drawFloatingText(text);
        });
        
        // Draw energy rings
        this.energyRings.forEach(ring => {
            this.drawEnergyRing(ring);
        });
        
        // Draw mouse effects
        this.mouseEffects.forEach(effect => {
            this.drawMouseEffect(effect);
        });
        
        // Draw UI elements
        this.drawUI();
    }
    
    drawSnake() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.strokeStyle = '#005500';
        this.ctx.lineWidth = 2;
        
        this.snake.forEach(segment => {
            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, this.snakeRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }
    
    drawTarget(target) {
        this.ctx.save();
        this.ctx.translate(target.x, target.y);
        this.ctx.rotate(target.rotation);
        
        this.ctx.fillStyle = target.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawStunnedTarget(target) {
        this.ctx.save();
        this.ctx.translate(target.x, target.y);
        this.ctx.rotate(target.rotation);
        
        // Stunned glow effect
        this.ctx.shadowColor = '#ff8800';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#ff8800';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Stunned indicator
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, target.currentRadius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawBullet(bullet) {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, this.bulletRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPowerUp(powerUp) {
        this.ctx.save();
        this.ctx.translate(powerUp.x, powerUp.y);
        this.ctx.rotate(powerUp.rotation);
        
        // Power-up glow
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, powerUp.currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Power-up symbol
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('★', 0, 5);
        
        this.ctx.restore();
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
        const colors = explosion.colors;
        const gradient = this.ctx.createRadialGradient(explosion.x, explosion.y, 0, explosion.x, explosion.y, explosion.radius);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawFloatingText(text) {
        this.ctx.globalAlpha = text.alpha;
        this.ctx.fillStyle = text.color;
        this.ctx.font = `${text.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = text.color;
        this.ctx.shadowBlur = 5;
        this.ctx.fillText(text.text, text.x, text.y);
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    
    drawSpecialEffects() {
        const head = this.snake[0];
        
        // Magnetic field visualization
        if (this.magneticField) {
            this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(head.x, head.y, 150, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Shield effect
        if (this.shieldActive) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(head.x, head.y, 25, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Time slow effect
        if (this.timeSlowActive) {
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Mouse boost indicator
        if (this.mouseBoostActive) {
            const pulseSize = Math.sin(Date.now() * 0.02) * 5 + 20;
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, this.mouseY, pulseSize, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
}
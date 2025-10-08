// Python Attack Mode - Snake shoots bullets at moving letters
class PythonAttackMode extends SnakeGameCore {
    constructor(canvasId, scoreId) {
        super(canvasId, scoreId, null);
        
        // Python Attack specific properties
        this.words = [];
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.foodLetters = [];
        this.completedWords = [];
        this.completedText = '';
        this.bullets = [];
        this.bulletSpeed = 1.0; // Speed per bullet frame (1 cell per 6 bullet frames = 6x snake speed)
        this.bulletInterval = null; // Separate interval for bullets
        this.letterSpeed = 0.5; // Half snake speed
        this.shootCooldown = 0;
        this.maxCooldown = 3; // Frames between shots (faster shooting)
    }
    
    resetGame() {
        super.resetGame();
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.completedWords = [];
        this.completedText = '';
        this.bullets = [];
        this.shootCooldown = 0;
        this.foodLetters = this.getFoodLetters();
        this.updateWordStatus();
    }
    
    setWords(wordString) {
        this.words = wordString ? wordString.split(/\s+|\n+/) : [];
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.foodLetters = this.getFoodLetters();
        this.updateWordStatus();
        this.draw();
    }
    
    getFoodLetters() {
        if (!this.words.length || this.wordIndex >= this.words.length) return [];
        let arr = [];
        let used = [];
        let word = this.words[this.wordIndex];
        for (let l = 0; l < word.length; l++) {
            let pos = this.randomFood(used);
            arr.push({
                letter: word[l],
                pos: pos,
                eaten: false,
                frozen: false,
                direction: this.getRandomDirection(),
                moveCounter: 0
            });
            used.push(pos);
        }
        return arr;
    }
    
    getRandomDirection() {
        const directions = [
            {dx: 0, dy: -1}, // up
            {dx: 1, dy: 0},  // right
            {dx: 0, dy: 1},  // down
            {dx: -1, dy: 0}  // left
        ];
        return directions[Math.floor(Math.random() * directions.length)];
    }
    
    randomFood(avoid = []) {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * this.GRID_SIZE),
                y: Math.floor(Math.random() * this.GRID_SIZE)
            };
        } while (avoid.some(p => p.x === pos.x && p.y === pos.y) || 
                 this.snake.some(s => s.x === pos.x && s.y === pos.y));
        return pos;
    }
    
    move() {
        if (!this.running || this.paused) return;
        
        // Reduce shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        // Move letters (every other frame for half speed)
        this.moveLetters();
        
        // Apply pending direction if any
        if (this.pendingDirection) {
            this.dx = this.pendingDirection.dx;
            this.dy = this.pendingDirection.dy;
            this.pendingDirection = null;
        }
        
        let head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Handle edge mode
        if (this.edgeMode === 'pass') {
            if (head.x < 0) head.x = this.GRID_SIZE-1;
            if (head.x > this.GRID_SIZE-1) head.x = 0;
            if (head.y < 0) head.y = this.GRID_SIZE-1;
            if (head.y > this.GRID_SIZE-1) head.y = 0;
        }
        
        // Check collision with walls or self
        if (head.x<0||head.x>=this.GRID_SIZE||head.y<0||head.y>=this.GRID_SIZE||this.snake.some(s=>s.x===head.x&&s.y===head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check if food was eaten
        if (!this.handleFood()) {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    moveBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            
            // Same step size as snake, but 6x more frequent updates = 6x overall speed
            // Bullets update 6x more frequently, so each step is same size as snake step
            bullet.x += bullet.dx * this.bulletSpeed;
            bullet.y += bullet.dy * this.bulletSpeed;
            
            // Remove bullet if it goes off screen
            if (bullet.x < -2 || bullet.x >= this.GRID_SIZE + 2 || bullet.y < -2 || bullet.y >= this.GRID_SIZE + 2) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check collision
            let bulletGridX = Math.floor(bullet.x);
            let bulletGridY = Math.floor(bullet.y);
            
            if (bulletGridX >= 0 && bulletGridX < this.GRID_SIZE && 
                bulletGridY >= 0 && bulletGridY < this.GRID_SIZE) {
                
                for (let letterObj of this.foodLetters) {
                    if (!letterObj.eaten && 
                        bulletGridX === letterObj.pos.x && 
                        bulletGridY === letterObj.pos.y) {
                        letterObj.frozen = true;
                        letterObj.direction = {dx: 0, dy: 0};
                        this.bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    
    moveLetters() {
        for (let letterObj of this.foodLetters) {
            if (letterObj.eaten || letterObj.frozen) continue;
            
            letterObj.moveCounter++;
            // Move at half speed (every 2 frames)
            if (letterObj.moveCounter >= 2) {
                letterObj.moveCounter = 0;
                
                let newX = letterObj.pos.x + letterObj.direction.dx;
                let newY = letterObj.pos.y + letterObj.direction.dy;
                
                // Bounce off walls
                if (newX < 0 || newX >= this.GRID_SIZE) {
                    letterObj.direction.dx = -letterObj.direction.dx;
                    newX = letterObj.pos.x + letterObj.direction.dx;
                }
                if (newY < 0 || newY >= this.GRID_SIZE) {
                    letterObj.direction.dy = -letterObj.direction.dy;
                    newY = letterObj.pos.y + letterObj.direction.dy;
                }
                
                // Check collision with snake body
                let collision = this.snake.some(s => s.x === newX && s.y === newY);
                if (collision) {
                    // Reverse direction on collision with snake
                    letterObj.direction.dx = -letterObj.direction.dx;
                    letterObj.direction.dy = -letterObj.direction.dy;
                } else {
                    letterObj.pos.x = newX;
                    letterObj.pos.y = newY;
                }
            }
        }
    }
    
    shoot() {
        if (this.shootCooldown > 0 || !this.running || this.paused) return;
        
        let head = this.snake[0];
        this.bullets.push({
            x: head.x + this.dx * 1.0,  // Start one cell ahead of snake head
            y: head.y + this.dy * 1.0,
            dx: this.dx,
            dy: this.dy
        });
        
        this.shootCooldown = this.maxCooldown;
    }
    
    handleFood() {
        if (!this.foodLetters.length) return false;
        
        let head = this.snake[0];
        let currentRequiredLetter = this.words[this.wordIndex] ? this.words[this.wordIndex][this.letterIndex] : '';
        let eatenLetterIndex = -1;
        
        // Check if snake hits any letter that matches the current required letter and is not already eaten
        for (let i = 0; i < this.foodLetters.length; i++) {
            if (head.x === this.foodLetters[i].pos.x && head.y === this.foodLetters[i].pos.y && 
                this.foodLetters[i].letter === currentRequiredLetter && !this.foodLetters[i].eaten) {
                eatenLetterIndex = i;
                break;
            }
        }
        
        if (eatenLetterIndex !== -1) {
            // Mark the letter as eaten
            this.foodLetters[eatenLetterIndex].eaten = true;
            this.letterIndex++;
            this.score++;
            if (this.scoreEl) this.scoreEl.textContent = this.score;
            
            if (this.letterIndex < this.words[this.wordIndex].length) {
                // Continue with current word
            } else {
                // Word completed - add to completed list
                this.completedWords.push(this.words[this.wordIndex]);
                this.completedText = this.completedWords.join(' ');
                
                // Next word
                this.wordIndex++;
                this.letterIndex = 0;
                this.foodLetters = this.getFoodLetters();
                // Check if all words completed
                if (!this.foodLetters.length) {
                    this.running = false;
                    setTimeout(() => {
                        this.showGameCompletedPopup();
                    }, 200);
                    clearInterval(this.interval);
                    
                    const startBtn = document.getElementById('startBtn');
                    const pauseBtn = document.getElementById('pauseBtn');
                    const pauseModal = document.getElementById('pauseModal');
                    const restartBtn = document.getElementById('restartBtn');
                    
                    if (startBtn) startBtn.style.display = 'inline-block';
                    if (pauseBtn) pauseBtn.style.display = 'none';
                    if (pauseModal) pauseModal.style.display = 'none';
                    if (restartBtn) restartBtn.style.display = 'inline-block';
                    
                    // Update set words button state
                    if (window.controls) {
                        window.controls.updateSetWordsButtonState();
                    }
                    return true;
                }
            }
            this.updateWordStatus();
            return true;
        }
        
        return false;
    }
    
    drawFood() {
        if (!this.foodLetters.length) return;
        
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        for (let i = 0; i < this.foodLetters.length; i++) {
            let letterObj = this.foodLetters[i];
            if (letterObj.eaten) {
                this.ctx.fillStyle = '#00ff88';  // Green for eaten letters
            } else if (letterObj.frozen) {
                this.ctx.fillStyle = '#ffaa00';  // Orange for frozen letters
            } else {
                this.ctx.fillStyle = '#ff4444';  // Red for moving letters
            }
            this.ctx.fillText(
                letterObj.letter, 
                letterObj.pos.x * this.CELL_SIZE + this.CELL_SIZE/2, 
                letterObj.pos.y * this.CELL_SIZE + this.CELL_SIZE/2
            );
        }
        
        // Draw bullets with smooth fractional positioning
        this.ctx.fillStyle = '#ffff00';  // Yellow bullets
        for (let bullet of this.bullets) {
            // Use exact fractional pixel position for ultra-smooth movement
            let pixelX = bullet.x * this.CELL_SIZE;
            let pixelY = bullet.y * this.CELL_SIZE;
            
            this.ctx.fillRect(
                pixelX + 1, 
                pixelY + 1, 
                this.CELL_SIZE - 2, 
                this.CELL_SIZE - 2
            );
        }
    }
    
    updateWordStatus() {
        const ws = document.getElementById('wordStatus');
        const cw = document.getElementById('currentWord');
        
        if (!this.words.length) { 
            ws.textContent = ''; 
            cw.textContent = ''; 
            return; 
        }
        
        let curr = this.words[this.wordIndex] || '';
        
        // Create consistent letter spacing with boxes
        let html = '';
        for (let i = 0; i < curr.length; i++) {
            if (i < this.letterIndex) {
                html += '<span class="letter-box eaten-letter">' + curr[i] + '</span>';
            } else {
                html += '<span class="letter-box">' + curr[i] + '</span>';
            }
        }
        
        ws.innerHTML = 'Next: <b>' + (curr[this.letterIndex] || '') + '</b> | Press SPACE to shoot';
        cw.innerHTML = html;
    }
    
    gameOver() {
        this.running = false;
        this.paused = false;
        this.completedText = this.completedWords.join(' ');
        
        // Don't call parent gameOver method - we handle everything here
        const pauseBtn = document.getElementById('pauseBtn');
        const pauseModal = document.getElementById('pauseModal');
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (pauseModal) pauseModal.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
        
        clearInterval(this.interval);
        
        // Update set words button state
        if (window.controls) {
            window.controls.updateSetWordsButtonState();
        }
        
        // Show custom game over popup
        setTimeout(() => {
            this.showGameOverPopup();
        }, 200);
    }
    
    showGameOverPopup() {
        const popup = document.getElementById('gameOverPopup');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('completedText').textContent = this.completedText || 'No words completed';
        document.getElementById('gameOverTitle').textContent = 'Game Over!';
        document.getElementById('gameOverTitle').style.color = '#ff4444';
        popup.style.display = 'flex';
    }
    
    showGameCompletedPopup() {
        const popup = document.getElementById('gameOverPopup');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('completedText').textContent = this.completedText;
        document.getElementById('gameOverTitle').textContent = 'Python Attack Complete!';
        document.getElementById('gameOverTitle').style.color = '#00ff88';
        popup.style.display = 'flex';
    }
    
    startBulletLoop() {
        // Start bullet update loop at 6x snake speed with higher frame rate
        let snakeMs = this.getStepMs();
        let bulletMs = Math.round(snakeMs / 6); // 6 times faster frame rate
        
        clearInterval(this.bulletInterval);
        this.bulletInterval = setInterval(() => {
            if (this.running && !this.paused) {
                this.moveBullets();
                this.draw(); // Redraw to show smooth bullet movement
            }
        }, bulletMs);
    }
    
    stopBulletLoop() {
        clearInterval(this.bulletInterval);
    }
    
    resetGame() {
        super.resetGame();
        this.stopBulletLoop();
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.completedWords = [];
        this.completedText = '';
        this.bullets = [];
        this.shootCooldown = 0;
        this.foodLetters = this.getFoodLetters();
        this.updateWordStatus();
    }
    
    gameOver() {
        this.running = false;
        this.paused = false;
        this.stopBulletLoop();
        this.completedText = this.completedWords.join(' ');
        
        // Don't call parent gameOver method - we handle everything here
        const pauseBtn = document.getElementById('pauseBtn');
        const pauseModal = document.getElementById('pauseModal');
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (pauseModal) pauseModal.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
        
        clearInterval(this.interval);
        
        // Update set words button state
        if (window.controls) {
            window.controls.updateSetWordsButtonState();
        }
        
        // Show custom game over popup
        setTimeout(() => {
            this.showGameOverPopup();
        }, 200);
    }
    
    pauseGame() {
        if (!this.running || this.paused) return;
        this.paused = true;
        clearInterval(this.interval);
        this.stopBulletLoop();
        
        const pauseModal = document.getElementById('pauseModal');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (pauseModal) pauseModal.style.display = 'flex';
        if (pauseBtn) pauseBtn.textContent = 'Resume';
    }
    
    resumeGame() {
        if (!this.running || !this.paused) return;
        this.paused = false;
        let ms = this.getStepMs();
        this.interval = setInterval(() => this.move(), ms);
        this.startBulletLoop();
        
        const pauseModal = document.getElementById('pauseModal');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (pauseModal) pauseModal.style.display = 'none';
        if (pauseBtn) pauseBtn.textContent = 'Pause';
    }

    // Override the key handler to add shooting
    initializeEventListeners() {
        super.initializeEventListeners();
        
        // Add space bar shooting
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                this.shoot();
            }
        });
    }
}
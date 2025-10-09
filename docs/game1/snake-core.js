// Snake Game Core - Shared functionality across all game modes
class SnakeGameCore {
    constructor(canvasId, scoreId, gameOverId = null) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById(scoreId);
        this.gameOverEl = gameOverId ? document.getElementById(gameOverId) : null;
        
        // Grid settings
        this.GRID_SIZE = 30;
        this.CELL_SIZE = 20;
        
        // Game state
        this.snake = [];
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.running = false;
        this.paused = false;
        this.interval = null;
        this.pendingDirection = null;
        this.wasAutoPaused = false;
        
        // Settings
        this.speed = 50;
        this.edgeMode = 'pass'; // 'pass' or 'stiff'
        
        this.initializeEventListeners();
    }
    
    resetGame() {
        this.snake = [{x: Math.floor(this.GRID_SIZE/2), y: Math.floor(this.GRID_SIZE/2)}];
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.running = true;
        this.paused = false;
        this.pendingDirection = null;
        
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        if (this.gameOverEl) this.gameOverEl.style.display = 'none';
        
        const pauseModal = document.getElementById('pauseModal');
        if (pauseModal) pauseModal.style.display = 'none';
    }
    
    getStepMs() {
        let stepsPerSec = 0.5 + (this.speed-1)*(19.5/99);
        return Math.round(1000/stepsPerSec);
    }
    
    pauseGame() {
        if (!this.running || this.paused) return;
        this.paused = true;
        clearInterval(this.interval);
        
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
        
        const pauseModal = document.getElementById('pauseModal');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (pauseModal) pauseModal.style.display = 'none';
        if (pauseBtn) pauseBtn.textContent = 'Pause';
    }
    
    move() {
        if (!this.running || this.paused) return;
        
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
        
        // Check collision
        if (head.x<0||head.x>=this.GRID_SIZE||head.y<0||head.y>=this.GRID_SIZE||this.snake.some(s=>s.x===head.x&&s.y===head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Game-specific logic should be implemented in subclasses
        if (!this.handleFood()) {
            this.snake.pop();
        }
        
        this.draw();
    }
    
    gameOver() {
        this.running = false;
        this.paused = false;
        if (this.gameOverEl) {
            this.gameOverEl.style.display = 'block';
        }
        const pauseBtn = document.getElementById('pauseBtn');
        const pauseModal = document.getElementById('pauseModal');
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (pauseModal) pauseModal.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
        
        clearInterval(this.interval);
        
        // Update set words button state if controls exist
        if (window.controls) {
            window.controls.updateSetWordsButtonState();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.GRID_SIZE*this.CELL_SIZE, this.GRID_SIZE*this.CELL_SIZE);
        
        // Draw snake with red head and green body
        this.snake.forEach((s, index) => {
            if (index === 0) {
                // Head is red
                this.ctx.fillStyle = '#ff4444';
            } else {
                // Body is green
                this.ctx.fillStyle = '#00ff88';
            }
            this.ctx.fillRect(s.x*this.CELL_SIZE+1, s.y*this.CELL_SIZE+1, this.CELL_SIZE-2, this.CELL_SIZE-2);
        });
        
        // Game-specific drawing should be implemented in subclasses
        this.drawFood();
        
        this.ctx.globalAlpha = 1;
    }
    
    // To be overridden by subclasses
    handleFood() {
        return false;
    }
    
    drawFood() {
        // To be implemented by subclasses
    }
    
    initializeEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            // Handle Enter key for pause/resume
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.running) {
                    if (this.paused) {
                        this.resumeGame();
                    } else {
                        this.pauseGame();
                    }
                }
                return;
            }
            
            if (!this.running || this.paused) return;
            
            // Handle arrow keys for snake movement
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                
                if (this.pendingDirection) return;
                
                let newDx = this.dx, newDy = this.dy;
                if (e.key==='ArrowUp'&&this.dy!==1) {newDx=0;newDy=-1;}
                else if (e.key==='ArrowDown'&&this.dy!==-1) {newDx=0;newDy=1;}
                else if (e.key==='ArrowLeft'&&this.dx!==1) {newDx=-1;newDy=0;}
                else if (e.key==='ArrowRight'&&this.dx!==-1) {newDx=1;newDy=0;}
                
                if (newDx !== this.dx || newDy !== this.dy) {
                    this.pendingDirection = {dx: newDx, dy: newDy};
                }
            }
        });
        
        // Auto-pause when tab loses focus
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.running && !this.paused) {
                    this.wasAutoPaused = true;
                    this.pauseGame();
                }
            } else {
                if (this.running && this.paused && this.wasAutoPaused) {
                    this.wasAutoPaused = false;
                    this.resumeGame();
                }
            }
        });
        
        window.addEventListener('blur', () => {
            if (this.running && !this.paused) {
                this.wasAutoPaused = true;
                this.pauseGame();
            }
        });
        
        window.addEventListener('focus', () => {
            if (this.running && this.paused && this.wasAutoPaused) {
                this.wasAutoPaused = false;
                this.resumeGame();
            }
        });
    }
}
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.gameOverModal = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.playAgainButton = document.getElementById('playAgainButton');

        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        // Initialize game state
        this.reset();
        this.loadHighScore();
        this.bindEvents();
    }

    reset() {
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.food = this.generateFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.updateScore();
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.playAgainButton.addEventListener('click', () => this.restartGame());

        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning && e.code !== 'Space') return;

            switch (e.code) {
                case 'ArrowUp':
                    if (this.dy === 0) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                    if (this.dy === 0) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (this.dx === 0) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (this.dx === 0) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
                case 'Space':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
    }

    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.startButton.disabled = true;
        this.restartButton.disabled = false;
        this.gameOverModal.classList.add('hidden');
        this.gameLoop();
    }

    restartGame() {
        this.reset();
        this.startButton.disabled = false;
        this.restartButton.disabled = true;
        this.gameOverModal.classList.add('hidden');
        this.draw();
    }

    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (!this.gamePaused) {
                this.gameLoop();
            }
        }
    }

    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;

        this.update();
        this.draw();

        if (this.gameRunning) {
            setTimeout(() => this.gameLoop(), 100);
        }
    }

    update() {
        // Don't move if no direction is set
        if (this.dx === 0 && this.dy === 0) {
            return;
        }
        
        // Move snake head
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

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

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head
                this.ctx.fillStyle = '#4ecdc4';
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
                
                // Add eyes to the head
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillRect(segment.x * this.gridSize + 4, segment.y * this.gridSize + 4, 3, 3);
                this.ctx.fillRect(segment.x * this.gridSize + 13, segment.y * this.gridSize + 4, 3, 3);
            } else {
                // Snake body
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
            }
        });

        // Draw food
        this.ctx.fillStyle = '#ffd93d';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // Draw pause indicator
        if (this.gamePaused) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.getHighScore()) {
            this.setHighScore(this.score);
            this.highScoreElement.textContent = this.score;
        }
    }

    gameOver() {
        this.gameRunning = false;
        this.startButton.disabled = false;
        this.restartButton.disabled = true;
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.classList.remove('hidden');
    }

    getHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore') || '0');
    }

    setHighScore(score) {
        localStorage.setItem('snakeHighScore', score.toString());
    }

    loadHighScore() {
        this.highScoreElement.textContent = this.getHighScore();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    game.draw(); // Draw initial state
});

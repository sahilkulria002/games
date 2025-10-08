// Word Learning Mode - Snake eats letters to spell words
class WordLearningMode extends SnakeGameCore {
    constructor(canvasId, scoreId) {
        super(canvasId, scoreId, null);
        
        // Word learning specific properties
        this.words = [];
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.foodLetters = [];
        this.completedWords = [];
        this.completedText = '';
    }
    
    resetGame() {
        super.resetGame();
        this.wordIndex = 0;
        this.letterIndex = 0;
        this.completedWords = [];
        this.completedText = '';
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
                eaten: false
            });
            used.push(pos);
        }
        return arr;
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
            if (this.foodLetters[i].eaten) {
                this.ctx.fillStyle = '#00ff88';  // Green for eaten letters
            } else {
                this.ctx.fillStyle = '#ff4444';  // Red for uneaten letters
            }
            this.ctx.fillText(
                this.foodLetters[i].letter, 
                this.foodLetters[i].pos.x * this.CELL_SIZE + this.CELL_SIZE/2, 
                this.foodLetters[i].pos.y * this.CELL_SIZE + this.CELL_SIZE/2
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
        
        ws.innerHTML = 'Next: <b>' + (curr[this.letterIndex] || '') + '</b>';
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
        document.getElementById('gameOverTitle').textContent = 'Congratulations!';
        document.getElementById('gameOverTitle').style.color = '#00ff88';
        popup.style.display = 'flex';
    }
}
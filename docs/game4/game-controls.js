// Word Maze Controls - Game control system
class WordMazeControls {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.initialized = false;
    }
    
    initialize() {
        if (this.initialized) return;
        
        // Get control elements
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            restartBtn: document.getElementById('restartBtn'),
            sentenceText: document.getElementById('sentenceText'),
            sentenceProgress: document.getElementById('sentenceProgress'),
            targetLetter: document.getElementById('targetLetter')
        };
        
        // Setup event listeners
        this.setupEventListeners();
        this.updateButtonStates();
        
        this.initialized = true;
        
        // Update UI with current sentence
        this.updateSentenceDisplay();
    }
    
    setupEventListeners() {
        // Start button
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        // Pause button
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }
        
        // Restart button
        if (this.elements.restartBtn) {
            this.elements.restartBtn.addEventListener('click', () => {
                this.restartGame();
            });
        }
        
        // Combined keyboard handling
        document.addEventListener('keydown', (e) => {
            this.handleAllKeydown(e);
        });
        
        // Window focus/blur handling
        window.addEventListener('blur', () => {
            if (this.game.running && !this.game.paused) {
                this.game.wasAutoPaused = true;
                this.game.pauseGame();
                this.updateButtonStates();
            }
        });
        
        window.addEventListener('focus', () => {
            if (this.game.wasAutoPaused) {
                setTimeout(() => {
                    if (this.game.wasAutoPaused) {
                        this.game.wasAutoPaused = false;
                        this.game.resumeGame();
                        this.updateButtonStates();
                        if (this.elements.wordInput) {
                            this.elements.wordInput.focus();
                        }
                    }
                }, 100);
            }
        });
    }
    
    handleMovementKeydown(e) {
        if (!this.game.running || this.game.paused) {
            return;
        }
        
        let direction = null;
        
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                e.preventDefault();
                direction = { dx: 0, dy: -1 };
                break;
            case 'arrowdown':
            case 's':
                e.preventDefault();
                direction = { dx: 0, dy: 1 };
                break;
            case 'arrowleft':
            case 'a':
                e.preventDefault();
                direction = { dx: -1, dy: 0 };
                break;
            case 'arrowright':
            case 'd':
                e.preventDefault();
                direction = { dx: 1, dy: 0 };
                break;
        }
        
        if (direction) {
            this.game.movePlayer(direction);
        }
    }
    
    handleAllKeydown(e) {
        // Handle global shortcuts first
        switch(e.key.toLowerCase()) {
            case 'p':
                e.preventDefault();
                this.togglePause();
                return;
            case 'r':
                e.preventDefault();
                if (this.game.running) {
                    this.restartGame();
                }
                return;
            case 'escape':
                e.preventDefault();
                if (this.game.running) {
                    this.togglePause();
                }
                return;
        }
        
        // Handle movement keys
        this.handleMovementKeydown(e);
    }
    
    updateSentenceDisplay() {
        if (!this.elements.sentenceText || !this.elements.targetLetter) return;
        
        this.elements.sentenceText.textContent = this.game.currentSentence;
        
        const targetLetter = this.game.currentSentence.replace(/\s/g, '')[this.game.targetLetterIndex];
        if (targetLetter) {
            this.elements.targetLetter.textContent = targetLetter;
        }
        
        // Update progress text
        if (this.elements.sentenceProgress) {
            const progress = this.game.collectedLetters.join('');
            const remaining = this.game.currentSentence.replace(/\s/g, '').substring(this.game.targetLetterIndex);
            
            if (remaining.length > 0) {
                this.elements.sentenceProgress.innerHTML = `Find: <span id="targetLetter">${remaining[0]}</span>`;
            } else {
                this.elements.sentenceProgress.innerHTML = `🎉 Sentence Complete!`;
            }
        }
    }
    
    handleGlobalKeydown(e) {
        // This method is now replaced by handleMovementKeydown
    }
    

    
    startGame() {
        this.game.startGame();
        this.updateButtonStates();
        
        // Show start message
        this.showTemporaryMessage('Game Started! Use WASD or Arrow Keys to collect letters!', 3000);
    }
    
    togglePause() {
        if (!this.game.running) return;
        
        if (this.game.paused) {
            this.game.resumeGame();
            if (this.elements.wordInput) {
                this.elements.wordInput.focus();
            }
            this.showTemporaryMessage('Game Resumed!', 1500);
        } else {
            this.game.pauseGame();
            this.showTemporaryMessage('Game Paused', 1500);
        }
        
        this.updateButtonStates();
    }
    
    restartGame() {
        this.game.resetGame();
        this.startGame();
        this.showTemporaryMessage('Game Restarted!', 2000);
    }
    
    updateButtonStates() {
        if (!this.initialized) return;
        
        const isRunning = this.game.running;
        const isPaused = this.game.paused;
        
        // Start button
        if (this.elements.startBtn) {
            this.elements.startBtn.style.display = isRunning ? 'none' : 'inline-block';
        }
        
        // Pause button
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.style.display = isRunning ? 'inline-block' : 'none';
            this.elements.pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        }
        
        // Restart button
        if (this.elements.restartBtn) {
            this.elements.restartBtn.style.display = isRunning ? 'inline-block' : 'none';
        }
        
        // Word input
        if (this.elements.wordInput) {
            this.elements.wordInput.disabled = !isRunning || isPaused;
            if (isRunning && !isPaused) {
                this.elements.wordInput.focus();
            }
        }
    }
    
    showTemporaryMessage(message, duration = 2000) {
        // Create floating message
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #5a4a7a, #7a4a9a);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 1.1rem;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            border: 2px solid #9a6aaa;
            animation: messageSlideIn ${duration}ms ease-in-out;
        `;
        
        // Add CSS animation if not exists
        if (!document.getElementById('message-style')) {
            const style = document.createElement('style');
            style.id = 'message-style';
            style.textContent = `
                @keyframes messageSlideIn {
                    0% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.8) translateY(-20px); 
                    }
                    10%, 90% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1) translateY(0); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.8) translateY(20px); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, duration);
    }
    
    // Helper method to display hints
    showHint(hintText) {
        // Update challenge indicator in instructions
        const challengeIndicator = document.querySelector('.challenge-indicator');
        if (challengeIndicator) {
            challengeIndicator.textContent = hintText;
            challengeIndicator.style.animation = 'none';
            setTimeout(() => {
                challengeIndicator.style.animation = 'pulse 2s infinite';
            }, 100);
        }
    }
    
    // Method to handle level progression
    onLevelUp(newLevel) {
        this.showTemporaryMessage(`Level ${newLevel}! 🎉`, 3000);
        
        // Update difficulty hint
        let hint = '';
        switch(newLevel) {
            case 2:
                hint = 'Words are getting longer!';
                break;
            case 3:
                hint = 'Maze complexity increased!';
                break;
            case 4:
                hint = 'Advanced vocabulary!';
                break;
            case 5:
                hint = 'Master level achieved!';
                break;
            default:
                hint = `Level ${newLevel} - You're on fire! 🔥`;
        }
        
        setTimeout(() => {
            this.showHint(hint);
        }, 3000);
    }
    
    // Method to handle game over
    onGameOver(reason, stats) {
        this.updateButtonStates();
        
        // Clear input
        if (this.elements.wordInput) {
            this.elements.wordInput.value = '';
            this.elements.wordInput.style.borderColor = '#7a4a9a';
            this.elements.wordInput.style.boxShadow = '';
        }
        
        // Focus will be handled by the modal
    }
}
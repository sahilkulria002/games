// Game 4 - Modular Architecture
// Clean, reusable code structure supporting multiple game modes

class Game4Engine {
    constructor() {
        this.currentMode = null;
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            level: 1,
            timer: 0,
            lives: 3
        };
        this.modes = new Map();
        this.ui = new UIManager();
        this.words = new WordManager();
        this.sounds = new SoundManager();
        
        this.initialize();
    }

    // Initialize the game engine
    initialize() {
        console.log('Game 4 Engine initializing...');
        
        // Initialize managers
        this.ui.initialize();
        this.words.initialize();
        this.sounds.initialize();
        
        // Register available game modes
        this.registerModes();
        
        // Show mode selection screen
        this.showModeSelection();
    }

    // Register all available game modes
    registerModes() {
        this.modes.set('mode1', new GameMode1(this));
        this.modes.set('mode2', new GameMode2(this));
        this.modes.set('mode3', new GameMode3(this));
        // Add more modes as needed
    }

    // Start a specific game mode
    startMode(modeId) {
        if (this.modes.has(modeId)) {
            this.currentMode = this.modes.get(modeId);
            this.resetGameState();
            this.ui.showGameScreen();
            this.currentMode.start();
            console.log(`Started game mode: ${modeId}`);
        } else {
            console.error(`Game mode ${modeId} not found`);
        }
    }

    // Reset game state for new game
    resetGameState() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            level: 1,
            timer: 0,
            lives: 3
        };
    }

    // Pause/Resume game
    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        if (this.currentMode) {
            this.currentMode.togglePause();
        }
        
        // Update pause button text
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = this.gameState.isPaused ? 'Resume' : 'Pause';
        }
    }

    // End current game
    endGame() {
        if (this.currentMode) {
            this.currentMode.end();
        }
        this.gameState.isPlaying = false;
        this.ui.showGameOver();
    }

    // Return to mode selection
    returnToModeSelection() {
        if (this.currentMode) {
            this.currentMode.cleanup();
        }
        this.currentMode = null;
        this.showModeSelection();
    }

    // Show mode selection screen
    showModeSelection() {
        this.ui.showModeSelection();
    }

    // Update score
    updateScore(points) {
        this.gameState.score += points;
        this.ui.updateScore(this.gameState.score);
    }

    // Update level
    updateLevel(newLevel) {
        this.gameState.level = newLevel;
        this.ui.updateLevel(this.gameState.level);
    }
}

// Base class for game modes
class GameMode {
    constructor(engine) {
        this.engine = engine;
        this.name = "Base Mode";
        this.description = "Base game mode";
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.engine.gameState.isPlaying = true;
        console.log(`${this.name} started`);
    }

    update() {
        // Override in child classes
    }

    render() {
        // Override in child classes
    }

    handleInput(input) {
        // Override in child classes
    }

    togglePause() {
        // Override in child classes
    }

    end() {
        this.isActive = false;
        console.log(`${this.name} ended`);
    }

    cleanup() {
        this.isActive = false;
        // Override in child classes for specific cleanup
    }
}

// Game Mode 1 - Brain Chain Calculator
class GameMode1 extends GameMode {
    constructor(engine) {
        super(engine);
        this.name = "Brain Chain Calculator";
        this.description = "Remember previous answers while solving new equations";
        
        // Game state
        this.currentEquation = null;
        this.previousAnswer = null;
        this.equationHistory = [];
        this.currentStep = 1;
        this.maxSteps = 5; // Number of equations in a chain
        this.difficulty = 1; // 1=easy, 2=medium, 3=hard
        
        // UI elements
        this.gameArea = null;
        this.equationDisplay = null;
        this.answerInput = null;
        this.previousDisplay = null;
        this.nextButton = null;
        this.submitButton = null;
        
        // Game mechanics
        this.waitingForAnswer = false;
        this.showingNewEquation = true;
    }

    start() {
        super.start();
        this.setupUI();
        this.showStartScreen();
    }

    setupUI() {
        this.gameArea = document.getElementById('game-area');
        this.gameArea.innerHTML = `
            <div class="brain-chain-container">
                <div class="game-header">
                    <h2>Brain Chain Calculator</h2>
                    <p>Remember the previous answer while solving the current equation!</p>
                    <div class="chain-progress">
                        <span>Step: <span id="current-step">1</span>/<span id="max-steps">${this.maxSteps}</span></span>
                        <span>Difficulty: <span id="difficulty">${this.difficulty}</span></span>
                    </div>
                </div>
                
                <div class="equation-area" id="equation-area">
                    <div id="start-screen" class="start-screen">
                        <div class="start-content">
                            <h3>Ready to Train Your Brain?</h3>
                            <p>You'll see math equations. Remember the answer while solving the next one!</p>
                            <button id="start-game-btn" class="game-btn start-btn">Start Game</button>
                        </div>
                    </div>
                    
                    <div id="game-content" class="game-content hidden">
                        <div class="previous-answer-section">
                            <label>Previous Answer:</label>
                            <div id="previous-display" class="previous-display">-</div>
                        </div>
                        
                        <div class="current-equation-section">
                            <div id="equation-display" class="equation-display">
                                <!-- Current equation will appear here -->
                            </div>
                        </div>
                        
                        <div class="answer-section">
                            <label for="answer-input">Your Answer:</label>
                            <input type="number" id="answer-input" class="answer-input" placeholder="Enter answer...">
                            <div class="button-group">
                                <button id="next-btn" class="game-btn next-btn" style="display:block; visibility:visible;">Next →</button>
                                <button id="submit-btn" class="game-btn submit-btn" style="display:none;">Submit Answer</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="instructions">
                    <p><strong>How to play:</strong></p>
                    <ol>
                        <li>Look at the equation and calculate the answer mentally</li>
                        <li>Click "Next" to hide the equation</li>
                        <li>Remember your answer while a new equation appears</li>
                        <li>Enter the answer to the PREVIOUS equation</li>
                        <li>Continue the chain to improve your memory!</li>
                    </ol>
                </div>
            </div>
        `;
        
        // Get UI references
        this.equationDisplay = document.getElementById('equation-display');
        this.answerInput = document.getElementById('answer-input');
        this.previousDisplay = document.getElementById('previous-display');
        this.nextButton = document.getElementById('next-btn');
        this.submitButton = document.getElementById('submit-btn');
        
        // Bind events
        this.bindEvents();
    }

    showStartScreen() {
        const startScreen = document.getElementById('start-screen');
        const gameContent = document.getElementById('game-content');
        const gameUI = document.getElementById('game-ui');
        
        if (startScreen) startScreen.style.display = 'block';
        if (gameContent) gameContent.style.display = 'none';
        if (gameUI) gameUI.style.display = 'none';
    }

    startActualGame() {
        console.log('Starting actual game...');
        
        const startScreen = document.getElementById('start-screen');
        const gameContent = document.getElementById('game-content');
        const gameUI = document.getElementById('game-ui');
        
        if (startScreen) {
            startScreen.style.display = 'none';
            console.log('Start screen hidden');
        }
        if (gameContent) {
            gameContent.classList.remove('hidden');
            gameContent.classList.add('visible');
            console.log('Game content shown');
        }
        if (gameUI) {
            gameUI.style.display = 'flex';
            console.log('Game UI shown');
        }
        
        // Re-get button references after showing content
        this.nextButton = document.getElementById('next-btn');
        this.submitButton = document.getElementById('submit-btn');
        this.answerInput = document.getElementById('answer-input');
        
        console.log('Button references:', {
            next: this.nextButton,
            submit: this.submitButton,
            input: this.answerInput
        });
        
        // Debug: Show game content HTML
        if (gameContent) {
            console.log('Game content HTML:', gameContent.innerHTML);
            console.log('Game content computed style:', window.getComputedStyle(gameContent).display);
        }
        
        this.generateNewEquation();
        this.showCurrentEquation();
    }

    bindEvents() {
        // Start game button
        const startGameBtn = document.getElementById('start-game-btn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startActualGame());
        }
        
        // Game buttons - add safety checks
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.handleNext());
        }
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => this.handleSubmit());
        }
        if (this.answerInput) {
            this.answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.submitButton && this.submitButton.style.display !== 'none') {
                    this.handleSubmit();
                }
            });
        }
    }

    generateNewEquation() {
        const operators = ['+', '-', '*', '/'];
        let num1, num2, operator, answer;
        
        // Generate numbers based on difficulty
        switch(this.difficulty) {
            case 1: // Easy: single digits, simple operations
                num1 = Math.floor(Math.random() * 9) + 1;
                num2 = Math.floor(Math.random() * 9) + 1;
                operator = operators[Math.floor(Math.random() * 2)]; // Only + and -
                break;
                
            case 2: // Medium: two digits, all operations
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = operators[Math.floor(Math.random() * 4)];
                break;
                
            case 3: // Hard: larger numbers
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                operator = operators[Math.floor(Math.random() * 4)];
                break;
        }
        
        // Ensure division results in whole numbers
        if (operator === '/') {
            num1 = num2 * (Math.floor(Math.random() * 10) + 1);
        }
        
        // Calculate answer
        switch(operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
            case '/': answer = num1 / num2; break;
        }
        
        this.currentEquation = {
            num1: num1,
            num2: num2,
            operator: operator,
            answer: answer,
            expression: `${num1} ${operator} ${num2}`
        };
    }

    showCurrentEquation() {
        if (this.currentEquation) {
            this.equationDisplay.innerHTML = `
                <div class="equation">
                    <span class="equation-text">${this.currentEquation.expression} = ?</span>
                </div>
            `;
            this.equationDisplay.style.opacity = '1';
            this.showingNewEquation = true;
            
            // Debug: Check if buttons exist
            console.log('Next button:', this.nextButton);
            console.log('Submit button:', this.submitButton);
            
            if (this.nextButton) {
                this.nextButton.style.display = 'block';
                this.nextButton.style.visibility = 'visible';
            }
            if (this.submitButton) {
                this.submitButton.style.display = 'none';
            }
            if (this.answerInput) {
                this.answerInput.disabled = true;
            }
        }
    }

    hideCurrentEquation() {
        this.equationDisplay.innerHTML = `
            <div class="equation hidden">
                <span class="equation-text">_ _ _ = ?</span>
            </div>
        `;
        this.equationDisplay.style.opacity = '0.3';
        this.showingNewEquation = false;
        this.waitingForAnswer = true;
        this.nextButton.style.display = 'none';
        this.submitButton.style.display = 'block';
        this.answerInput.disabled = false;
        this.answerInput.focus();
    }

    handleNext() {
        if (this.showingNewEquation) {
            this.hideCurrentEquation();
            
            // If this isn't the first equation, show previous answer placeholder
            if (this.currentStep > 1) {
                this.previousDisplay.textContent = `Step ${this.currentStep - 1} answer`;
                this.previousDisplay.classList.add('waiting');
            }
        }
    }

    handleSubmit() {
        if (!this.waitingForAnswer) return;
        
        const userAnswer = parseInt(this.answerInput.value);
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number!', 'error');
            return;
        }
        
        // Check if answer is correct
        const correctAnswer = this.equationHistory.length > 0 ? 
            this.equationHistory[this.equationHistory.length - 1].answer : 
            this.currentEquation.answer;
        
        if (userAnswer === correctAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(correctAnswer);
        }
    }

    handleCorrectAnswer() {
        this.showFeedback('Correct! 🎉', 'success');
        this.engine.updateScore(10 * this.difficulty);
        
        // Move to next step
        this.equationHistory.push(this.currentEquation);
        this.previousAnswer = this.currentEquation.answer;
        this.previousDisplay.textContent = this.previousAnswer;
        this.previousDisplay.classList.remove('waiting');
        
        this.currentStep++;
        document.getElementById('current-step').textContent = this.currentStep;
        
        // Check if chain is complete
        if (this.currentStep > this.maxSteps) {
            this.completeChain();
        } else {
            // Generate next equation and continue
            this.generateNewEquation();
            this.answerInput.value = '';
            this.showCurrentEquation();
        }
    }

    handleWrongAnswer(correctAnswer) {
        this.showFeedback(`Wrong! The answer was ${correctAnswer}`, 'error');
        this.engine.gameState.lives--;
        this.engine.ui.updateLives(this.engine.gameState.lives);
        
        if (this.engine.gameState.lives <= 0) {
            this.engine.endGame();
        } else {
            // Continue with penalty
            this.handleCorrectAnswer(); // Continue chain but with no points
        }
    }

    completeChain() {
        // Bonus points for completing chain
        this.engine.updateScore(50 * this.difficulty);
        this.showFeedback(`Chain Complete! Bonus: ${50 * this.difficulty} points!`, 'bonus');
        
        // Increase difficulty and start new chain
        setTimeout(() => {
            this.difficulty++;
            if (this.difficulty > 3) this.difficulty = 3; // Max difficulty
            document.getElementById('difficulty').textContent = this.difficulty;
            
            this.currentStep = 1;
            this.equationHistory = [];
            this.previousAnswer = null;
            this.previousDisplay.textContent = '-';
            document.getElementById('current-step').textContent = this.currentStep;
            
            this.generateNewEquation();
            this.answerInput.value = '';
            this.showCurrentEquation();
        }, 2000);
    }

    showFeedback(message, type) {
        // Create or update feedback element
        let feedback = document.querySelector('.feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'feedback';
            this.gameArea.appendChild(feedback);
        }
        
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        
        // Auto-hide after 2 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 2000);
    }

    update() {
        // Game loop update if needed
    }

    render() {
        // Additional rendering if needed
    }

    togglePause() {
        const gameContent = document.getElementById('game-content');
        const pauseOverlay = document.getElementById('pause-overlay');
        
        if (this.engine.gameState.isPaused) {
            // Show pause overlay
            if (!pauseOverlay) {
                const overlay = document.createElement('div');
                overlay.id = 'pause-overlay';
                overlay.className = 'pause-overlay';
                overlay.innerHTML = `
                    <div class="pause-content">
                        <h3>Game Paused</h3>
                        <p>Click Resume to continue</p>
                    </div>
                `;
                document.getElementById('game-area').appendChild(overlay);
            } else {
                pauseOverlay.style.display = 'flex';
            }
            
            // Disable inputs
            const answerInput = document.getElementById('answer-input');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            
            if (answerInput) answerInput.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
        } else {
            // Hide pause overlay
            if (pauseOverlay) {
                pauseOverlay.style.display = 'none';
            }
            
            // Enable inputs
            const answerInput = document.getElementById('answer-input');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            
            if (answerInput && !this.showingNewEquation) answerInput.disabled = false;
            if (nextBtn && this.showingNewEquation) nextBtn.disabled = false;
            if (submitBtn && this.waitingForAnswer) submitBtn.disabled = false;
        }
    }

    handleInput(input) {
        // Handle keyboard input if needed
    }

    cleanup() {
        super.cleanup();
        // Clean up any intervals or event listeners
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    }
}

// Game Mode 2 - Template
class GameMode2 extends GameMode {
    constructor(engine) {
        super(engine);
        this.name = "Mode 2";
        this.description = "Second game mode";
    }

    start() {
        super.start();
        // Mode 2 specific start logic
    }

    update() {
        // Mode 2 specific update logic
    }

    render() {
        // Mode 2 specific render logic
    }

    handleInput(input) {
        // Mode 2 specific input handling
    }
}

// Game Mode 3 - Template
class GameMode3 extends GameMode {
    constructor(engine) {
        super(engine);
        this.name = "Mode 3";
        this.description = "Third game mode";
    }

    start() {
        super.start();
        // Mode 3 specific start logic
    }

    update() {
        // Mode 3 specific update logic
    }

    render() {
        // Mode 3 specific render logic
    }

    handleInput(input) {
        // Mode 3 specific input handling
    }
}

// UI Manager - Handles all UI operations
class UIManager {
    constructor() {
        this.elements = {};
        this.currentScreen = 'mode-selection';
    }

    initialize() {
        console.log('UI Manager initialized');
        this.createUIElements();
        this.bindEvents();
    }

    createUIElements() {
        const container = document.querySelector('.container');
        
        // Mode selection screen
        this.elements.modeSelection = this.createModeSelectionScreen();
        
        // Game screen
        this.elements.gameScreen = this.createGameScreen();
        
        // Game over screen
        this.elements.gameOverScreen = this.createGameOverScreen();
        
        container.appendChild(this.elements.modeSelection);
        container.appendChild(this.elements.gameScreen);
        container.appendChild(this.elements.gameOverScreen);
    }

    createModeSelectionScreen() {
        const screen = document.createElement('div');
        screen.id = 'mode-selection';
        screen.className = 'screen active';
        screen.innerHTML = `
            <h1>Brain Chain Calculator</h1>
            <div class="mode-grid">
                <button class="mode-btn" data-mode="mode1">
                    <h3>🧠 Memory Math</h3>
                    <p>Remember previous answers while solving new equations. Train your mental math and memory!</p>
                </button>
                <button class="mode-btn" data-mode="mode2">
                    <h3>🚀 Coming Soon</h3>
                    <p>More brain training modes in development</p>
                </button>
                <button class="mode-btn" data-mode="mode3">
                    <h3>⭐ Coming Soon</h3>
                    <p>Advanced challenges coming soon</p>
                </button>
            </div>
        `;
        return screen;
    }

    createGameScreen() {
        const screen = document.createElement('div');
        screen.id = 'game-screen';
        screen.className = 'screen';
        screen.innerHTML = `
                <div class="game-ui" id="game-ui" style="display:none;">
                <div class="game-stats">
                    <span>Score: <span id="score">0</span></span>
                    <span>Level: <span id="level">1</span></span>
                    <span>Lives: <span id="lives">3</span></span>
                </div>
                <div class="game-controls">
                    <button id="pause-btn">Pause</button>
                    <button id="quit-btn">Quit</button>
                </div>
            </div>
            <div id="game-area">
                <!-- Game content will be rendered here -->
            </div>
        `;
        return screen;
    }

    createGameOverScreen() {
        const screen = document.createElement('div');
        screen.id = 'game-over';
        screen.className = 'screen';
        screen.innerHTML = `
            <h2>Game Over!</h2>
            <div class="final-stats">
                <p>Final Score: <span id="final-score">0</span></p>
                <p>Level Reached: <span id="final-level">1</span></p>
            </div>
            <div class="game-over-buttons">
                <button id="restart-btn">Play Again</button>
                <button id="menu-btn">Main Menu</button>
            </div>
        `;
        return screen;
    }

    bindEvents() {
        // Mode selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mode-btn') || e.target.closest('.mode-btn')) {
                const modeBtn = e.target.classList.contains('mode-btn') ? e.target : e.target.closest('.mode-btn');
                const mode = modeBtn.dataset.mode;
                if (window.gameEngine) {
                    window.gameEngine.startMode(mode);
                }
            }
        });

        // Game controls
        document.addEventListener('click', (e) => {
            if (e.target.id === 'pause-btn' && window.gameEngine) {
                window.gameEngine.togglePause();
            }
            if (e.target.id === 'quit-btn' && window.gameEngine) {
                window.gameEngine.returnToModeSelection();
            }
            if (e.target.id === 'restart-btn' && window.gameEngine) {
                window.gameEngine.startMode(window.gameEngine.currentMode?.constructor.name.toLowerCase().replace('gamemode', 'mode'));
            }
            if (e.target.id === 'menu-btn' && window.gameEngine) {
                window.gameEngine.returnToModeSelection();
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    showModeSelection() {
        this.showScreen('mode-selection');
    }

    showGameScreen() {
        this.showScreen('game-screen');
    }

    showGameOver() {
        this.showScreen('game-over');
    }

    updateScore(score) {
        const scoreElement = document.getElementById('score');
        const finalScoreElement = document.getElementById('final-score');
        if (scoreElement) scoreElement.textContent = score;
        if (finalScoreElement) finalScoreElement.textContent = score;
    }

    updateLevel(level) {
        const levelElement = document.getElementById('level');
        const finalLevelElement = document.getElementById('final-level');
        if (levelElement) levelElement.textContent = level;
        if (finalLevelElement) finalLevelElement.textContent = level;
    }

    updateLives(lives) {
        const livesElement = document.getElementById('lives');
        if (livesElement) livesElement.textContent = lives;
    }
}

// Word Manager - Handles word operations
class WordManager {
    constructor() {
        this.wordsByLength = null;
        this.sentencesByDifficulty = null;
        this.currentWordList = [];
    }

    initialize() {
        console.log('Word Manager initialized');
        this.loadWords();
    }

    loadWords() {
        if (window.CommonWordsLibrary) {
            this.wordsByLength = window.CommonWordsLibrary.wordsByLength;
            this.sentencesByDifficulty = window.CommonWordsLibrary.sentencesByDifficulty;
            console.log('Words loaded from Common Library');
        } else {
            // Fallback words
            this.wordsByLength = {
                3: ['CAT', 'DOG', 'SUN'],
                4: ['BOOK', 'GAME', 'PLAY'],
                5: ['HOUSE', 'TRAIN', 'MUSIC']
            };
            console.warn('Using fallback words');
        }
    }

    getRandomWord(length) {
        if (this.wordsByLength && this.wordsByLength[length]) {
            const words = this.wordsByLength[length];
            return words[Math.floor(Math.random() * words.length)];
        }
        return 'WORD';
    }

    getRandomWords(length, count) {
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(this.getRandomWord(length));
        }
        return words;
    }

    getRandomSentence(difficulty = 'easy') {
        if (this.sentencesByDifficulty && this.sentencesByDifficulty[difficulty]) {
            const sentences = this.sentencesByDifficulty[difficulty];
            return sentences[Math.floor(Math.random() * sentences.length)];
        }
        return 'The quick brown fox jumps over the lazy dog.';
    }
}

// Sound Manager - Handles audio
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
    }

    initialize() {
        console.log('Sound Manager initialized');
        // Initialize sound effects here
    }

    playSound(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
    }
}

// Navigation functions (kept for compatibility)
function goHome() {
    window.location.href = '../index.html';
}

function goBack() {
    window.history.back();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game 4 - Modular version loaded');
    window.gameEngine = new Game4Engine();
});
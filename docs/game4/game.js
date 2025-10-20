// Game 4 - Improved Brain Training Games
// Clean, modular architecture with proper UI management

class GameEngine {
    constructor() {
        this.currentMode = null;
        this.selectedGameMode = null;
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            level: 1,
            lives: 3,
            timer: 0,
            startTime: null
        };
        
        this.ui = new UIManager();
        this.sounds = new SoundManager();
        this.stats = new StatsManager();
        
        this.timerInterval = null;
        
        this.initialize();
    }

    initialize() {
        console.log('Game Engine initializing...');
        
        // Get selected mode from localStorage
        this.selectedGameMode = localStorage.getItem('selectedGameMode') || 'brain-chain';
        
        // Initialize managers
        this.ui.initialize();
        this.sounds.initialize();
        this.stats.initialize();
        
        // Start the selected game mode
        this.startGameMode(this.selectedGameMode);
    }

    startGameMode(modeId) {
        console.log('Starting game mode:', modeId);
        
        // Initialize the specific game mode
        switch(modeId) {
            case 'brain-chain':
                this.currentMode = new BrainChainCalculator(this);
                break;
            case 'speed-math':
                this.currentMode = new SpeedMath(this);
                break;
            case 'pattern-memory':
                this.currentMode = new PatternMemory(this);
                break;
            default:
                this.currentMode = new BrainChainCalculator(this);
        }
        
        // Reset game state
        this.resetGameState();
        
        // Start the game mode
        this.currentMode.start();
        
        // Start timer
        this.startTimer();
    }

    resetGameState() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            level: 1,
            lives: 3,
            timer: 0,
            startTime: Date.now()
        };
        
        this.ui.updateAllStats(this.gameState);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.gameState.isPaused && this.gameState.isPlaying) {
                this.gameState.timer = Date.now() - this.gameState.startTime;
                this.ui.updateTimer(this.gameState.timer);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        if (this.currentMode && this.currentMode.togglePause) {
            this.currentMode.togglePause();
        }
        
        if (this.gameState.isPaused) {
            this.ui.showPauseScreen();
        } else {
            this.ui.hidePauseScreen();
        }
        
        this.ui.updatePauseButton(this.gameState.isPaused);
    }

    updateScore(points) {
        this.gameState.score += points;
        this.ui.updateScore(this.gameState.score);
    }

    updateLevel(newLevel) {
        this.gameState.level = newLevel;
        this.ui.updateLevel(this.gameState.level);
    }

    updateLives(newLives) {
        this.gameState.lives = newLives;
        this.ui.updateLives(this.gameState.lives);
    }

    endGame() {
        this.gameState.isPlaying = false;
        this.stopTimer();
        
        if (this.currentMode && this.currentMode.end) {
            this.currentMode.end();
        }
        
        // Save stats
        this.stats.saveGameStats(this.gameState, this.selectedGameMode);
        
        // Show game over screen
        this.ui.showGameOverScreen(this.gameState);
    }

    restartGame() {
        this.ui.hideGameOverScreen();
        this.ui.hidePauseScreen();
        this.stopTimer();
        this.startGameMode(this.selectedGameMode);
    }

    quitToModeSelection() {
        this.stopTimer();
        if (this.currentMode && this.currentMode.cleanup) {
            this.currentMode.cleanup();
        }
        window.location.href = 'mode-selection.html';
    }

    quitToHome() {
        this.stopTimer();
        if (this.currentMode && this.currentMode.cleanup) {
            this.currentMode.cleanup();
        }
        window.location.href = '../index.html';
    }
}

// Base Game Mode Class
class GameMode {
    constructor(engine) {
        this.engine = engine;
        this.name = "Base Mode";
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.engine.gameState.isPlaying = true;
        console.log(`${this.name} started`);
    }

    end() {
        this.isActive = false;
        console.log(`${this.name} ended`);
    }

    togglePause() {
        // Override in child classes
    }

    cleanup() {
        this.isActive = false;
    }
}

// Brain Chain Calculator Game Mode
class BrainChainCalculator extends GameMode {
    constructor(engine) {
        super(engine);
        this.name = "Brain Chain Calculator";
        
        // Game state
        this.currentEquation = null;
        this.previousAnswer = null;
        this.equationHistory = [];
        this.currentStep = 1;
        this.maxSteps = 5;
        this.difficulty = 1;
        
        // UI state
        this.showingEquation = true;
        this.waitingForAnswer = false;
    }

    start() {
        super.start();
        this.setupUI();
        this.showStartScreen();
    }

    setupUI() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = `
            <div class="brain-chain-game">
                <div id="start-screen" class="start-screen">
                    <h2 class="start-title">🧠 Brain Chain Calculator</h2>
                    <p class="start-description">
                        Train your memory and math skills! Remember the answer to the previous equation 
                        while solving the current one.
                    </p>
                    <button id="start-btn" class="game-btn btn-start">🚀 Start Training</button>
                </div>

                <div id="game-content" class="hidden">
                    <p class="game-description">
                        Remember the previous answer while solving the current equation!
                    </p>
                    
                    <div class="chain-progress">
                        <div class="progress-item">
                            <span class="progress-label">Step</span>
                            <span class="progress-value"><span id="current-step">1</span>/<span id="max-steps">${this.maxSteps}</span></span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Difficulty</span>
                            <span class="progress-value" id="difficulty-display">${this.difficulty}</span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Chain</span>
                            <span class="progress-value" id="chain-count">0</span>
                        </div>
                    </div>

                    <div class="equation-section">
                        <div class="previous-answer-display">
                            <div class="previous-label">Previous Answer:</div>
                            <div id="previous-answer" class="previous-value">—</div>
                        </div>

                        <div class="current-equation-display">
                            <div class="equation-label">Current Equation:</div>
                            <div id="equation-box" class="equation-box">
                                Ready to start...
                            </div>
                        </div>

                        <div class="answer-section">
                            <div class="answer-label">Your Answer:</div>
                            <input type="number" id="answer-input" class="answer-input" placeholder="?" disabled>
                            
                            <div class="game-buttons">
                                <button id="next-btn" class="game-btn btn-next">👁️ Next</button>
                                <button id="submit-btn" class="game-btn btn-submit hidden">✓ Submit</button>
                            </div>
                        </div>
                    </div>

                    <div class="game-instructions">
                        <div class="instructions-title">How to Play:</div>
                        <ol class="instructions-list">
                            <li>Study the equation and calculate the answer mentally</li>
                            <li>Click "Next" to hide the equation and see a new one</li>
                            <li>Remember your previous answer while solving the new equation</li>
                            <li>Enter the answer to the PREVIOUS equation</li>
                            <li>Complete the chain to advance to higher difficulties!</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;

        // Bind events
        this.bindEvents();
    }

    bindEvents() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Game buttons
        document.getElementById('next-btn').addEventListener('click', () => {
            this.handleNext();
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            this.handleSubmit();
        });

        // Enter key for input
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const submitBtn = document.getElementById('submit-btn');
                if (!submitBtn.classList.contains('hidden')) {
                    this.handleSubmit();
                }
            }
        });
    }

    showStartScreen() {
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-content').classList.add('hidden');
    }

    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-content').classList.remove('hidden');
        
        // Update game title
        document.getElementById('game-title').textContent = this.name;
        
        this.generateNewEquation();
        this.showEquation();
    }

    generateNewEquation() {
        const operators = ['+', '-', '*'];
        let num1, num2, operator, answer;
        
        // Generate based on difficulty
        switch(this.difficulty) {
            case 1:
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = operators[Math.floor(Math.random() * 2)]; // + and -
                break;
            case 2:
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = operators[Math.floor(Math.random() * 3)]; // +, -, *
                break;
            case 3:
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                operator = operators[Math.floor(Math.random() * 3)];
                break;
        }
        
        // Ensure subtraction doesn't go negative
        if (operator === '-' && num2 > num1) {
            [num1, num2] = [num2, num1];
        }
        
        // Calculate answer
        switch(operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
        }
        
        this.currentEquation = {
            num1, num2, operator, answer,
            expression: `${num1} ${operator} ${num2}`
        };
    }

    showEquation() {
        const equationBox = document.getElementById('equation-box');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const answerInput = document.getElementById('answer-input');
        
        equationBox.textContent = `${this.currentEquation.expression} = ?`;
        equationBox.classList.remove('hidden');
        
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
        answerInput.disabled = true;
        answerInput.value = '';
        
        this.showingEquation = true;
        this.waitingForAnswer = false;
    }

    hideEquation() {
        const equationBox = document.getElementById('equation-box');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const answerInput = document.getElementById('answer-input');
        
        equationBox.textContent = '? ? ? = ?';
        equationBox.classList.add('hidden');
        
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        answerInput.disabled = false;
        answerInput.focus();
        
        this.showingEquation = false;
        this.waitingForAnswer = true;
        
        // Update previous answer display if this isn't the first equation
        if (this.currentStep > 1) {
            document.getElementById('previous-answer').textContent = `Step ${this.currentStep - 1} answer`;
            document.getElementById('previous-answer').style.color = '#f39c12';
        }
    }

    handleNext() {
        if (this.showingEquation) {
            this.hideEquation();
        }
    }

    handleSubmit() {
        if (!this.waitingForAnswer) return;
        
        const userAnswer = parseInt(document.getElementById('answer-input').value);
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number!', 'error');
            return;
        }
        
        // Determine correct answer
        let correctAnswer;
        if (this.currentStep === 1) {
            correctAnswer = this.currentEquation.answer;
        } else {
            correctAnswer = this.equationHistory[this.equationHistory.length - 1].answer;
        }
        
        if (userAnswer === correctAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(correctAnswer);
        }
    }

    handleCorrectAnswer() {
        this.showFeedback('🎉 Correct!', 'success');
        this.engine.updateScore(10 * this.difficulty);
        
        // Store equation in history
        this.equationHistory.push(this.currentEquation);
        
        // Update previous answer display
        document.getElementById('previous-answer').textContent = this.currentEquation.answer;
        document.getElementById('previous-answer').style.color = '#2ecc71';
        
        this.currentStep++;
        document.getElementById('current-step').textContent = this.currentStep;
        
        // Check if chain is complete
        if (this.currentStep > this.maxSteps) {
            this.completeChain();
        } else {
            // Generate next equation
            setTimeout(() => {
                this.generateNewEquation();
                this.showEquation();
            }, 1000);
        }
    }

    handleWrongAnswer(correctAnswer) {
        this.showFeedback(`❌ Wrong! Answer was ${correctAnswer}`, 'error');
        this.engine.updateLives(this.engine.gameState.lives - 1);
        
        if (this.engine.gameState.lives <= 0) {
            setTimeout(() => {
                this.engine.endGame();
            }, 1500);
        } else {
            // Continue but restart chain
            setTimeout(() => {
                this.restartChain();
            }, 1500);
        }
    }

    completeChain() {
        const bonus = 50 * this.difficulty;
        this.showFeedback(`🏆 Chain Complete! Bonus: ${bonus} points!`, 'bonus');
        this.engine.updateScore(bonus);
        
        // Increase difficulty
        this.difficulty = Math.min(this.difficulty + 1, 3);
        document.getElementById('difficulty-display').textContent = this.difficulty;
        
        // Update chain count
        const chainCount = parseInt(document.getElementById('chain-count').textContent) + 1;
        document.getElementById('chain-count').textContent = chainCount;
        
        // Level up
        this.engine.updateLevel(this.engine.gameState.level + 1);
        
        setTimeout(() => {
            this.restartChain();
        }, 2500);
    }

    restartChain() {
        this.currentStep = 1;
        this.equationHistory = [];
        document.getElementById('current-step').textContent = this.currentStep;
        document.getElementById('previous-answer').textContent = '—';
        document.getElementById('previous-answer').style.color = '#f39c12';
        
        this.generateNewEquation();
        this.showEquation();
    }

    showFeedback(message, type) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create new feedback
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        // Auto-remove after delay
        setTimeout(() => {
            if (feedback && feedback.parentNode) {
                feedback.remove();
            }
        }, type === 'bonus' ? 3000 : 2000);
    }

    togglePause() {
        // Disable/enable inputs during pause
        const answerInput = document.getElementById('answer-input');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (this.engine.gameState.isPaused) {
            if (answerInput) answerInput.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            if (submitBtn) submitBtn.disabled = true;
        } else {
            if (answerInput && this.waitingForAnswer) answerInput.disabled = false;
            if (nextBtn && this.showingEquation) nextBtn.disabled = false;
            if (submitBtn && this.waitingForAnswer) submitBtn.disabled = false;
        }
    }

    cleanup() {
        super.cleanup();
        // Clean up any specific resources
    }
}

// Placeholder for other game modes
class SpeedMath extends GameMode {
    constructor(engine) {
        super(engine);
        this.name = "Speed Math";
    }

    start() {
        super.start();
        document.getElementById('game-area').innerHTML = `
            <div class="text-center">
                <h2>⚡ Speed Math</h2>
                <p>Coming soon! This mode will test your calculation speed.</p>
                <button onclick="window.gameEngine.quitToModeSelection()" class="game-btn btn-start">
                    🎮 Back to Modes
                </button>
            </div>
        `;
    }
}

class PatternMemory extends GameMode {
    constructor(engine) {
        super(engine);
        this.name = "Pattern Memory";
    }

    start() {
        super.start();
        document.getElementById('game-area').innerHTML = `
            <div class="text-center">
                <h2>🎯 Pattern Memory</h2>
                <p>Coming soon! This mode will challenge your pattern recognition.</p>
                <button onclick="window.gameEngine.quitToModeSelection()" class="game-btn btn-start">
                    🎮 Back to Modes
                </button>
            </div>
        `;
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.elements = {};
    }

    initialize() {
        console.log('UI Manager initialized');
        this.bindGlobalEvents();
    }

    bindGlobalEvents() {
        // Pause button
        document.getElementById('pause-btn').addEventListener('click', () => {
            window.gameEngine.togglePause();
        });

        // Quit button
        document.getElementById('quit-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to quit?')) {
                window.gameEngine.quitToModeSelection();
            }
        });

        // Game over screen buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            window.gameEngine.restartGame();
        });

        document.getElementById('change-mode-btn').addEventListener('click', () => {
            window.gameEngine.quitToModeSelection();
        });

        document.getElementById('main-menu-btn').addEventListener('click', () => {
            window.gameEngine.quitToHome();
        });

        // Pause screen buttons
        document.getElementById('resume-btn').addEventListener('click', () => {
            window.gameEngine.togglePause();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            if (confirm('Restart the current game?')) {
                window.gameEngine.restartGame();
            }
        });

        document.getElementById('pause-quit-btn').addEventListener('click', () => {
            if (confirm('Quit to mode selection?')) {
                window.gameEngine.quitToModeSelection();
            }
        });
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

    updateTimer(timeMs) {
        const timerElement = document.getElementById('timer');
        const finalTimeElement = document.getElementById('final-time');
        const timeStr = this.formatTime(timeMs);
        if (timerElement) timerElement.textContent = timeStr;
        if (finalTimeElement) finalTimeElement.textContent = timeStr;
    }

    updatePauseButton(isPaused) {
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
        }
    }

    updateAllStats(gameState) {
        this.updateScore(gameState.score);
        this.updateLevel(gameState.level);
        this.updateLives(gameState.lives);
        this.updateTimer(gameState.timer);
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    showGameOverScreen(gameState) {
        document.getElementById('game-over-screen').classList.remove('hidden');
    }

    hideGameOverScreen() {
        document.getElementById('game-over-screen').classList.add('hidden');
    }

    showPauseScreen() {
        document.getElementById('pause-screen').classList.remove('hidden');
    }

    hidePauseScreen() {
        document.getElementById('pause-screen').classList.add('hidden');
    }
}

// Sound Manager
class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = {};
    }

    initialize() {
        console.log('Sound Manager initialized');
    }

    playSound(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            this.sounds[soundName].play().catch(e => console.log('Sound play failed'));
        }
    }
}

// Stats Manager
class StatsManager {
    constructor() {
        this.storageKey = 'game4-stats';
    }

    initialize() {
        console.log('Stats Manager initialized');
    }

    saveGameStats(gameState, gameMode) {
        const stats = this.getStats();
        
        // Update stats
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.totalTimePlayed = (stats.totalTimePlayed || 0) + gameState.timer;
        
        if (gameState.score > (stats.bestScore || 0)) {
            stats.bestScore = gameState.score;
        }
        
        // Mode-specific stats
        if (!stats.modes) stats.modes = {};
        if (!stats.modes[gameMode]) stats.modes[gameMode] = { plays: 0, bestScore: 0 };
        
        stats.modes[gameMode].plays++;
        if (gameState.score > stats.modes[gameMode].bestScore) {
            stats.modes[gameMode].bestScore = gameState.score;
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(stats));
        
        // Also update the separate keys for mode selection page
        localStorage.setItem('game4-games-played', stats.gamesPlayed);
        localStorage.setItem('game4-best-score', stats.bestScore);
        localStorage.setItem('game4-time-played', stats.totalTimePlayed);
    }

    getStats() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch {
            return {};
        }
    }
}

// Navigation functions
function goToModeSelection() {
    if (window.gameEngine) {
        window.gameEngine.quitToModeSelection();
    } else {
        window.location.href = 'mode-selection.html';
    }
}

function goHome() {
    if (window.gameEngine) {
        window.gameEngine.quitToHome();
    } else {
        window.location.href = '../index.html';
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game page loaded, initializing...');
    window.gameEngine = new GameEngine();
});
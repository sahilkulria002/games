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
        this.equations = [];
        this.currentRowIndex = 0;
        this.maxVisibleRows = 4;
        this.difficulty = 1;
        this.chainCount = 0;
        this.rowsPerChain = 12; // 12 rows = 10 answered equations (since first 2 aren't answered)
        this.stepsBack = 2; // Default steps back
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
                        Solve equations row by row. Remember previous answers while new equations appear!
                    </p>
                    
                    <div class="start-settings">
                        <label for="start-steps-selector" class="start-label">Choose Your Challenge:</label>
                        <select id="start-steps-selector" class="start-steps-selector">
                            <option value="1">1 Step Back - Beginner</option>
                            <option value="2" selected>2 Steps Back - Easy</option>
                            <option value="3">3 Steps Back - Medium</option>
                            <option value="4">4 Steps Back - Hard</option>
                            <option value="5">5 Steps Back - Expert</option>
                            <option value="6">6 Steps Back - Master</option>
                        </select>
                    </div>
                    
                    <button id="start-btn" class="game-btn btn-start">🚀 Start Training</button>
                </div>

                <div id="game-content" class="hidden">
                    <div class="equations-container" id="equations-container">
                        <!-- Equation rows will be added here dynamically -->
                    </div>

                    <div class="game-instructions">
                        <div class="instructions-title">How to Play:</div>
                        <ol class="instructions-list">
                            <li>Study the first equation and calculate mentally</li>
                            <li>Click "Next" to reveal more equations</li>
                            <li>When answer boxes become active, enter previous answers</li>
                            <li>Solve equations by remembering answers from previous rows</li>
                            <li>Choose your difficulty: 1-6 steps back to remember</li>
                            <li>Complete 12 rows to finish each level!</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;

        // Bind events
        this.bindEvents();
        
        // Initialize dropdown
        this.initializeDropdown();
    }

    initializeDropdown() {
        const dropdown = document.getElementById('steps-back-selector');
        if (dropdown) {
            dropdown.value = this.stepsBack;
        }
    }

    bindEvents() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            // Get selected difficulty from start screen
            const startSelector = document.getElementById('start-steps-selector');
            if (startSelector) {
                this.stepsBack = parseInt(startSelector.value);
                // Sync with header selector
                const headerSelector = document.getElementById('steps-back-selector');
                if (headerSelector) {
                    headerSelector.value = this.stepsBack;
                }
            }
            this.startGame();
        });

        // Steps back selector (header)
        document.getElementById('steps-back-selector').addEventListener('change', (e) => {
            this.updateStepsBack(parseInt(e.target.value));
        });
        
        // Start screen steps selector
        const startSelector = document.getElementById('start-steps-selector');
        if (startSelector) {
            startSelector.addEventListener('change', (e) => {
                // Sync with header selector
                const headerSelector = document.getElementById('steps-back-selector');
                if (headerSelector) {
                    headerSelector.value = e.target.value;
                }
            });
        }
        
        // Handle window resize for mobile button
        window.addEventListener('resize', () => {
            if (this.equations.length > 0) {
                this.updateMobileActionButton();
            }
        });
    }

    updateStepsBack(newStepsBack) {
        // Only allow changes if game hasn't started or no rows exist
        if (this.equations.length === 0) {
            this.stepsBack = newStepsBack;
            this.showFeedback(`Memory challenge set to ${newStepsBack} step${newStepsBack > 1 ? 's' : ''} back!`, 'success');
        } else {
            // Reset selector to current value
            document.getElementById('steps-back-selector').value = this.stepsBack;
            this.showFeedback('Cannot change during gameplay! Finish current level first.', 'error');
        }
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
        
        // Start the timer now that actual gameplay begins
        this.engine.startTimer();
        
        // Create first equation row
        this.createNewRow();
    }

    returnToStartScreen() {
        // Stop and reset timer
        this.engine.stopTimer();
        this.engine.gameState.timeElapsed = 0;
        this.engine.updateTimer();
        
        // Remove mobile action button
        this.removeMobileActionButton();
        
        // Reset game state
        this.equations = [];
        this.currentRowIndex = 0;
        this.chainCount = 0;
        this.answeredRows = 0;
        
        // Clear equations container
        const container = document.getElementById('equations-container');
        if (container) {
            container.innerHTML = '';
        }
        
        // Show start screen, hide game content
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-content').classList.add('hidden');
        
        // Reset title
        document.getElementById('game-title').textContent = 'Brain Chain Calculator';
        
        // Sync selectors
        const startSelector = document.getElementById('start-steps-selector');
        const headerSelector = document.getElementById('steps-back-selector');
        if (startSelector && headerSelector) {
            startSelector.value = this.stepsBack;
        }
    }

    generateEquation() {
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
        
        return {
            num1, num2, operator, answer,
            expression: `${num1} ${operator} ${num2}`,
            id: this.equations.length
        };
    }

    createNewRow() {
        const equation = this.generateEquation();
        this.equations.push(equation);
        
        const container = document.getElementById('equations-container');
        const rowDiv = document.createElement('div');
        rowDiv.className = 'equation-row';
        rowDiv.id = `row-${equation.id}`;
        
        // Determine button type and state
        let buttonHtml;
        
        // Show "Next" button for rows that don't have answer boxes (first stepsBack rows)
        // Show "Submit" button for rows that have answer boxes (stepsBack and beyond)
        if (equation.id < this.stepsBack) {
            // Rows without answer boxes: Next button
            buttonHtml = `<button class="row-btn btn-next" onclick="window.gameEngine.currentMode.handleNext(${equation.id})">Next →</button>`;
        } else {
            // Rows with answer boxes: Submit button
            buttonHtml = `<button class="row-btn btn-submit" onclick="window.gameEngine.currentMode.handleSubmit(${equation.id})">Submit</button>`;
        }
        
        rowDiv.innerHTML = `
            <div class="row-content">
                <div class="expression-box">
                    <span class="expression-text">${equation.expression}</span>
                </div>
                <div class="equals-box">
                    <span class="equals-text">=</span>
                </div>
                <div class="answer-box">
                    <input type="number" 
                           class="answer-input" 
                           id="answer-${equation.id}" 
                           placeholder="?"
                           disabled>
                </div>
                <div class="button-box">
                    ${buttonHtml}
                </div>
            </div>
        `;
        
        container.appendChild(rowDiv);
        
        // Add mobile action button for small screens
        this.updateMobileActionButton();
        
        // Hide expressions of previous rows (except current one)
        this.hideOldExpressions();
        
        // Activate answer box for the row that's N steps back
        if (equation.id >= this.stepsBack) {
            this.activateAnswerBox(equation.id - this.stepsBack);
        }
        
        // Convert previous row's Next button to inactive Submit if it exists
        if (equation.id >= this.stepsBack) {
            this.convertToInactiveSubmit(equation.id - 1);
        }
        
        // Update current row display
        document.getElementById('current-row').textContent = equation.id + 1;
        document.getElementById('difficulty').textContent = this.stepsBack; // Show steps-back as difficulty
        
        // Scroll to show the new row if needed
        this.scrollToLatestRows();
        
        // Add enter key handler for answer input
        const answerInput = document.getElementById(`answer-${equation.id}`);
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !answerInput.disabled) {
                this.handleEnterKey(equation.id);
            }
        });
    }

    hideOldExpressions() {
        // Show expressions for: newest row + all answered rows
        this.equations.forEach((eq, index) => {
            const expressionBox = document.querySelector(`#row-${eq.id} .expression-text`);
            const expressionContainer = document.querySelector(`#row-${eq.id} .expression-box`);
            
            if (expressionBox && expressionContainer) {
                const isNewestRow = index === this.equations.length - 1;
                
                // Check if this row has been answered (has correct or wrong class on answer input)
                const answerInput = document.getElementById(`answer-${eq.id}`);
                const isAnswered = answerInput && (answerInput.classList.contains('correct') || answerInput.classList.contains('wrong'));
                
                if (isNewestRow) {
                    // Newest row: always show expression (player needs to see what to calculate)
                    expressionBox.textContent = eq.expression;
                    expressionContainer.classList.remove('hidden-expression');
                    expressionContainer.classList.remove('answered-expression');
                } else if (isAnswered) {
                    // Answered row: show expression with answered styling
                    expressionBox.textContent = eq.expression;
                    expressionContainer.classList.remove('hidden-expression');
                    expressionContainer.classList.add('answered-expression');
                } else {
                    // Unanswered rows (including current active answer box): hide expression
                    expressionBox.textContent = '? ? ?';
                    expressionContainer.classList.add('hidden-expression');
                    expressionContainer.classList.remove('answered-expression');
                }
            }
        });
    }

    convertToInactiveSubmit(rowId) {
        const button = document.querySelector(`#row-${rowId} .row-btn`);
        if (button) {
            button.textContent = 'Submit';
            button.className = 'row-btn btn-submit inactive';
            button.onclick = null;
            button.disabled = true;
        }
    }

    handleNext(rowId) {
        // Convert Next button to Submit button (inactive)
        const button = document.querySelector(`#row-${rowId} .row-btn`);
        button.textContent = 'Submit';
        button.className = 'row-btn btn-submit inactive';
        button.onclick = null;
        button.disabled = true;
        
        // Create new row
        this.createNewRow();
    }

    handleSubmit(rowId) {
        // Get the answer for the row that should be answered (rowId - stepsBack)
        const answerRowId = rowId - this.stepsBack;
        if (answerRowId < 0) return;
        
        const answerInput = document.getElementById(`answer-${answerRowId}`);
        const userAnswer = parseInt(answerInput.value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number!', 'error');
            answerInput.focus();
            return;
        }
        
        const correctAnswer = this.equations[answerRowId].answer;
        
        if (userAnswer === correctAnswer) {
            this.handleCorrectAnswer(answerRowId, rowId);
        } else {
            this.handleWrongAnswer(answerRowId, correctAnswer, rowId);
        }
    }

    handleCorrectAnswer(answeredRowId, currentRowId) {
        this.showFeedback('🎉 Correct!', 'success');
        this.engine.updateScore(15 * this.difficulty); // Increased points per correct answer
        
        // Mark answer as correct
        const answerInput = document.getElementById(`answer-${answeredRowId}`);
        answerInput.classList.add('correct');
        answerInput.disabled = true;
        
        // Deactivate current submit button
        const button = document.querySelector(`#row-${currentRowId} .row-btn`);
        button.classList.add('inactive');
        button.onclick = null;
        
        // Update expression visibility to show the answered row
        this.hideOldExpressions();
        
        // Check if we've completed a chain (12 equations with enough answers based on steps-back)
        const minAnswersNeeded = this.rowsPerChain - this.stepsBack;
        if (currentRowId >= this.rowsPerChain - 1 && this.answeredRows >= minAnswersNeeded) {
            setTimeout(() => {
                this.completeChain();
            }, 1000);
        } else {
            // Create next row
            setTimeout(() => {
                this.createNewRow();
            }, 500);
        }
    }

    handleWrongAnswer(answeredRowId, correctAnswer, currentRowId) {
        this.showFeedback(`❌ Wrong! Answer was ${correctAnswer}`, 'error');
        this.engine.updateLives(this.engine.gameState.lives - 1);
        
        // Mark answer as wrong
        const answerInput = document.getElementById(`answer-${answeredRowId}`);
        answerInput.classList.add('wrong');
        answerInput.value = correctAnswer;
        answerInput.disabled = true;
        
        // Deactivate current submit button
        const button = document.querySelector(`#row-${currentRowId} .row-btn`);
        button.classList.add('inactive');
        button.onclick = null;
        button.disabled = true;
        
        // Update expression visibility to show the answered row
        this.hideOldExpressions();
        
        if (this.engine.gameState.lives <= 0) {
            setTimeout(() => {
                this.engine.endGame();
            }, 1500);
        } else {
            // Continue with next row
            setTimeout(() => {
                this.createNewRow();
            }, 1500);
        }
    }

    completeChain() {
        const bonus = 100 * this.difficulty; // Increased bonus for longer chains
        const answeredCount = this.rowsPerChain - 2; // Actual equations answered
        this.showFeedback(`🏆 Level Complete! ${answeredCount} equations solved! Bonus: ${bonus} points!`, 'bonus');
        this.engine.updateScore(bonus);
        
        // Increase difficulty and chain count
        this.difficulty = Math.min(this.difficulty + 1, 3);
        this.chainCount++;
        
        document.getElementById('chain-count').textContent = this.chainCount;
        this.engine.updateLevel(this.engine.gameState.level + 1);
        
        setTimeout(() => {
            this.startNewChain();
        }, 2500);
    }

    startNewChain() {
        // Clear all rows
        const container = document.getElementById('equations-container');
        container.innerHTML = '';
        
        // Reset state
        this.equations = [];
        this.currentRowIndex = 0;
        
        // Start with first row
        this.createNewRow();
    }

    updateMobileActionButton() {
        // Remove existing mobile button
        const existingBtn = document.querySelector('.mobile-action-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Only add on mobile screens
        if (window.innerWidth <= 480) {
            const currentRow = this.equations[this.equations.length - 1];
            if (currentRow) {
                const button = document.createElement('button');
                button.className = 'mobile-action-btn';
                
                if (currentRow.id < this.stepsBack) {
                    // Next button
                    button.innerHTML = '→';
                    button.onclick = () => this.handleNext(currentRow.id);
                } else {
                    // Submit button
                    button.innerHTML = '✓';
                    button.className += ' submit-btn';
                    button.onclick = () => this.handleSubmit(currentRow.id);
                }
                
                document.body.appendChild(button);
            }
        }
    }

    removeMobileActionButton() {
        const existingBtn = document.querySelector('.mobile-action-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
    }

    activateAnswerBox(rowId) {
        // First, deactivate all answer boxes
        document.querySelectorAll('.answer-input.active').forEach(input => {
            input.classList.remove('active');
        });
        
        // Then activate only the specific one
        const answerInput = document.getElementById(`answer-${rowId}`);
        if (answerInput && !answerInput.classList.contains('correct') && !answerInput.classList.contains('wrong')) {
            answerInput.disabled = false;
            answerInput.classList.add('active');
            answerInput.focus();
        }
    }

    deactivateButton(rowId) {
        const button = document.querySelector(`#row-${rowId} .row-btn`);
        if (button) {
            button.classList.add('inactive');
            button.disabled = true;
        }
    }

    scrollToLatestRows() {
        const container = document.getElementById('equations-container');
        const lastRow = container.lastElementChild;
        
        if (lastRow && this.equations.length > 2) {
            // Only scroll if we have more than 2 rows
            setTimeout(() => {
                // Get container and row dimensions
                const containerRect = container.getBoundingClientRect();
                const rowRect = lastRow.getBoundingClientRect();
                const margin = 40; // Space below the new row
                
                // Check if the row is not fully visible
                const isRowFullyVisible = (
                    rowRect.top >= containerRect.top &&
                    rowRect.bottom <= containerRect.bottom - margin
                );
                
                if (!isRowFullyVisible) {
                    // Calculate optimal scroll position
                    const containerScrollTop = container.scrollTop;
                    const rowOffsetTop = lastRow.offsetTop;
                    const containerHeight = container.clientHeight;
                    const rowHeight = lastRow.offsetHeight;
                    
                    // Position the row near the bottom with margin
                    const targetScrollTop = rowOffsetTop - containerHeight + rowHeight + margin;
                    
                    // Smooth scroll to the calculated position
                    container.scrollTo({
                        top: Math.max(0, targetScrollTop),
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    handleEnterKey(rowId) {
        // Find the active submit button
        const buttons = document.querySelectorAll('.btn-submit:not(.inactive)');
        if (buttons.length > 0) {
            const activeButton = buttons[0];
            const buttonRowId = parseInt(activeButton.closest('.equation-row').id.split('-')[1]);
            this.handleSubmit(buttonRowId);
        }
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
        // Disable/enable all inputs and buttons during pause
        const inputs = document.querySelectorAll('.answer-input');
        const buttons = document.querySelectorAll('.row-btn');
        
        inputs.forEach(input => {
            if (this.engine.gameState.isPaused) {
                input.dataset.wasDisabled = input.disabled;
                input.disabled = true;
            } else {
                input.disabled = input.dataset.wasDisabled === 'true';
            }
        });
        
        buttons.forEach(button => {
            if (this.engine.gameState.isPaused) {
                button.dataset.wasDisabled = button.disabled;
                button.disabled = true;
            } else {
                button.disabled = button.dataset.wasDisabled === 'true';
            }
        });
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
            if (confirm('Return to start screen?')) {
                window.gameEngine.currentMode.returnToStartScreen();
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
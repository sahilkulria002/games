const NUM_COLS = 6;
let FALL_SPEED = 2; // pixels per frame, now adjustable
let SPAWN_RATE = 30; // letters per minute
let SPAWN_INTERVAL = 1200; // ms, calculated based on spawn rate
const LIVES_START = 5;

// Function to calculate spawn interval based on spawn rate (letters per minute)
function getSpawnInterval(lettersPerMinute) {
    // Convert letters per minute to milliseconds between spawns
    // 60 letters/min = 1000ms interval
    // 10 letters/min = 6000ms interval
    return Math.round(60000 / lettersPerMinute);
}

// Legacy function for backward compatibility (now just calls getSpawnInterval with current rate)
function getSpawnIntervalFromSpeed(speed) {
    return getSpawnInterval(SPAWN_RATE);
}


let score = 0;
let lives = LIVES_START;
let gameActive = true;
let fallingLetters = [];
let spawnTimer;


const columns = Array.from(document.querySelectorAll('.column'));
const scoreEl = document.getElementById('score-main');
const livesEl = document.getElementById('lives-main');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const speedRange = document.getElementById('speed-range');
const speedValue = document.getElementById('speed-value');
const modeSelect = document.getElementById('game-mode');
const textPanel = document.getElementById('text-panel');
const customTextArea = document.getElementById('custom-text');
// startTextModeBtn removed - using universal start button
const textProgress = document.getElementById('text-progress');

let mode = 'middle';
let customText = '';
let textIndex = 0;
let gameStarted = false;

// Universal top controls (main buttons)
const btnUpper = document.getElementById('btn-upper-main');
const btnMiddle = document.getElementById('btn-middle-main');
const btnLower = document.getElementById('btn-lower-main');
const btnAll = document.getElementById('btn-all-main');
const btnKeyboard = document.getElementById('btn-keyboard-main');
const btnText = document.getElementById('btn-text-main');
const startGameBtn = document.getElementById('start-game-main');
const modeBtns = [btnUpper, btnMiddle, btnLower, btnAll, btnKeyboard, btnText];

// Note: Side panel start/pause buttons removed - using only top bar buttons

// Keyboard mode elements
const topControls = document.getElementById('top-controls');
const bottomControls = document.getElementById('bottom-controls');
const keyboardGameBoard = document.getElementById('keyboard-game-board');
const mainLayout = document.querySelector('.main-layout');

// Keyboard layout for positioning
const KEYBOARD_LAYOUT = {
    'Q': {row: 0, col: 0}, 'W': {row: 0, col: 1}, 'E': {row: 0, col: 2}, 'R': {row: 0, col: 3}, 'T': {row: 0, col: 4},
    'Y': {row: 0, col: 5}, 'U': {row: 0, col: 6}, 'I': {row: 0, col: 7}, 'O': {row: 0, col: 8}, 'P': {row: 0, col: 9},
    'A': {row: 1, col: 0}, 'S': {row: 1, col: 1}, 'D': {row: 1, col: 2}, 'F': {row: 1, col: 3}, 'G': {row: 1, col: 4},
    'H': {row: 1, col: 5}, 'J': {row: 1, col: 6}, 'K': {row: 1, col: 7}, 'L': {row: 1, col: 8},
    'Z': {row: 2, col: 0}, 'X': {row: 2, col: 1}, 'C': {row: 2, col: 2}, 'V': {row: 2, col: 3}, 'B': {row: 2, col: 4},
    'N': {row: 2, col: 5}, 'M': {row: 2, col: 6}
};

let isKeyboardMode = false;

// Define keyboard rows
const KEYBOARD_ROWS = {
    upper: 'QWERTYUIOP',
    middle: 'ASDFGHJKL',
    lower: 'ZXCVBNM',
    all: 'QWERTYUIOPASDFGHJKLZXCVBNM'
};

// Hide text panel initially
textPanel.style.display = 'none';

btnUpper.addEventListener('click', () => {
    mode = 'upper';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnUpper.classList.add('active');
    textPanel.style.display = 'none';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
    switchToNormalMode();
    stopGame();
});

btnMiddle.addEventListener('click', () => {
    mode = 'middle';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnMiddle.classList.add('active');
    textPanel.style.display = 'none';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
    switchToNormalMode();
    stopGame();
});

btnLower.addEventListener('click', () => {
    mode = 'lower';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnLower.classList.add('active');
    textPanel.style.display = 'none';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
    switchToNormalMode();
    stopGame();
});

btnAll.addEventListener('click', () => {
    mode = 'all';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnAll.classList.add('active');
    textPanel.style.display = 'none';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
    switchToNormalMode();
    stopGame();
});

btnKeyboard.addEventListener('click', () => {
    mode = 'keyboard';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnKeyboard.classList.add('active');
    textPanel.style.display = 'none';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
    switchToKeyboardMode();
    stopGame();
});

btnText.addEventListener('click', () => {
    mode = 'text';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnText.classList.add('active');
    textPanel.style.display = '';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
    switchToNormalMode();
    stopGame();
});

function stopGame() {
    gameActive = false;
    gameStarted = false;
    gamePaused = false;
    if (spawnTimer) clearInterval(spawnTimer);
    fallingLetters = [];
    if (isKeyboardMode) {
        keyboardGameBoard.innerHTML = '';
    } else {
        columns.forEach(col => col.innerHTML = '');
    }
    score = 0;
    lives = LIVES_START;
    updateAllScoreDisplays();
    gameOverEl.style.display = 'none';
    updatePauseButtonVisibility();
}

function switchToKeyboardMode() {
    console.log('Switching to keyboard mode');
    isKeyboardMode = true;
    
    // Hide universal top controls and show keyboard-specific ones
    const universalTopControls = document.getElementById('universal-top-controls');
    if (universalTopControls) universalTopControls.style.display = 'none';
    
    mainLayout.style.display = 'none';
    topControls.style.display = 'block';
    bottomControls.style.display = 'block';
    keyboardGameBoard.style.display = 'block';
    
    // Set up duplicate controls in top bar
    setupTopControls();
}

function switchToNormalMode() {
    console.log('Switching to normal mode');
    isKeyboardMode = false;
    
    // Show universal top controls and hide keyboard-specific ones
    const universalTopControls = document.getElementById('universal-top-controls');
    if (universalTopControls) universalTopControls.style.display = 'block';
    
    mainLayout.style.display = 'flex';
    topControls.style.display = 'none';
    bottomControls.style.display = 'none';
    keyboardGameBoard.style.display = 'none';
}

let topControlsSetup = false;

function setupTopControls() {
    if (topControlsSetup) return; // Only setup once
    
    // Sync top controls with main controls
    const topButtons = {
        'btn-upper-top': () => btnUpper.click(),
        'btn-middle-top': () => btnMiddle.click(),
        'btn-lower-top': () => btnLower.click(),
        'btn-all-top': () => btnAll.click(),
        'btn-keyboard-top': () => btnKeyboard.click(),
        'btn-text-top': () => btnText.click()
    };
    
    Object.entries(topButtons).forEach(([id, handler]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.removeEventListener('click', handler); // Remove existing
            btn.addEventListener('click', handler);
        }
    });
    
    const startGameTop = document.getElementById('start-game-top');
    if (startGameTop) {
        // Remove any existing listener and add new one
        startGameTop.onclick = () => {
            console.log('Top start button clicked');
            startGameBtn.click();
        };
    }
    
    topControlsSetup = true;
}

function updateAllScoreDisplays() {
    const scoreText = `Score: ${score}`;
    const livesText = `Lives: ${lives}`;
    
    // Update main top controls
    scoreEl.textContent = scoreText;
    livesEl.textContent = livesText;
    
    // Update side panel scores
    const scoreSide = document.getElementById('score');
    const livesSide = document.getElementById('lives');
    if (scoreSide) scoreSide.textContent = scoreText;
    if (livesSide) livesSide.textContent = livesText;
    
    // Update keyboard mode top controls
    const scoreTop = document.getElementById('score-top');
    const livesTop = document.getElementById('lives-top');
    if (scoreTop) scoreTop.textContent = scoreText;
    if (livesTop) livesTop.textContent = livesText;
}

if (speedRange && speedValue) {
    speedRange.addEventListener('input', (e) => {
        FALL_SPEED = Number(speedRange.value);
        speedValue.textContent = speedRange.value;
        updateAllSpeedControls();
    });
    // Set initial value
    speedValue.textContent = speedRange.value;
    FALL_SPEED = Number(speedRange.value);
}

// Top speed control for keyboard mode
const speedRangeTop = document.getElementById('speed-range-top');
const speedValueTop = document.getElementById('speed-value-top');
if (speedRangeTop && speedValueTop) {
    speedRangeTop.addEventListener('input', (e) => {
        FALL_SPEED = Number(speedRangeTop.value);
        speedValueTop.textContent = speedRangeTop.value;
        updateAllSpeedControls();
    });
    // Set initial value
    speedValueTop.textContent = speedRangeTop.value;
}

// Initialize spawn interval with default rate
SPAWN_INTERVAL = getSpawnInterval(SPAWN_RATE);

// Main spawn rate control
const spawnRateRange = document.getElementById('spawn-rate-range');
const spawnRateValue = document.getElementById('spawn-rate-value');
if (spawnRateRange && spawnRateValue) {
    spawnRateRange.addEventListener('input', (e) => {
        SPAWN_RATE = Number(spawnRateRange.value);
        spawnRateValue.textContent = spawnRateRange.value;
        updateAllSpawnRateControls();
        // Update spawn interval
        SPAWN_INTERVAL = getSpawnInterval(SPAWN_RATE);
        if (gameActive && spawnTimer) {
            clearInterval(spawnTimer);
            spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
        }
    });
    // Set initial value
    spawnRateValue.textContent = spawnRateRange.value;
    SPAWN_RATE = Number(spawnRateRange.value);
}

// Top spawn rate control for keyboard mode
const spawnRateRangeTop = document.getElementById('spawn-rate-range-top');
const spawnRateValueTop = document.getElementById('spawn-rate-value-top');
if (spawnRateRangeTop && spawnRateValueTop) {
    spawnRateRangeTop.addEventListener('input', (e) => {
        SPAWN_RATE = Number(spawnRateRangeTop.value);
        spawnRateValueTop.textContent = spawnRateRangeTop.value;
        updateAllSpawnRateControls();
        // Update spawn interval
        SPAWN_INTERVAL = getSpawnInterval(SPAWN_RATE);
        if (gameActive && spawnTimer) {
            clearInterval(spawnTimer);
            spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
        }
    });
    // Set initial value
    spawnRateValueTop.textContent = spawnRateRangeTop.value;
}

if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
        mode = modeSelect.value;
        if (mode === 'custom') {
            textPanel.style.display = '';
        } else {
            textPanel.style.display = 'none';
            customText = '';
            textIndex = 0;
            textProgress.textContent = '';
        }
        startGame();
    });
}

startGameBtn.addEventListener('click', () => {
    if (mode === 'custom') {
        // Handle text mode setup
        customText = (customTextArea.value || '').replace(/\s+/g, ' ').trim();
        textIndex = 0;
        if (customText.length === 0) {
            alert('Please enter some text first!');
            return;
        }
        textProgress.textContent = '';
        startGame();
    } else {
        // Handle all other modes
        startGame();
    }
});

// Text mode start button removed - now handled by universal start button

// Replace the default restart button logic
const restartBtn = document.getElementById('restart-btn');
if (restartBtn) {
    restartBtn.onclick = function() {
        gameOverEl.style.display = 'none';
        if (mode === 'custom' && customText && customText.length > 0) {
            textPanel.style.display = '';
            // Don't reset customText or textIndex, just restart
            textProgress.textContent = '';
            startGame();
        } else {
            startGame();
        }
    };
}

// Add menu button functionality
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
    menuBtn.onclick = function() {
        gameOverEl.style.display = 'none';
        
        // Reset game state
        stopGame();
        
        // Switch back to normal mode if in keyboard mode
        if (isKeyboardMode) {
            switchToNormalMode();
        }
        
        // Reset to middle row mode as default
        mode = 'middle';
        modeBtns.forEach(btn => btn.classList.remove('active'));
        btnMiddle.classList.add('active');
        
        // Hide text panel
        textPanel.style.display = 'none';
        customText = '';
        textIndex = 0;
        textProgress.textContent = '';
        
        // Reset pause state
        gamePaused = false;
        wasGameActiveBeforeBlur = false;
        updatePauseButtonVisibility();
        
        console.log('Returned to main menu');
    };
}

function randomLetter() {
    if (mode === 'custom' && customText && textIndex < customText.length) {
        return customText[textIndex];
    }
    // Use all letters for keyboard mode, otherwise use the specific mode
    let letters = mode === 'keyboard' ? KEYBOARD_ROWS.all : (KEYBOARD_ROWS[mode] || KEYBOARD_ROWS.middle);
    return letters[Math.floor(Math.random() * letters.length)];
}

function spawnLetter() {
    if (!gameActive || !gameStarted) return;
    
    if (isKeyboardMode) {
        spawnKeyboardLetter();
        return;
    }
    
    const colIdx = Math.floor(Math.random() * NUM_COLS);
    let letter = randomLetter();
    // Only spawn valid letters in columns
    while ((letter === '\n') || (mode === 'custom' && customText && textIndex < customText.length && letter === '')) {
        textIndex++;
        letter = randomLetter();
        if (mode !== 'custom' || textIndex >= (customText ? customText.length : 0)) break;
    }
    if (mode === 'custom' && customText && textIndex >= customText.length) return;
    const letterDiv = document.createElement('div');
    letterDiv.className = 'falling-letter';
    // Show special characters visually
    if (mode === 'custom') {
        if (letter === ' ') {
            letterDiv.innerHTML = '<span style="font-size:1.2em;">␣</span>';
        } else if (letter === '\t') {
            letterDiv.innerHTML = '<span style="font-size:1.2em;">⇥</span>';
        } else {
            letterDiv.textContent = letter;
        }
    } else {
        letterDiv.textContent = letter;
    }
    letterDiv.dataset.letter = letter;
    letterDiv.dataset.col = colIdx;
    letterDiv.style.top = '-70px';
    columns[colIdx].appendChild(letterDiv);
    fallingLetters.push({
        el: letterDiv,
        col: colIdx,
        letter: letter,
        y: -70, // Start above the top
        caught: false,
        seq: mode === 'custom' ? textIndex : undefined
    });
    if (mode === 'custom') textIndex++;
}

function spawnKeyboardLetter() {
    let letter = randomLetter();
    
    // Find the actual key element in the DOM to get its position
    const keyElements = document.querySelectorAll('.key');
    let targetKey = null;
    
    for (let keyEl of keyElements) {
        if (keyEl.textContent === letter.toUpperCase()) {
            targetKey = keyEl;
            break;
        }
    }
    
    if (!targetKey) return; // Skip if key not found
    
    const letterDiv = document.createElement('div');
    letterDiv.className = 'falling-letter'; // Use same class as normal mode
    letterDiv.textContent = letter;
    letterDiv.dataset.letter = letter;
    
    // Get the actual position of the key element
    const keyRect = targetKey.getBoundingClientRect();
    const boardRect = keyboardGameBoard.getBoundingClientRect();
    
    // Calculate position relative to the game board
    const xPosition = keyRect.left - boardRect.left + (keyRect.width / 2) - 25; // Center over the key
    
    letterDiv.style.left = xPosition + 'px';
    letterDiv.style.top = '-70px';
    
    keyboardGameBoard.appendChild(letterDiv);
    
    fallingLetters.push({
        el: letterDiv,
        letter: letter,
        y: -70,
        caught: false,
        isKeyboard: true
    });
}

function updateLetters() {
    for (let i = fallingLetters.length - 1; i >= 0; i--) {
        const obj = fallingLetters[i];
        if (obj.caught) continue;
        obj.y += FALL_SPEED;
        obj.el.style.top = obj.y + 'px';
        
        if (obj.isKeyboard) {
            // Keyboard mode - check if letter hit the visible danger zone (glowing line area)
            // Use 85% of the keyboard board height to match the visible border
            const dangerZone = keyboardGameBoard.offsetHeight * 0.85;
            if (obj.y + obj.el.offsetHeight >= dangerZone) {
                keyboardGameBoard.removeChild(obj.el);
                fallingLetters.splice(i, 1);
                loseLife();
            }
        } else {
            // Normal mode - check if letter hit bottom of column
            if (obj.y + obj.el.offsetHeight >= columns[obj.col].offsetHeight) {
                columns[obj.col].removeChild(obj.el);
                fallingLetters.splice(i, 1);
                loseLife();
            }
        }
    }
}

function loseLife() {
    lives--;
    updateAllScoreDisplays();
    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    gameStarted = false;
    clearInterval(spawnTimer);
    gameOverEl.style.display = 'flex';
    finalScoreEl.textContent = `Your Score: ${score}`;
    updatePauseButtonVisibility();
}

function gameLoop() {
    if (!gameActive) return;
    updateLetters();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (!gameActive && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== ' ' && e.key !== 'Spacebar') return;
    if (e.target.tagName === 'TEXTAREA' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== ' ' && e.key !== 'Spacebar') return; // Don't catch keys while typing text
    
    // Arrow key controls (work even when game is not active)
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (FALL_SPEED < 10) {
            FALL_SPEED++;
            updateAllSpeedControls();
        }
        return;
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (FALL_SPEED > 1) {
            FALL_SPEED--;
            updateAllSpeedControls();
        }
        return;
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (SPAWN_RATE < 60) {
            SPAWN_RATE++;
            updateAllSpawnRateControls();
            // Update spawn interval
            SPAWN_INTERVAL = getSpawnInterval(SPAWN_RATE);
            if (gameActive && spawnTimer) {
                clearInterval(spawnTimer);
                spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
            }
        }
        return;
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (SPAWN_RATE > 10) {
            SPAWN_RATE--;
            updateAllSpawnRateControls();
            // Update spawn interval
            SPAWN_INTERVAL = getSpawnInterval(SPAWN_RATE);
            if (gameActive && spawnTimer) {
                clearInterval(spawnTimer);
                spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
            }
        }
        return;
    }
    
    let key = e.key;
    if (key === ' ' || key === 'Spacebar') {
        // Don't pause if user is typing in textarea
        if (e.target.tagName === 'TEXTAREA') {
            // Allow spacebar for text input
            return;
        }
        // In Custom Text mode, treat space as a regular letter
        if (mode === 'custom' && gameStarted && customText) {
            // Let it fall through to normal letter handling
            key = ' '; // Ensure it's a space character
        } else {
            // Spacebar pauses/resumes the game for other modes
            e.preventDefault();
            if (gameStarted) {
                togglePause();
            }
            return;
        }
    }
    
    // Highlight keyboard key if in keyboard mode
    if (isKeyboardMode) {
        highlightKey(key.toUpperCase());
    }
    
    for (let i = 0; i < fallingLetters.length; i++) {
        const obj = fallingLetters[i];
        if (!obj.caught && obj.letter.toLowerCase() === key.toLowerCase()) {
            obj.caught = true;
            obj.el.classList.add('caught');
            setTimeout(() => {
                if (obj.el.parentNode) obj.el.parentNode.removeChild(obj.el);
                // Remove from array only after the visual effect
                const index = fallingLetters.indexOf(obj);
                if (index > -1) fallingLetters.splice(index, 1);
            }, 200);
            score++;
            updateAllScoreDisplays();
            if (mode === 'custom' && customText) {
                // Show progress
                let progress = '';
                for (let j = 0; j < customText.length; j++) {
                    let displayChar = customText[j];
                    if (displayChar === ' ') displayChar = '␣';
                    if (j < textIndex) {
                        // Already typed letters - green
                        progress += `<span style='color:#2ecc40;'>${displayChar}</span>`;
                    } else if (j === textIndex) {
                        // Current letter to type - green highlight
                        progress += `<span style='color:#2ecc40; background-color: rgba(46, 204, 64, 0.3);'>${displayChar}</span>`;
                    } else {
                        // Future letters - white
                        progress += `<span style='color:#fff;'>${displayChar}</span>`;
                    }
                }
                textProgress.innerHTML = progress;
                
                // Check if all text is completed (win condition)
                if (score >= customText.length) {
                    showWinMessage();
                }
            }
            break;
        }
    }
});

function showWinMessage() {
    gameActive = false;
    gameStarted = false;
    clearInterval(spawnTimer);
    
    const youWonEl = document.getElementById('you-won');
    youWonEl.style.display = 'flex';
    
    // Set up play again button
    const playAgainBtn = document.getElementById('play-again-btn');
    const menuBtnWin = document.getElementById('menu-btn-win');
    
    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            youWonEl.style.display = 'none';
            // Reset text mode
            textIndex = 0;
            score = 0;
            lives = LIVES_START;
            updateAllScoreDisplays();
            textProgress.innerHTML = '';
            startGame();
        };
    }
    
    if (menuBtnWin) {
        menuBtnWin.onclick = function() {
            youWonEl.style.display = 'none';
            
            // Reset game state
            stopGame();
            
            // Switch back to normal mode
            if (isKeyboardMode) {
                switchToNormalMode();
            }
            
            // Reset to middle row mode as default
            mode = 'middle';
            modeBtns.forEach(btn => btn.classList.remove('active'));
            btnMiddle.classList.add('active');
            
            // Hide text panel
            textPanel.style.display = 'none';
            customText = '';
            textIndex = 0;
            textProgress.textContent = '';
            
            // Reset pause state
            gamePaused = false;
            wasGameActiveBeforeBlur = false;
            updatePauseButtonVisibility();
        };
    }
}

function highlightKey(letter) {
    if (!isKeyboardMode) return;
    
    // Find the key element and highlight it
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (key.textContent === letter) {
            key.classList.add('active');
            setTimeout(() => {
                key.classList.remove('active');
            }, 300);
        }
    });
}

// Add speed slider to both left and right panels if not present
function addSpeedSlider(targetPanel, idSuffix) {
    if (targetPanel && !document.getElementById('speed-range-' + idSuffix)) {
        const speedDiv = document.createElement('div');
        speedDiv.className = 'speed-control-right';
        speedDiv.innerHTML = `
            <label for="speed-range-${idSuffix}" style="color:#a0e9ff;">Speed</label>
            <input type="range" id="speed-range-${idSuffix}" min="1" max="10" value="2">
            <span id="speed-value-${idSuffix}">2</span> px/frame
        `;
        targetPanel.appendChild(speedDiv);
        const speedRange = document.getElementById('speed-range-' + idSuffix);
        const speedValue = document.getElementById('speed-value-' + idSuffix);
        speedRange.addEventListener('input', (e) => {
            FALL_SPEED = Number(speedRange.value);
            speedValue.textContent = speedRange.value;
            SPAWN_INTERVAL = getSpawnInterval(FALL_SPEED);
            // Restart timer with new interval if game is active
            if (gameActive && spawnTimer) {
                clearInterval(spawnTimer);
                spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
            }
        });
        speedValue.textContent = speedRange.value;
        FALL_SPEED = Number(speedRange.value);
        SPAWN_INTERVAL = getSpawnInterval(FALL_SPEED);
    }
}

// Speed controls are now handled by the universal top bar only
// No need to add duplicate speed sliders to panels

// Remove spacebar as speed shortcut
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

function startGame() {
    score = 0;
    lives = LIVES_START;
    gameActive = true;
    gameStarted = true;
    gamePaused = false;
    fallingLetters = [];
    updateAllScoreDisplays();
    gameOverEl.style.display = 'none';
    updatePauseButtonVisibility();
    
    // Clear falling letters from both normal and keyboard modes
    if (isKeyboardMode) {
        keyboardGameBoard.innerHTML = '';
    } else {
        columns.forEach(col => col.innerHTML = '');
    }
    
    if (spawnTimer) clearInterval(spawnTimer);
    textIndex = 0;
    if (mode === 'custom' && customText) {
        textProgress.innerHTML = '';
    }
    SPAWN_INTERVAL = getSpawnInterval(SPAWN_RATE);
    spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
    requestAnimationFrame(gameLoop);
}

// Function to update all speed controls when using arrow keys
function updateAllSpeedControls() {
    const speedSliders = document.querySelectorAll('[id^="speed-range"], [id="speed-range"]');
    const speedValues = document.querySelectorAll('[id^="speed-value"], [id="speed-value"]');
    
    speedSliders.forEach(slider => {
        slider.value = FALL_SPEED;
    });
    
    speedValues.forEach(valueSpan => {
        valueSpan.textContent = FALL_SPEED;
    });
    
}

// Function to update all spawn rate controls
function updateAllSpawnRateControls() {
    const spawnRateSliders = document.querySelectorAll('[id^="spawn-rate-range"], [id="spawn-rate-range"]');
    const spawnRateValues = document.querySelectorAll('[id^="spawn-rate-value"], [id="spawn-rate-value"]');
    
    spawnRateSliders.forEach(slider => {
        slider.value = SPAWN_RATE;
    });
    
    spawnRateValues.forEach(valueSpan => {
        valueSpan.textContent = SPAWN_RATE;
    });
}

// Initialize top controls when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupTopControls();
});

// Pause functionality
let gamePaused = false;

function togglePause() {
    if (!gameStarted) return;
    
    gamePaused = !gamePaused;
    
    const pauseBtnMain = document.getElementById('pause-game-main');
    const pauseBtnTop = document.getElementById('pause-game-top');
    const startBtnMain = document.getElementById('start-game-main');
    const startBtnTop = document.getElementById('start-game-top');
    
    if (gamePaused) {
        // Pause the game
        gameActive = false;
        if (spawnTimer) clearInterval(spawnTimer);
        
        // Update button text
        if (pauseBtnMain) pauseBtnMain.textContent = 'Resume';
        if (pauseBtnTop) pauseBtnTop.textContent = 'Resume';
        
        // Hide start buttons while paused
        if (startBtnMain) startBtnMain.style.display = 'none';
        if (startBtnTop) startBtnTop.style.display = 'none';
    } else {
        // Resume the game
        gameActive = true;
        spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
        requestAnimationFrame(gameLoop);
        
        // Update button text
        if (pauseBtnMain) pauseBtnMain.textContent = 'Pause';
        if (pauseBtnTop) pauseBtnTop.textContent = 'Pause';
    }
}

// Add pause button event listeners
const pauseBtnMain = document.getElementById('pause-game-main');
const pauseBtnTop = document.getElementById('pause-game-top');

if (pauseBtnMain) {
    pauseBtnMain.addEventListener('click', togglePause);
}

if (pauseBtnTop) {
    pauseBtnTop.addEventListener('click', togglePause);
}

// Show/hide pause buttons when game starts/stops
function updatePauseButtonVisibility() {
    const pauseBtnMain = document.getElementById('pause-game-main');
    const pauseBtnTop = document.getElementById('pause-game-top');
    const startBtnMain = document.getElementById('start-game-main');
    const startBtnTop = document.getElementById('start-game-top');
    
    if (gameStarted && gameActive) {
        // Game is running - show pause, hide start
        if (pauseBtnMain) pauseBtnMain.style.display = 'inline-block';
        if (pauseBtnTop) pauseBtnTop.style.display = 'inline-block';
        if (startBtnMain) startBtnMain.style.display = 'none';
        if (startBtnTop) startBtnTop.style.display = 'none';
    } else if (gameStarted && gamePaused) {
        // Game is paused - show pause (as Resume), hide start
        if (pauseBtnMain) pauseBtnMain.style.display = 'inline-block';
        if (pauseBtnTop) pauseBtnTop.style.display = 'inline-block';
        if (startBtnMain) startBtnMain.style.display = 'none';
        if (startBtnTop) startBtnTop.style.display = 'none';
    } else {
        // Game not started or game over - show start, hide pause
        if (pauseBtnMain) pauseBtnMain.style.display = 'none';
        if (pauseBtnTop) pauseBtnTop.style.display = 'none';
        if (startBtnMain) startBtnMain.style.display = 'inline-block';
        if (startBtnTop) startBtnTop.style.display = 'inline-block';
        gamePaused = false;
    }
}

// Auto-pause when window loses focus to prevent letter accumulation
let wasGameActiveBeforeBlur = false;
let savedSpawnTimer = null;

function pauseGameCompletely() {
    if (gameStarted && gameActive && !gamePaused) {
        wasGameActiveBeforeBlur = true;
        
        // Stop spawn timer completely
        if (spawnTimer) {
            clearInterval(spawnTimer);
            savedSpawnTimer = spawnTimer;
            spawnTimer = null;
        }
        
        // Pause game state
        gameActive = false;
        gamePaused = true;
        
        // Update button UI
        const pauseBtnMain = document.getElementById('pause-game-main');
        const pauseBtnTop = document.getElementById('pause-game-top');
        if (pauseBtnMain) pauseBtnMain.textContent = 'Resume';
        if (pauseBtnTop) pauseBtnTop.textContent = 'Resume';
        
        updatePauseButtonVisibility();
        console.log('Game completely paused due to window losing focus');
    }
}

function resumeGameCompletely() {
    if (gameStarted && gamePaused && wasGameActiveBeforeBlur) {
        wasGameActiveBeforeBlur = false;
        
        // Resume game state
        gameActive = true;
        gamePaused = false;
        
        // Restart spawn timer
        if (!spawnTimer) {
            spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
        }
        
        // Restart game loop
        requestAnimationFrame(gameLoop);
        
        // Update button UI
        const pauseBtnMain = document.getElementById('pause-game-main');
        const pauseBtnTop = document.getElementById('pause-game-top');
        if (pauseBtnMain) pauseBtnMain.textContent = 'Pause';
        if (pauseBtnTop) pauseBtnTop.textContent = 'Pause';
        
        updatePauseButtonVisibility();
        console.log('Game completely resumed when window gained focus');
    }
}

window.addEventListener('blur', () => {
    pauseGameCompletely();
});

window.addEventListener('focus', () => {
    // Small delay to ensure user is ready
    setTimeout(() => {
        resumeGameCompletely();
    }, 500);
});

// Also handle visibility change (for tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseGameCompletely();
    } else {
        setTimeout(() => {
            resumeGameCompletely();
        }, 500);
    }
});

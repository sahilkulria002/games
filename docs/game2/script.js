const NUM_COLS = 6;
let FALL_SPEED = 2; // pixels per frame, now adjustable
const SPAWN_INTERVAL = 1200; // ms
const LIVES_START = 5;


let score = 0;
let lives = LIVES_START;
let gameActive = true;
let fallingLetters = [];
let spawnTimer;


const columns = Array.from(document.querySelectorAll('.column'));
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const speedRange = document.getElementById('speed-range');
const speedValue = document.getElementById('speed-value');
const modeSelect = document.getElementById('game-mode');
const textPanel = document.getElementById('text-panel');
const customTextArea = document.getElementById('custom-text');
const startTextModeBtn = document.getElementById('start-text-mode');
const textProgress = document.getElementById('text-progress');

let mode = 'random';
let customText = '';
let textIndex = 0;
let gameStarted = false;

const btnRandom = document.getElementById('btn-random');
const btnText = document.getElementById('btn-text');
const startGameBtn = document.getElementById('start-game');
const modeBtns = [btnRandom, btnText];

// Hide text panel initially
textPanel.style.display = 'none';

btnRandom.addEventListener('click', () => {
    mode = 'random';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    btnRandom.classList.add('active');
    textPanel.style.display = 'none';
    customText = '';
    textIndex = 0;
    textProgress.textContent = '';
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
    stopGame();
});

function stopGame() {
    gameActive = false;
    gameStarted = false;
    if (spawnTimer) clearInterval(spawnTimer);
    fallingLetters = [];
    columns.forEach(col => col.innerHTML = '');
    score = 0;
    lives = LIVES_START;
    scoreEl.textContent = 'Score: 0';
    livesEl.textContent = `Lives: ${LIVES_START}`;
    gameOverEl.style.display = 'none';
}

if (speedRange && speedValue) {
    speedRange.addEventListener('input', (e) => {
        FALL_SPEED = Number(speedRange.value);
        speedValue.textContent = speedRange.value;
    });
    // Set initial value
    speedValue.textContent = speedRange.value;
    FALL_SPEED = Number(speedRange.value);
}

if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
        mode = modeSelect.value;
        if (mode === 'text') {
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
    if (mode === 'random') {
        startGame();
    } else if (mode === 'text') {
        alert('Please enter your text and click "Start Text Mode" to begin.');
    }
});

if (startTextModeBtn) {
    startTextModeBtn.addEventListener('click', () => {
        customText = (customTextArea.value || '').replace(/\s+/g, ' ').trim();
        textIndex = 0;
        if (customText.length === 0) {
            alert('Please enter some text!');
            return;
        }
        textProgress.textContent = '';
        startGame();
    });
}

function randomLetter() {
    if (mode === 'text' && customText && textIndex < customText.length) {
        return customText[textIndex];
    }
    const letters = 'ASDFJK';
    return letters[Math.floor(Math.random() * letters.length)];
}

function spawnLetter() {
    if (!gameActive || !gameStarted) return;
    const colIdx = Math.floor(Math.random() * NUM_COLS);
    let letter = randomLetter();
    // Only spawn valid letters in columns
    while (letter === ' ' || letter === '\n') {
        textIndex++;
        letter = randomLetter();
        if (mode !== 'text' || textIndex >= (customText ? customText.length : 0)) break;
    }
    if (mode === 'text' && customText && textIndex >= customText.length) return;
    const letterDiv = document.createElement('div');
    letterDiv.className = 'falling-letter';
    letterDiv.textContent = letter;
    letterDiv.dataset.letter = letter;
    letterDiv.dataset.col = colIdx;
    // Start above the visible area
    letterDiv.style.top = '-70px';
    columns[colIdx].appendChild(letterDiv);
    fallingLetters.push({
        el: letterDiv,
        col: colIdx,
        letter: letter,
        y: -70, // Start above the top
        caught: false,
        seq: mode === 'text' ? textIndex : undefined
    });
    if (mode === 'text') textIndex++;
}

function updateLetters() {
    for (let i = fallingLetters.length - 1; i >= 0; i--) {
        const obj = fallingLetters[i];
        if (obj.caught) continue;
        obj.y += FALL_SPEED;
        obj.el.style.top = obj.y + 'px';
        if (obj.y + obj.el.offsetHeight >= columns[obj.col].offsetHeight) {
            // Missed
            columns[obj.col].removeChild(obj.el);
            fallingLetters.splice(i, 1);
            loseLife();
        }
    }
}

function loseLife() {
    lives--;
    livesEl.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(spawnTimer);
    gameOverEl.style.display = 'flex';
    finalScoreEl.textContent = `Your Score: ${score}`;
}

function gameLoop() {
    if (!gameActive) return;
    updateLetters();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    const key = e.key;
    let found = false;
    for (let i = 0; i < fallingLetters.length; i++) {
        const obj = fallingLetters[i];
        if (!obj.caught && obj.letter.toLowerCase() === key.toLowerCase()) {
            obj.caught = true;
            obj.el.classList.add('caught');
            setTimeout(() => {
                if (obj.el.parentNode) obj.el.parentNode.removeChild(obj.el);
            }, 200);
            fallingLetters.splice(i, 1);
            score++;
            scoreEl.textContent = `Score: ${score}`;
            if (mode === 'text' && customText) {
                // Show progress
                let progress = '';
                for (let j = 0; j < textIndex; j++) {
                    if (j < score) progress += `<span style='color:#2ecc40;'>${customText[j]}</span>`;
                    else progress += `<span style='color:#fff;'>${customText[j]}</span>`;
                }
                textProgress.innerHTML = progress;
            }
            found = true;
            break;
        }
    }
});

function startGame() {
    score = 0;
    lives = LIVES_START;
    gameActive = true;
    gameStarted = true;
    fallingLetters = [];
    scoreEl.textContent = 'Score: 0';
    livesEl.textContent = `Lives: ${LIVES_START}`;
    gameOverEl.style.display = 'none';
    columns.forEach(col => col.innerHTML = '');
    if (spawnTimer) clearInterval(spawnTimer);
    textIndex = 0;
    if (mode === 'text' && customText) {
        textProgress.innerHTML = '';
    }
    spawnTimer = setInterval(spawnLetter, SPAWN_INTERVAL);
    requestAnimationFrame(gameLoop);
}

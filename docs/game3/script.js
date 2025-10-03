// Game state variables
let currentWord = '';
let letterBoxes = [];
let scatteredLetters = [];
let typedLetters = [];
let gameActive = false;
let displayTime = 2000; // 2 seconds default
let score = 0;
let level = 1;
let startTime = 0;

// Word lists by difficulty
const wordLists = {
    easy: ['CAT', 'DOG', 'SUN', 'CAR', 'BED', 'CUP', 'HAT', 'PEN', 'BAG', 'EGG'],
    medium: ['HOUSE', 'TRAIN', 'APPLE', 'HORSE', 'BOOKS', 'CHAIR', 'MUSIC', 'PHONE', 'WATER', 'LIGHT'],
    hard: ['ELEPHANT', 'COMPUTER', 'BIRTHDAY', 'SANDWICH', 'TOGETHER', 'KEYBOARD', 'MOUNTAIN', 'PRINCESS', 'SWIMMING', 'BUTTERFLY']
};

// DOM elements
const displayTimeSlider = document.getElementById('display-time');
const displayTimeValue = document.getElementById('display-time-value');
const newWordBtn = document.getElementById('new-word-btn');
const startBtn = document.getElementById('start-btn');
const wordDisplay = document.getElementById('word-display');
const currentWordEl = document.getElementById('current-word');
const placeholderBoxes = document.getElementById('placeholder-boxes');
const scatteredLettersContainer = document.getElementById('scattered-letters');
const typedLettersEl = document.getElementById('typed-letters');
const progressText = document.getElementById('progress-text');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const timerEl = document.getElementById('timer');
const messageOverlay = document.getElementById('message-overlay');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const nextWordBtn = document.getElementById('next-word-btn');
const menuBtn = document.getElementById('menu-btn');

// Initialize the game
function init() {
    setupEventListeners();
    updateDisplayTime();
    generateNewWord();
    updateUI();
}

// Setup event listeners
function setupEventListeners() {
    displayTimeSlider.addEventListener('input', updateDisplayTime);
    newWordBtn.addEventListener('click', generateNewWord);
    startBtn.addEventListener('click', startGame);
    nextWordBtn.addEventListener('click', nextWord);
    menuBtn.addEventListener('click', resetToMenu);
    
    // Keyboard input
    document.addEventListener('keydown', handleKeyPress);
}

// Update display time from slider
function updateDisplayTime() {
    displayTime = parseFloat(displayTimeSlider.value) * 1000;
    displayTimeValue.textContent = displayTimeSlider.value + 's';
}

// Generate a new word based on current level
function generateNewWord() {
    let wordList;
    if (level <= 3) {
        wordList = wordLists.easy;
    } else if (level <= 7) {
        wordList = wordLists.medium;
    } else {
        wordList = wordLists.hard;
    }
    
    // Pick a random word
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentWordEl.textContent = currentWord;
    
    // Reset game state
    typedLetters = [];
    gameActive = false;
    wordDisplay.classList.remove('hidden');
    
    // Create placeholder boxes with letters initially
    createPlaceholderBoxesWithLetters();
    
    // Clear scattered letters
    scatteredLettersContainer.innerHTML = '';
    scatteredLetters = [];
    
    updateUI();
}

// Create placeholder boxes with letters initially visible
function createPlaceholderBoxesWithLetters() {
    placeholderBoxes.innerHTML = '';
    letterBoxes = [];
    
    for (let i = 0; i < currentWord.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box filled';
        box.dataset.index = i;
        box.textContent = currentWord[i]; // Show the letter initially
        placeholderBoxes.appendChild(box);
        letterBoxes.push(box);
    }
}

// Create empty placeholder boxes (for when letters are scattered)
function createEmptyPlaceholderBoxes() {
    for (let i = 0; i < currentWord.length; i++) {
        const box = letterBoxes[i];
        box.className = 'letter-box';
        box.textContent = ''; // Clear the letter
    }
}

// Start the game
function startGame() {
    if (!currentWord) {
        generateNewWord();
        return;
    }
    
    gameActive = true;
    startTime = Date.now();
    
    // After display time, hide word and scatter letters
    setTimeout(() => {
        wordDisplay.classList.add('hidden');
        scatterLettersFromPlaceholders();
    }, displayTime);
    
    updateTimer();
}

// Scatter letters from placeholders to random positions
function scatterLettersFromPlaceholders() {
    scatteredLettersContainer.innerHTML = '';
    scatteredLetters = [];
    
    const containerRect = document.querySelector('.letters-container').getBoundingClientRect();
    const usedPositions = [];
    
    for (let i = 0; i < currentWord.length; i++) {
        const placeholderBox = letterBoxes[i];
        
        // Create scattered letter
        const letter = document.createElement('div');
        letter.className = 'scattered-letter';
        letter.textContent = currentWord[i];
        letter.dataset.letter = currentWord[i];
        letter.dataset.originalIndex = i;
        
        // Start at placeholder position
        const placeholderRect = placeholderBox.getBoundingClientRect();
        const containerOffset = containerRect;
        
        const startX = placeholderRect.left - containerOffset.left;
        const startY = placeholderRect.top - containerOffset.top;
        
        letter.style.left = startX + 'px';
        letter.style.top = startY + 'px';
        
        scatteredLettersContainer.appendChild(letter);
        scatteredLetters.push(letter);
        
        // Clear the placeholder box
        placeholderBox.textContent = '';
        placeholderBox.classList.remove('filled');
        
        // After a short delay, animate to random position
        setTimeout(() => {
            // Find a random position that doesn't overlap
            let position;
            let attempts = 0;
            do {
                position = getRandomPosition(containerRect);
                attempts++;
            } while (isPositionOverlapping(position, usedPositions) && attempts < 50);
            
            usedPositions.push(position);
            
            // Animate to new position
            letter.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            letter.style.left = position.x + 'px';
            letter.style.top = position.y + 'px';
            letter.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
        }, i * 100); // Stagger the animations
    }
}

// Get a random position within the container
function getRandomPosition(containerRect) {
    const margin = 80; // Keep letters away from edges
    const x = Math.random() * (containerRect.width - 2 * margin - 60) + margin;
    const y = Math.random() * (containerRect.height - 2 * margin - 60) + margin;
    return { x, y };
}

// Check if position overlaps with existing positions
function isPositionOverlapping(newPos, existingPositions) {
    const minDistance = 100; // Minimum distance between letters
    
    return existingPositions.some(pos => {
        const distance = Math.sqrt(
            Math.pow(newPos.x - pos.x, 2) + Math.pow(newPos.y - pos.y, 2)
        );
        return distance < minDistance;
    });
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!gameActive || scatteredLetters.length === 0) return;
    
    const key = e.key.toUpperCase();
    
    if (key === 'BACKSPACE') {
        handleBackspace();
        e.preventDefault();
        return;
    }
    
    // Check if it's a valid letter
    if (key.length === 1 && key.match(/[A-Z]/)) {
        handleLetterInput(key);
        e.preventDefault();
    }
}

// Handle letter input
function handleLetterInput(letter) {
    const expectedLetter = currentWord[typedLetters.length];
    
    if (letter === expectedLetter) {
        // Correct letter
        handleCorrectLetter(letter);
    } else {
        // Wrong letter - ignore for now, could add feedback later
        console.log('Wrong letter:', letter, 'Expected:', expectedLetter);
    }
}

// Handle correct letter input
function handleCorrectLetter(letter) {
    const letterIndex = typedLetters.length;
    const targetBox = letterBoxes[letterIndex];
    
    // Find the scattered letter
    const scatteredLetter = scatteredLetters.find(l => 
        l.dataset.letter === letter && 
        parseInt(l.dataset.originalIndex) === letterIndex
    );
    
    if (scatteredLetter && targetBox) {
        // Animate letter moving to placeholder
        moveLetterToPlaceholder(scatteredLetter, targetBox, letterIndex);
        
        // Add to typed letters
        typedLetters.push(letter);
        
        // Check if word is complete
        if (typedLetters.length === currentWord.length) {
            setTimeout(() => {
                completeWord();
            }, 500);
        }
        
        updateUI();
    }
}

// Move letter from scattered position to placeholder
function moveLetterToPlaceholder(scatteredLetter, targetBox, letterIndex) {
    scatteredLetter.classList.add('moving');
    
    // Get positions
    const scatteredRect = scatteredLetter.getBoundingClientRect();
    const targetRect = targetBox.getBoundingClientRect();
    
    // Calculate movement
    const deltaX = targetRect.left - scatteredRect.left;
    const deltaY = targetRect.top - scatteredRect.top;
    
    // Animate
    scatteredLetter.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    scatteredLetter.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.9)`;
    
    setTimeout(() => {
        // Fill the placeholder box
        targetBox.textContent = scatteredLetter.textContent;
        targetBox.classList.add('filled');
        
        // Remove scattered letter
        scatteredLetter.remove();
        
        // Remove from scattered letters array
        const index = scatteredLetters.indexOf(scatteredLetter);
        if (index > -1) {
            scatteredLetters.splice(index, 1);
        }
    }, 500);
}

// Handle backspace
function handleBackspace() {
    if (typedLetters.length === 0) return;
    
    const lastLetterIndex = typedLetters.length - 1;
    const lastLetter = typedLetters[lastLetterIndex];
    const targetBox = letterBoxes[lastLetterIndex];
    
    // Clear the placeholder box
    targetBox.textContent = '';
    targetBox.classList.remove('filled', 'error');
    
    // Create scattered letter again
    const scatteredLetter = document.createElement('div');
    scatteredLetter.className = 'scattered-letter';
    scatteredLetter.textContent = lastLetter;
    scatteredLetter.dataset.letter = lastLetter;
    scatteredLetter.dataset.originalIndex = lastLetterIndex;
    
    // Position it randomly
    const containerRect = document.querySelector('.letters-container').getBoundingClientRect();
    const position = getRandomPosition(containerRect);
    scatteredLetter.style.left = position.x + 'px';
    scatteredLetter.style.top = position.y + 'px';
    
    scatteredLettersContainer.appendChild(scatteredLetter);
    scatteredLetters.push(scatteredLetter);
    
    // Remove from typed letters
    typedLetters.pop();
    
    updateUI();
}

// Complete the word
function completeWord() {
    gameActive = false;
    score += 10 * level; // More points for higher levels
    
    // Show success message
    showMessage('Excellent!', `You spelled "${currentWord}" correctly!`, true);
}

// Show message overlay
function showMessage(title, text, isSuccess = true) {
    messageTitle.textContent = title;
    messageText.textContent = text;
    messageOverlay.classList.add('show');
    
    if (isSuccess) {
        messageTitle.style.color = '#4CAF50';
    } else {
        messageTitle.style.color = '#f44336';
    }
}

// Hide message overlay
function hideMessage() {
    messageOverlay.classList.remove('show');
}

// Next word
function nextWord() {
    hideMessage();
    level++;
    generateNewWord();
    updateUI();
}

// Reset to menu
function resetToMenu() {
    hideMessage();
    gameActive = false;
    score = 0;
    level = 1;
    generateNewWord();
    updateUI();
}

// Update timer
function updateTimer() {
    if (!gameActive) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = elapsed + 's';
    
    setTimeout(() => updateTimer(), 1000);
}

// Update UI elements
function updateUI() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    progressText.textContent = typedLetters.join('');
    typedLettersEl.textContent = typedLetters.join(' ');
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', init);
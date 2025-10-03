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

// Word progression variables
let currentWordLength = 3; // Start with 3-letter words
let wordsCompletedAtCurrentLength = 0; // Track how many words completed at current length
let usedWordsAtCurrentLength = []; // Track which words we've used at current length

// Word lists organized by length
const wordsByLength = {
    3: ['CAT', 'DOG', 'SUN', 'CAR', 'BED', 'CUP', 'HAT', 'PEN', 'BAG', 'EGG', 'BOX', 'KEY', 'MAP', 'NET', 'OWL'],
    4: ['BOOK', 'FISH', 'TREE', 'DOOR', 'CAKE', 'BALL', 'MOON', 'STAR', 'BIRD', 'DUCK', 'FROG', 'KITE', 'LAMP', 'TENT'],
    5: ['HOUSE', 'TRAIN', 'APPLE', 'HORSE', 'BOOKS', 'CHAIR', 'MUSIC', 'PHONE', 'WATER', 'LIGHT', 'BREAD', 'CLOUD', 'DREAM', 'GRASS'],
    6: ['SCHOOL', 'FLOWER', 'FRIEND', 'ORANGE', 'YELLOW', 'PURPLE', 'GARDEN', 'ANIMAL', 'PARENT', 'SISTER', 'FAMILY', 'COOKIE', 'BUBBLE', 'CIRCLE'],
    7: ['RAINBOW', 'BEDROOM', 'PICTURE', 'COOKING', 'READING', 'SINGING', 'DANCING', 'MORNING', 'EVENING', 'PENGUIN', 'CHICKEN', 'BALLOON', 'KITCHEN', 'LIBRARY'],
    8: ['ELEPHANT', 'COMPUTER', 'SANDWICH', 'BIRTHDAY', 'MOUNTAIN', 'PRINCESS', 'SWIMMING', 'CHILDREN', 'SPELLING', 'DINOSAUR', 'VACATION', 'AIRPLANE', 'LUNCHBOX', 'BACKPACK'],
    9: ['BUTTERFLY', 'ADVENTURE', 'CELEBRATE', 'CHRISTMAS', 'CLASSROOM', 'FANTASTIC', 'FIREWORKS', 'HALLOWEEN', 'PAINTBRUSH', 'SNOWFLAKE', 'TELEPHONE', 'WONDERFUL', 'CROCODILE', 'CHOCOLATE'],
    10: ['BASKETBALL', 'PLAYGROUND', 'TOOTHBRUSH', 'WATERMELON', 'SKATEBOARD', 'SPACECRAFT', 'TYPEWRITER', 'MOTORCYCLE', 'SUNGLASSES', 'CALCULATOR', 'TRAMPOLINE', 'CENTIPEDE', 'TABLESPOON', 'VOLLEYBALL']
};

// DOM elements
const displayTimeSlider = document.getElementById('display-time');
const displayTimeValue = document.getElementById('display-time-value');
const newWordBtn = document.getElementById('new-word-btn');
const startBtn = document.getElementById('start-btn');
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
    const timeValue = parseFloat(displayTimeSlider.value);
    
    // Format display based on value size
    if (timeValue < 1) {
        displayTimeValue.textContent = timeValue.toFixed(1) + 's';
    } else {
        displayTimeValue.textContent = timeValue.toFixed(1) + 's';
    }
}

// Generate a new word with 4-words-per-length progression
function generateNewWord() {
    // Get available words for current length
    const wordList = wordsByLength[currentWordLength];
    
    // Get unused words (words we haven't used yet at this length)
    const availableWords = wordList.filter(word => !usedWordsAtCurrentLength.includes(word));
    
    // If no available words left, we shouldn't reach here, but as fallback use any word
    const wordsToChooseFrom = availableWords.length > 0 ? availableWords : wordList;
    
    // Pick a random word from available words
    currentWord = wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)];
    
    // Add to used words list
    if (!usedWordsAtCurrentLength.includes(currentWord)) {
        usedWordsAtCurrentLength.push(currentWord);
    }
    
    // Reset game state
    typedLetters = [];
    gameActive = false;
    
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
    
    // After display time, scatter letters
    setTimeout(() => {
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
        // Wrong letter - show error animation
        handleWrongLetter(letter);
    }
}

// Handle wrong letter input
function handleWrongLetter(letter) {
    const letterIndex = typedLetters.length;
    const targetBox = letterBoxes[letterIndex];
    
    if (!targetBox) return; // No more boxes available
    
    // Find a scattered letter with this character (any of them will do)
    const scatteredLetter = scatteredLetters.find(l => l.dataset.letter === letter);
    
    if (scatteredLetter && targetBox) {
        // Animate letter moving to placeholder (but as wrong/red)
        moveWrongLetterToPlaceholder(scatteredLetter, targetBox, letterIndex, letter);
        
        // Add to typed letters (so backspace can remove it)
        typedLetters.push(letter);
        
        updateUI();
    }
}

// Move wrong letter to placeholder with error styling
function moveWrongLetterToPlaceholder(scatteredLetter, targetBox, letterIndex, letter) {
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
        // Fill the placeholder box with error styling
        targetBox.textContent = letter;
        targetBox.classList.add('error'); // Add error class instead of filled
        
        // Remove scattered letter
        scatteredLetter.remove();
        
        // Remove from scattered letters array
        const index = scatteredLetters.indexOf(scatteredLetter);
        if (index > -1) {
            scatteredLetters.splice(index, 1);
        }
    }, 500);
}

// Handle correct letter input
function handleCorrectLetter(letter) {
    const letterIndex = typedLetters.length;
    const targetBox = letterBoxes[letterIndex];
    
    // Find the scattered letter - prefer one with correct originalIndex, but accept any if needed
    let scatteredLetter = scatteredLetters.find(l => 
        l.dataset.letter === letter && 
        parseInt(l.dataset.originalIndex) === letterIndex
    );
    
    // If no exact match found, find any letter with the same character
    if (!scatteredLetter) {
        scatteredLetter = scatteredLetters.find(l => l.dataset.letter === letter);
    }
    
    if (scatteredLetter && targetBox) {
        // Animate letter moving to placeholder
        moveLetterToPlaceholder(scatteredLetter, targetBox, letterIndex);
        
        // Add to typed letters
        typedLetters.push(letter);
        
        // Check if word is complete and all letters are correct
        if (typedLetters.length === currentWord.length) {
            // Check if all letters match (no errors)
            const isWordCorrect = typedLetters.every((letter, index) => letter === currentWord[index]);
            if (isWordCorrect) {
                setTimeout(() => {
                    completeWord();
                }, 500);
            }
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
    
    // Create scattered letter again at the placeholder position first
    const scatteredLetter = document.createElement('div');
    scatteredLetter.className = 'scattered-letter';
    scatteredLetter.textContent = lastLetter;
    scatteredLetter.dataset.letter = lastLetter;
    
    // Set originalIndex - if it's the correct letter for this position, use the position
    // Otherwise, find where this letter should originally belong in the word
    let originalIndex = -1;
    if (lastLetter === currentWord[lastLetterIndex]) {
        originalIndex = lastLetterIndex;
    } else {
        // Find the first occurrence of this letter in the word that hasn't been placed yet
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === lastLetter && i >= typedLetters.length - 1) {
                originalIndex = i;
                break;
            }
        }
    }
    scatteredLetter.dataset.originalIndex = originalIndex;
    
    // Start at placeholder position
    const containerRect = document.querySelector('.letters-container').getBoundingClientRect();
    const placeholderRect = targetBox.getBoundingClientRect();
    const startX = placeholderRect.left - containerRect.left;
    const startY = placeholderRect.top - containerRect.top;
    
    scatteredLetter.style.left = startX + 'px';
    scatteredLetter.style.top = startY + 'px';
    scatteredLetter.style.transition = 'none'; // No transition initially
    
    scatteredLettersContainer.appendChild(scatteredLetter);
    scatteredLetters.push(scatteredLetter);
    
    // Clear the placeholder box immediately
    targetBox.textContent = '';
    targetBox.classList.remove('filled', 'error');
    
    // After a short delay, animate to random position
    setTimeout(() => {
        const targetPosition = getRandomPosition(containerRect);
        
        // Enable transition and animate
        scatteredLetter.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        scatteredLetter.style.left = targetPosition.x + 'px';
        scatteredLetter.style.top = targetPosition.y + 'px';
        scatteredLetter.style.transform = 'rotate(' + (Math.random() * 20 - 10) + 'deg)';
    }, 50); // Small delay to ensure the element is rendered
    
    // Remove from typed letters
    typedLetters.pop();
    
    updateUI();
}

// Complete the word
function completeWord() {
    gameActive = false;
    score += 10 * level; // More points for higher levels
    
    // Increment words completed at current length
    wordsCompletedAtCurrentLength++;
    
    // Add completion animation to letter boxes
    animateWordCompletion();
    
    // Continue to next word with animated transition
    setTimeout(() => {
        level++;
        
        // Check if we need to increase word length (after 4 words)
        if (wordsCompletedAtCurrentLength >= 4) {
            // Move to next word length
            currentWordLength++;
            wordsCompletedAtCurrentLength = 0;
            usedWordsAtCurrentLength = [];
            
            // Cap at 10-letter words
            if (currentWordLength > 10) {
                currentWordLength = 10;
            }
        }
        
        // Animated transition to next word
        animateToNextWord();
    }, 1500); // Longer delay to allow completion animation
}

// Animate word completion celebration
function animateWordCompletion() {
    // Create sparkle effects
    createSparkleExplosion();
    
    // Letter victory dance animation
    letterBoxes.forEach((box, index) => {
        setTimeout(() => {
            // Multi-stage celebration animation
            box.style.transition = 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            box.style.transform = 'scale(1.3) rotate(5deg)';
            box.style.boxShadow = '0 0 30px rgba(76, 175, 80, 1), 0 0 60px rgba(76, 175, 80, 0.5)';
            box.style.borderColor = '#4CAF50';
            box.style.background = 'linear-gradient(45deg, #4CAF50, #8BC34A, #CDDC39)';
            
            // Second bounce
            setTimeout(() => {
                box.style.transform = 'scale(1.1) rotate(-3deg)';
            }, 150);
            
            // Third bounce
            setTimeout(() => {
                box.style.transform = 'scale(1.25) rotate(2deg)';
            }, 300);
            
            // Final settle with pulsing glow
            setTimeout(() => {
                box.style.transition = 'all 0.3s ease';
                box.style.transform = 'scale(1.05)';
                box.style.animation = 'victoryPulse 0.8s infinite alternate';
            }, 450);
            
        }, index * 80); // Stagger the animation
    });
}

// Animate transition to next word
function animateToNextWord() {
    // Stop victory animation
    letterBoxes.forEach(box => {
        box.style.animation = 'none';
    });
    
    // Clean fade out with gentle scale
    letterBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.style.transition = 'all 0.4s ease-out';
            box.style.transform = 'scale(0.9)';
            box.style.opacity = '0';
            
            // Clear the content and styling immediately as it fades
            setTimeout(() => {
                box.textContent = '';
                box.classList.remove('filled', 'error');
                box.style.background = 'rgba(255, 255, 255, 0.1)';
                box.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                box.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }, 200); // Clear styling halfway through fade
        }, index * 60);
    });
    
    // Generate new word after fade out completes
    setTimeout(() => {
        generateNewWord();
        updateUI();
        
        // Clean fade in with gentle scale
        setTimeout(() => {
            letterBoxes.forEach((box, index) => {
                // Reset styling first
                box.style.background = 'rgba(76, 175, 80, 0.8)';
                box.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                box.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                
                // Start invisible and slightly smaller
                box.style.transition = 'none';
                box.style.transform = 'scale(0.9)';
                box.style.opacity = '0';
                
                setTimeout(() => {
                    box.style.transition = 'all 0.5s ease-out';
                    box.style.transform = 'scale(1)';
                    box.style.opacity = '1';
                }, index * 80);
            });
            
            // Auto-start the next word after fade in completes
            setTimeout(() => {
                startGame();
            }, letterBoxes.length * 80 + 500);
        }, 200);
    }, letterBoxes.length * 60 + 400);
}

// Create sparkle explosion effect
function createSparkleExplosion() {
    const container = document.querySelector('.letters-container');
    const containerRect = container.getBoundingClientRect();
    
    // Create multiple sparkle particles
    for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        sparkle.innerHTML = '✨';
        
        // Random position around the word
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        const angle = (Math.PI * 2 * i) / 15;
        const radius = 100;
        
        const startX = centerX + Math.cos(angle) * 50;
        const startY = centerY + Math.sin(angle) * 30;
        const endX = centerX + Math.cos(angle) * radius;
        const endY = centerY + Math.sin(angle) * radius;
        
        sparkle.style.position = 'absolute';
        sparkle.style.left = startX + 'px';
        sparkle.style.top = startY + 'px';
        sparkle.style.fontSize = '20px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '100';
        sparkle.style.transition = 'all 1.2s ease-out';
        
        container.appendChild(sparkle);
        
        // Animate sparkles outward
        setTimeout(() => {
            sparkle.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0)`;
            sparkle.style.opacity = '0';
        }, 50);
        
        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1200);
    }
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
    
    // Reset word progression variables
    currentWordLength = 3;
    wordsCompletedAtCurrentLength = 0;
    usedWordsAtCurrentLength = [];
    
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
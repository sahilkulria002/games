// Game state variables
let currentWord = '';
let currentWord2 = ''; // Second word for two-words mode
let currentWord3 = ''; // Third word for three-words mode
let currentWord4 = ''; // Fourth word for four-words mode
let letterBoxes = [];
let letterBoxes2 = []; // Second set of boxes for two-words mode
let letterBoxes3 = []; // Third set of boxes for three-words mode
let letterBoxes4 = []; // Fourth set of boxes for four-words mode
let scatteredLetters = [];
let typedLetters = [];
let typedLetters2 = []; // Typed letters for second word
let typedLetters3 = []; // Typed letters for third word
let typedLetters4 = []; // Typed letters for fourth word
let gameActive = false;
let displayTime = 2000; // 2 seconds default
let score = 0;
let level = 1;
let startTime = 0;
let skipCount = 0; // Track number of skips used
let gameMode = 'mix'; // 'mix', 'single', 'double', 'triple', or 'quad'
let activeWord = 1; // Which word is currently being typed (1, 2, 3, or 4)
let word1Completed = false; // Track if first word is completed
let word2Completed = false; // Track if second word is completed
let word3Completed = false; // Track if third word is completed
let word4Completed = false; // Track if fourth word is completed

// Game session tracking
let completedWords = []; // Words that were completed successfully  
let skippedWords = []; // Words that were skipped

// Word progression variables
let currentWordLength = 3; // Will be updated from slider value
let wordsCompletedAtCurrentLength = 0; // Track how many words completed at current length
let usedWordsAtCurrentLength = []; // Track which words we've used at current length

// Custom text variables
let customWordsByLength = null; // Will store words extracted from custom text
let usingCustomText = false; // Flag to track if we're using custom text

// Mix mode progression variables
let mixModeStage = 1; // Current stage in mix mode
let mixModeWordsCompleted = 0; // Words completed in current stage
let mixModeConfig = {
    1: { words: 1, length: 3, wordsNeeded: 3 },  // Stage 1: 1 word, 3 letters, complete 3 words
    2: { words: 1, length: 4, wordsNeeded: 3 },  // Stage 2: 1 word, 4 letters, complete 3 words
    3: { words: 2, length: 4, wordsNeeded: 2 },  // Stage 3: 2 words, 4 letters, complete 2 sets
    4: { words: 2, length: 5, wordsNeeded: 2 },  // Stage 4: 2 words, 5 letters, complete 2 sets
    5: { words: 3, length: 5, wordsNeeded: 2 },  // Stage 5: 3 words, 5 letters, complete 2 sets
    6: { words: 3, length: 6, wordsNeeded: 2 },  // Stage 6: 3 words, 6 letters, complete 2 sets
    7: { words: 4, length: 6, wordsNeeded: 2 },  // Stage 7: 4 words, 6 letters, complete 2 sets
    8: { words: 4, length: 7, wordsNeeded: 2 }   // Stage 8: 4 words, 7 letters, complete 2 sets
};

// Words per length settings
let wordsPerLength = {
    3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5
}; // Default 5 words for each length

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
const startingLengthSlider = document.getElementById('starting-length');
const startingLengthValue = document.getElementById('starting-length-value');
const gameModeSelect = document.getElementById('game-mode');
const startBtn = document.getElementById('start-btn');
const placeholderBoxes = document.getElementById('placeholder-boxes');
const placeholderBoxes2 = document.getElementById('placeholder-boxes-2');
const placeholderBoxes3 = document.getElementById('placeholder-boxes-3');
const placeholderBoxes4 = document.getElementById('placeholder-boxes-4');
const wordContainer1 = document.getElementById('word-container-1');
const wordContainer2 = document.getElementById('word-container-2');
const wordContainer3 = document.getElementById('word-container-3');
const wordContainer4 = document.getElementById('word-container-4');
const inputSection1 = document.getElementById('input-section-1');
const inputSection2 = document.getElementById('input-section-2');
const inputSection3 = document.getElementById('input-section-3');
const inputSection4 = document.getElementById('input-section-4');
const scatteredLettersContainer = document.getElementById('scattered-letters');
const typedLettersEl = document.getElementById('typed-letters');
const typedLettersEl2 = document.getElementById('typed-letters-2');
const typedLettersEl3 = document.getElementById('typed-letters-3');
const typedLettersEl4 = document.getElementById('typed-letters-4');
const progressText = document.getElementById('progress-text');
const progressText2 = document.getElementById('progress-text-2');
const progressText3 = document.getElementById('progress-text-3');
const progressText4 = document.getElementById('progress-text-4');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const timerEl = document.getElementById('timer');
const messageOverlay = document.getElementById('message-overlay');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const nextWordBtn = document.getElementById('next-word-btn');
const skipWordBtn = document.getElementById('skip-word-btn');
const menuBtn = document.getElementById('menu-btn');

// Custom text DOM elements
const customTextBtn = document.getElementById('custom-text-btn');
const textInputOverlay = document.getElementById('text-input-overlay');
const customTextArea = document.getElementById('custom-text-area');
const processTextBtn = document.getElementById('process-text-btn');
const useDefaultBtn = document.getElementById('use-default-btn');
const cancelTextBtn = document.getElementById('cancel-text-btn');
const textStats = document.getElementById('text-stats');

// Left panel DOM elements
const leftPanel = document.getElementById('left-panel');
const panelToggle = document.getElementById('panel-toggle');
const wordsPerLengthControls = document.getElementById('words-per-length-controls');
const resetToDefaultsBtn = document.getElementById('reset-to-defaults');
const applySettingsBtn = document.getElementById('apply-settings');
const gameContainer = document.querySelector('.game-container');

// Initialize the game
function init() {
    setupEventListeners();
    updateDisplayTime();
    initStartingLength();
    initializePanel();
    updateGameMode(); // Initialize game mode styling
    generateNewWord();
    updateUI();
}

// Setup event listeners
function setupEventListeners() {
    displayTimeSlider.addEventListener('input', updateDisplayTime);
    startingLengthSlider.addEventListener('input', updateStartingLength);
    gameModeSelect.addEventListener('change', updateGameMode);
    startBtn.addEventListener('click', startGame);
    nextWordBtn.addEventListener('click', nextWord);
    skipWordBtn.addEventListener('click', skipWord);
    menuBtn.addEventListener('click', resetToMenu);
    
    // Custom text listeners
    customTextBtn.addEventListener('click', showTextInput);
    processTextBtn.addEventListener('click', processCustomText);
    useDefaultBtn.addEventListener('click', useDefaultWords);
    cancelTextBtn.addEventListener('click', hideTextInput);
    
    // Panel listeners
    panelToggle.addEventListener('click', togglePanel);
    resetToDefaultsBtn.addEventListener('click', resetWordsPerLength);
    applySettingsBtn.addEventListener('click', applyWordsPerLengthSettings);
    
    // Word container click listeners for two-words mode
    wordContainer1.addEventListener('click', () => setActiveWord(1));
    wordContainer2.addEventListener('click', () => setActiveWord(2));
    
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

// Update starting length from slider
function updateStartingLength() {
    const lengthValue = parseInt(startingLengthSlider.value);
    startingLengthValue.textContent = lengthValue + ' letters';
    
    // Reset word progression to use new starting length
    resetWordProgression();
    generateNewWord();
    updateUI();
}

// Update game mode
function updateGameMode() {
    gameMode = gameModeSelect.value;
    const modeHint = document.getElementById('mode-hint');
    
    // Reset mix mode when changing modes
    if (gameMode === 'mix') {
        mixModeStage = 1;
        mixModeWordsCompleted = 0;
    }
    
    // Hide all word containers first
    wordContainer2.style.display = 'none';
    wordContainer3.style.display = 'none';
    wordContainer4.style.display = 'none';
    
    // Handle mix mode or regular modes
    if (gameMode === 'mix') {
        updateMixModeDisplay();
        if (modeHint) modeHint.style.display = 'block';
    } else if (gameMode === 'single') {
        wordContainer1.classList.add('single-mode');
        if (modeHint) modeHint.style.display = 'none';
    } else {
        wordContainer1.classList.remove('single-mode');
        if (modeHint) modeHint.style.display = 'block';
        
        // Show appropriate containers based on mode
        if (gameMode === 'double') {
            wordContainer2.style.display = 'block';
        } else if (gameMode === 'triple') {
            wordContainer2.style.display = 'block';
            wordContainer3.style.display = 'block';
        } else if (gameMode === 'quad') {
            wordContainer2.style.display = 'block';
            wordContainer3.style.display = 'block';
            wordContainer4.style.display = 'block';
        }
    }
    
    generateNewWord();
}

// Update display for mix mode based on current stage
function updateMixModeDisplay() {
    const config = mixModeConfig[mixModeStage];
    if (!config) return;
    
    // Remove single-mode class
    wordContainer1.classList.remove('single-mode');
    
    // Show containers based on current stage
    if (config.words >= 2) {
        wordContainer2.style.display = 'block';
    }
    if (config.words >= 3) {
        wordContainer3.style.display = 'block';
    }
    if (config.words >= 4) {
        wordContainer4.style.display = 'block';
    }
    
    // If only 1 word, center it
    if (config.words === 1) {
        wordContainer1.classList.add('single-mode');
    }
    
    // Update word length for this stage
    currentWordLength = config.length;
}

// Set active word for typing in multi-word modes
function setActiveWord(wordNumber) {
    if (gameMode === 'single') return;
    
    // Check if word number is valid for mix mode
    if (gameMode === 'mix') {
        const config = mixModeConfig[mixModeStage];
        if (!config || wordNumber > config.words) return;
    }
    
    activeWord = wordNumber;
    
    // Visual feedback - highlight active word container
    wordContainer1.classList.toggle('active-word', wordNumber === 1);
    wordContainer2.classList.toggle('active-word', wordNumber === 2);
    wordContainer3.classList.toggle('active-word', wordNumber === 3);
    wordContainer4.classList.toggle('active-word', wordNumber === 4);
    
    // Update input feedback to show which word is active
    const feedback1 = document.getElementById('input-feedback');
    const feedback2 = document.getElementById('input-feedback-2');
    const feedback3 = document.getElementById('input-feedback-3');
    const feedback4 = document.getElementById('input-feedback-4');
    
    if (gameMode === 'double') {
        feedback1.innerHTML = wordNumber === 1 ? 'Word 1 (Active)' : 'Word 1';
        feedback2.innerHTML = wordNumber === 2 ? 'Word 2 (Active)' : 'Word 2';
        feedback3.innerHTML = '';
        feedback4.innerHTML = '';
    } else if (gameMode === 'triple') {
        feedback1.innerHTML = wordNumber === 1 ? 'Word 1 (Active)' : 'Word 1';
        feedback2.innerHTML = wordNumber === 2 ? 'Word 2 (Active)' : 'Word 2';
        feedback3.innerHTML = wordNumber === 3 ? 'Word 3 (Active)' : 'Word 3';
        feedback4.innerHTML = '';
    } else if (gameMode === 'quad') {
        feedback1.innerHTML = wordNumber === 1 ? 'Word 1 (Active)' : 'Word 1';
        feedback2.innerHTML = wordNumber === 2 ? 'Word 2 (Active)' : 'Word 2';
        feedback3.innerHTML = wordNumber === 3 ? 'Word 3 (Active)' : 'Word 3';
        feedback4.innerHTML = wordNumber === 4 ? 'Word 4 (Active)' : 'Word 4';
    } else {
        feedback1.innerHTML = '';
        feedback2.innerHTML = '';
        feedback3.innerHTML = '';
        feedback4.innerHTML = '';
    }
    
    // Re-get the progress text elements since we just changed the HTML
    // Note: These will be used in the next updateUI() call
    
    // Update UI to refresh progress display
    updateUI();
}

// Initialize starting length display (without triggering game reset)
function initStartingLength() {
    const lengthValue = parseInt(startingLengthSlider.value);
    startingLengthValue.textContent = lengthValue + ' letters';
    currentWordLength = lengthValue;
}

// Generate a new word with 4-words-per-length progression
function generateNewWord() {
    // Choose word source (custom text or default words)
    const wordSource = usingCustomText ? customWordsByLength : wordsByLength;
    
    // Handle mix mode
    if (gameMode === 'mix') {
        const config = mixModeConfig[mixModeStage];
        if (config) {
            // Set the word length for this stage
            currentWordLength = config.length;
            
            // Generate words based on current stage
            generateSingleWord(wordSource, 1);
            if (config.words >= 2) {
                generateSingleWord(wordSource, 2);
            }
            if (config.words >= 3) {
                generateSingleWord(wordSource, 3);
            }
            if (config.words >= 4) {
                generateSingleWord(wordSource, 4);
            }
        }
    } else {
        // Regular modes
        // Generate first word
        generateSingleWord(wordSource, 1);
        
        // Generate additional words based on game mode
        if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
            generateSingleWord(wordSource, 2);
        }
        if (gameMode === 'triple' || gameMode === 'quad') {
            generateSingleWord(wordSource, 3);
        }
        if (gameMode === 'quad') {
            generateSingleWord(wordSource, 4);
        }
    }
    
    // Reset game state
    typedLetters = [];
    typedLetters2 = [];
    typedLetters3 = [];
    typedLetters4 = [];
    word1Completed = false;
    word2Completed = false;
    word3Completed = false;
    word4Completed = false;
    gameActive = false;
    
    // Create placeholder boxes with letters initially
    createPlaceholderBoxesWithLetters();
    
    // Handle mix mode or regular modes
    if (gameMode === 'mix') {
        const config = mixModeConfig[mixModeStage];
        if (config && config.words >= 2) {
            createPlaceholderBoxesWithLetters2();
        }
        if (config && config.words >= 3) {
            createPlaceholderBoxesWithLetters3();
        }
        if (config && config.words >= 4) {
            createPlaceholderBoxesWithLetters4();
        }
    } else {
        // Regular modes
        if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
            createPlaceholderBoxesWithLetters2();
        }
        if (gameMode === 'triple' || gameMode === 'quad') {
             createPlaceholderBoxesWithLetters3();
        }
        if (gameMode === 'quad') {
            createPlaceholderBoxesWithLetters4();
        }
    }
    
    // Clear scattered letters
    scatteredLettersContainer.innerHTML = '';
    scatteredLetters = [];
    
    updateUI();
}

// Generate a single word for the specified word number (1, 2, 3, or 4)
function generateSingleWord(wordSource, wordNumber) {
    // Get available words for current length
    const wordList = wordSource[currentWordLength];
    let selectedWord;
    
    // If no words available for this length, fall back to default words
    if (!wordList || wordList.length === 0) {
        const fallbackList = wordsByLength[currentWordLength];
        selectedWord = fallbackList[Math.floor(Math.random() * fallbackList.length)];
    } else {
        // Get unused words (words we haven't used yet at this length)
        const availableWords = wordList.filter(word => !usedWordsAtCurrentLength.includes(word));
        
        // If no available words left, reset and use all words again
        const wordsToChooseFrom = availableWords.length > 0 ? availableWords : wordList;
        
        // Pick a random word from available words
        selectedWord = wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)];
    }
    
    // Add to used words list
    if (!usedWordsAtCurrentLength.includes(selectedWord)) {
        usedWordsAtCurrentLength.push(selectedWord);
    }
    
    // Assign to appropriate word variable
    if (wordNumber === 1) {
        currentWord = selectedWord;
    } else if (wordNumber === 2) {
        currentWord2 = selectedWord;
    } else if (wordNumber === 3) {
        currentWord3 = selectedWord;
    } else if (wordNumber === 4) {
        currentWord4 = selectedWord;
    }
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

// Create placeholder boxes for second word
function createPlaceholderBoxesWithLetters2() {
    placeholderBoxes2.innerHTML = '';
    letterBoxes2 = [];
    
    for (let i = 0; i < currentWord2.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box filled';
        box.dataset.index = i;
        box.dataset.wordNumber = '2'; // Mark as second word
        box.textContent = currentWord2[i]; // Show the letter initially
        placeholderBoxes2.appendChild(box);
        letterBoxes2.push(box);
    }
}

// Create placeholder boxes with letters for third word
function createPlaceholderBoxesWithLetters3() {
    placeholderBoxes3.innerHTML = '';
    letterBoxes3 = [];
    
    for (let i = 0; i < currentWord3.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box filled';
        box.dataset.index = i;
        box.dataset.wordNumber = '3'; // Mark as third word
        box.textContent = currentWord3[i]; // Show the letter initially
        placeholderBoxes3.appendChild(box);
        letterBoxes3.push(box);
    }
}

// Create placeholder boxes with letters for fourth word
function createPlaceholderBoxesWithLetters4() {
    placeholderBoxes4.innerHTML = '';
    letterBoxes4 = [];
    
    for (let i = 0; i < currentWord4.length; i++) {
        const box = document.createElement('div');
        box.className = 'letter-box filled';
        box.dataset.index = i;
        box.dataset.wordNumber = '4'; // Mark as fourth word
        box.textContent = currentWord4[i]; // Show the letter initially
        placeholderBoxes4.appendChild(box);
        letterBoxes4.push(box);
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
    skipCount = 0; // Reset skip count for new game
    
    // Reset game session tracking
    completedWords = [];
    skippedWords = [];
    word1Completed = false;
    word2Completed = false;
    
    // Set initial active word for two-words mode
    if (gameMode === 'double') {
        activeWord = 1; // Initialize first
        setActiveWord(1); // Then set with visual feedback
    }
    
    // Show skip button during gameplay and update its text
    skipWordBtn.style.display = 'inline-block';
    updateSkipButtonText();
    
    // After display time, scatter letters
    setTimeout(() => {
        scatterLettersFromPlaceholders();
    }, displayTime);
    
    updateTimer();
}

// Continue game without resetting skip count (used by animateToNextWord)
function continueGame() {
    if (!currentWord) {
        generateNewWord();
        return;
    }
    
    gameActive = true;
    startTime = Date.now();
    
    // Don't reset skip count when continuing
    // Show skip button during gameplay and update its text
    skipWordBtn.style.display = 'inline-block';
    updateSkipButtonText();
    
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
    let delayCounter = 0;
    
    // Scatter letters from first word
    scatterWordLetters(currentWord, letterBoxes, containerRect, usedPositions, delayCounter, 1);
    delayCounter += currentWord.length;
    
    // Scatter letters from additional words based on game mode
    if (gameMode === 'mix') {
        const config = mixModeConfig[mixModeStage];
        if (config && config.words >= 2) {
            scatterWordLetters(currentWord2, letterBoxes2, containerRect, usedPositions, delayCounter, 2);
            delayCounter += currentWord2.length;
        }
        if (config && config.words >= 3) {
            scatterWordLetters(currentWord3, letterBoxes3, containerRect, usedPositions, delayCounter, 3);
            delayCounter += currentWord3.length;
        }
        if (config && config.words >= 4) {
            scatterWordLetters(currentWord4, letterBoxes4, containerRect, usedPositions, delayCounter, 4);
        }
    } else {
        // Regular modes
        if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
            scatterWordLetters(currentWord2, letterBoxes2, containerRect, usedPositions, delayCounter, 2);
            delayCounter += currentWord2.length;
        }
        if (gameMode === 'triple' || gameMode === 'quad') {
            scatterWordLetters(currentWord3, letterBoxes3, containerRect, usedPositions, delayCounter, 3);
            delayCounter += currentWord3.length;
        }
        if (gameMode === 'quad') {
            scatterWordLetters(currentWord4, letterBoxes4, containerRect, usedPositions, delayCounter, 4);
        }
    }
}

// Helper function to scatter letters from a specific word
function scatterWordLetters(word, boxes, containerRect, usedPositions, startDelay, wordNumber) {
    for (let i = 0; i < word.length; i++) {
        const placeholderBox = boxes[i];
        
        // Create scattered letter
        const letter = document.createElement('div');
        letter.className = 'scattered-letter';
        letter.textContent = word[i];
        letter.dataset.letter = word[i];
        letter.dataset.originalIndex = i;
        letter.dataset.wordNumber = wordNumber; // Track which word this letter belongs to
        
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
        }, (startDelay + i) * 100); // Stagger the animations
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
    if (!gameActive) return;
    
    const key = e.key;
    
    // Handle word switching shortcuts in multi-word modes
    if (gameMode !== 'single') {
        // Get max words for current mode/stage
        let maxWords = 1;
        if (gameMode === 'mix') {
            const config = mixModeConfig[mixModeStage];
            maxWords = config ? config.words : 1;
        } else if (gameMode === 'double') {
            maxWords = 2;
        } else if (gameMode === 'triple') {
            maxWords = 3;
        } else if (gameMode === 'quad') {
            maxWords = 4;
        }
        
        if (key === '1' && maxWords >= 1) {
            setActiveWord(1);
            e.preventDefault();
            return;
        }
        if (key === '2' && maxWords >= 2) {
            setActiveWord(2);
            e.preventDefault();
            return;
        }
        if (key === '3' && maxWords >= 3) {
            setActiveWord(3);
            e.preventDefault();
            return;
        }
        if (key === '4' && maxWords >= 4) {
            setActiveWord(4);
            e.preventDefault();
            return;
        }
        
        // Arrow key navigation
        if (key === 'ArrowUp') {
            setActiveWord(activeWord > 1 ? activeWord - 1 : maxWords);
            e.preventDefault();
            return;
        }
        if (key === 'ArrowDown') {
            setActiveWord(activeWord < maxWords ? activeWord + 1 : 1);
            e.preventDefault();
            return;
        }
    }
    
    const keyUpper = key.toUpperCase();
    
    if (keyUpper === 'BACKSPACE') {
        handleBackspace();
        e.preventDefault();
        return;
    }
    
    // Check if it's a valid letter and we have scattered letters available
    if (keyUpper.length === 1 && keyUpper.match(/[A-Z]/) && scatteredLetters.length > 0) {
        handleLetterInput(keyUpper);
        e.preventDefault();
    }
}

// Handle letter input
function handleLetterInput(letter) {
    if (gameMode === 'single') {
        // Single word mode - existing logic
        const expectedLetter = currentWord[typedLetters.length];
        
        if (letter === expectedLetter) {
            handleCorrectLetter(letter, 1);
        } else {
            handleWrongLetter(letter, 1);
        }
    } else {
        // Multi-word mode - check active word
        let word, typed;
        if (activeWord === 1) {
            word = currentWord;
            typed = typedLetters;
        } else if (activeWord === 2) {
            word = currentWord2;
            typed = typedLetters2;
        } else if (activeWord === 3) {
            word = currentWord3;
            typed = typedLetters3;
        } else if (activeWord === 4) {
            word = currentWord4;
            typed = typedLetters4;
        }
        
        const expectedLetter = word[typed.length];
        
        if (letter === expectedLetter) {
            handleCorrectLetter(letter, activeWord);
        } else {
            handleWrongLetter(letter, activeWord);
        }
    }
}

// Handle wrong letter input
function handleWrongLetter(letter, wordNumber = 1) {
    let currentTyped, currentBoxes;
    
    if (wordNumber === 1) {
        currentTyped = typedLetters;
        currentBoxes = letterBoxes;
    } else if (wordNumber === 2) {
        currentTyped = typedLetters2;
        currentBoxes = letterBoxes2;
    } else if (wordNumber === 3) {
        currentTyped = typedLetters3;
        currentBoxes = letterBoxes3;
    } else if (wordNumber === 4) {
        currentTyped = typedLetters4;
        currentBoxes = letterBoxes4;
    }
    
    const letterIndex = currentTyped.length;
    const targetBox = currentBoxes[letterIndex];
    
    if (!targetBox) return; // No more boxes available
    
    // Find a scattered letter with this character from the correct word
    let scatteredLetter = scatteredLetters.find(l => 
        l.dataset.letter === letter && 
        l.dataset.wordNumber === wordNumber.toString()
    );
    
    // If no letter found from this word, find any letter with this character (fallback)
    if (!scatteredLetter) {
        scatteredLetter = scatteredLetters.find(l => l.dataset.letter === letter);
    }
    
    if (scatteredLetter && targetBox) {
        // Animate letter moving to placeholder (but as wrong/red)
        moveWrongLetterToPlaceholder(scatteredLetter, targetBox, letterIndex, letter);
        
        // Add to typed letters for the appropriate word
        currentTyped.push(letter);
        
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
function handleCorrectLetter(letter, wordNumber = 1) {
    let currentTyped, currentTargetWord, currentBoxes;
    
    if (wordNumber === 1) {
        currentTyped = typedLetters;
        currentTargetWord = currentWord;
        currentBoxes = letterBoxes;
    } else if (wordNumber === 2) {
        currentTyped = typedLetters2;
        currentTargetWord = currentWord2;
        currentBoxes = letterBoxes2;
    } else if (wordNumber === 3) {
        currentTyped = typedLetters3;
        currentTargetWord = currentWord3;
        currentBoxes = letterBoxes3;
    } else if (wordNumber === 4) {
        currentTyped = typedLetters4;
        currentTargetWord = currentWord4;
        currentBoxes = letterBoxes4;
    }
    
    const letterIndex = currentTyped.length;
    const targetBox = currentBoxes[letterIndex];
    
    // Find the scattered letter that belongs to this word
    let scatteredLetter = scatteredLetters.find(l => 
        l.dataset.letter === letter && 
        l.dataset.wordNumber === wordNumber.toString() &&
        parseInt(l.dataset.originalIndex) === letterIndex
    );
    
    // If no exact match found, find any letter with the same character from this word
    if (!scatteredLetter) {
        scatteredLetter = scatteredLetters.find(l => 
            l.dataset.letter === letter && 
            l.dataset.wordNumber === wordNumber.toString()
        );
    }
    
    // Final fallback - find any letter with the same character (for compatibility)
    if (!scatteredLetter) {
        scatteredLetter = scatteredLetters.find(l => l.dataset.letter === letter);
    }
    
    if (scatteredLetter && targetBox) {
        // Animate letter moving to placeholder
        moveLetterToPlaceholder(scatteredLetter, targetBox, letterIndex);
        
        // Add to typed letters for the appropriate word
        currentTyped.push(letter);
        
        // Check if this word is complete and all letters are correct
        if (currentTyped.length === currentTargetWord.length) {
            const isWordCorrect = currentTyped.every((letter, index) => letter === currentTargetWord[index]);
            if (isWordCorrect) {
                // Mark this word as completed
                if (wordNumber === 1) {
                    word1Completed = true;
                } else if (wordNumber === 2) {
                    word2Completed = true;
                } else if (wordNumber === 3) {
                    word3Completed = true;
                } else if (wordNumber === 4) {
                    word4Completed = true;
                }
                
                // Check if we should move to next words
                checkAllWordsCompleted();
            }
        }
        
        updateUI();
    }
}

// Check if all required words are completed
function checkAllWordsCompleted() {
    if (gameMode === 'mix') {
        // Mix mode - check based on current stage
        const config = mixModeConfig[mixModeStage];
        if (!config) return;
        
        let allCompleted = word1Completed;
        if (config.words >= 2) allCompleted = allCompleted && word2Completed;
        if (config.words >= 3) allCompleted = allCompleted && word3Completed;
        if (config.words >= 4) allCompleted = allCompleted && word4Completed;
        
        if (allCompleted) {
            mixModeWordsCompleted++;
            if (mixModeWordsCompleted >= config.wordsNeeded) {
                // Move to next stage
                setTimeout(() => {
                    advanceMixModeStage();
                }, 500);
            } else {
                // Continue with same stage
                setTimeout(() => {
                    completeWord();
                }, 500);
            }
        } else {
            // Handle automatic word switching for current stage
            handleMixModeWordSwitching(config);
        }
    } else if (gameMode === 'single') {
        // Single word mode - complete when word1 is done
        if (word1Completed) {
            setTimeout(() => {
                completeWord();
            }, 500);
        }
    } else if (gameMode === 'double') {
        // Two words mode - handle automatic switching and completion
        if (word1Completed && !word2Completed) {
            // First word completed, automatically switch to second word
            setTimeout(() => {
                setActiveWord(2);
            }, 100);
        } else if (word2Completed && !word1Completed) {
            // Second word completed, switch back to first word
            setTimeout(() => {
                setActiveWord(1);
            }, 100);
        } else if (word1Completed && word2Completed) {
            // Both words completed - move to next words
            setTimeout(() => {
                completeWord();
            }, 500);
        }
    } else if (gameMode === 'triple') {
        // Three words mode - handle automatic switching and completion
        const completedWords = [word1Completed, word2Completed, word3Completed];
        const completedCount = completedWords.filter(Boolean).length;
        
        if (completedCount === 3) {
            // All three words completed
            setTimeout(() => {
                completeWord();
            }, 500);
        } else {
            // Find next incomplete word and switch to it
            const nextIncomplete = completedWords.findIndex(completed => !completed) + 1;
            if (nextIncomplete > 0 && nextIncomplete !== activeWord) {
                setTimeout(() => {
                    setActiveWord(nextIncomplete);
                }, 100);
            }
        }
    } else if (gameMode === 'quad') {
        // Four words mode - handle automatic switching and completion
        const completedWords = [word1Completed, word2Completed, word3Completed, word4Completed];
        const completedCount = completedWords.filter(Boolean).length;
        
        if (completedCount === 4) {
            // All four words completed
            setTimeout(() => {
                completeWord();
            }, 500);
        } else {
            // Find next incomplete word and switch to it
            const nextIncomplete = completedWords.findIndex(completed => !completed) + 1;
            if (nextIncomplete > 0 && nextIncomplete !== activeWord) {
                setTimeout(() => {
                    setActiveWord(nextIncomplete);
                }, 100);
            }
        }
    }
}

// Handle word switching in mix mode
function handleMixModeWordSwitching(config) {
    if (config.words === 1) return; // Single word, no switching needed
    
    // Find next incomplete word and switch to it
    const completedWords = [word1Completed, word2Completed, word3Completed, word4Completed];
    const nextIncomplete = completedWords.slice(0, config.words).findIndex(completed => !completed) + 1;
    if (nextIncomplete > 0 && nextIncomplete !== activeWord) {
        setTimeout(() => {
            setActiveWord(nextIncomplete);
        }, 100);
    }
}

// Advance to next stage in mix mode
function advanceMixModeStage() {
    mixModeStage++;
    mixModeWordsCompleted = 0;
    
    // Check if we've completed all stages
    if (mixModeStage > Object.keys(mixModeConfig).length) {
        // Completed all stages! Show victory message
        showMixModeVictory();
        return;
    }
    
    // Update display for new stage
    updateMixModeDisplay();
    
    // Generate new words for the new stage immediately
    completeWord();
}

// Show mix mode victory
function showMixModeVictory() {
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');
    const messageOverlay = document.getElementById('message-overlay');
    
    messageTitle.textContent = 'Mix Mode Completed!';
    messageText.innerHTML = `
        <div style="text-align: center; margin: 20px 0;">
            <div style="font-size: 1.5em; color: #4CAF50; margin-bottom: 15px;">🎉 Congratulations! 🎉</div>
            <div style="margin-bottom: 10px;">You've completed all ${Object.keys(mixModeConfig).length} stages!</div>
            <div style="color: #888; margin-bottom: 20px;">
                From single 3-letter words to four 7-letter words!
            </div>
            <div style="color: #4CAF50; font-weight: bold;">
                Final Score: ${score}
            </div>
        </div>
    `;
    
    messageOverlay.style.display = 'flex';
    
    // Reset mix mode
    mixModeStage = 1;
    mixModeWordsCompleted = 0;
    gameActive = false;
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
    // In single mode, always use word 1
    const wordToUse = gameMode === 'single' ? 1 : activeWord;
    
    let currentTyped, currentTargetWord, currentBoxes;
    if (wordToUse === 1) {
        currentTyped = typedLetters;
        currentTargetWord = currentWord;
        currentBoxes = letterBoxes;
    } else if (wordToUse === 2) {
        currentTyped = typedLetters2;
        currentTargetWord = currentWord2;
        currentBoxes = letterBoxes2;
    } else if (wordToUse === 3) {
        currentTyped = typedLetters3;
        currentTargetWord = currentWord3;
        currentBoxes = letterBoxes3;
    } else if (wordToUse === 4) {
        currentTyped = typedLetters4;
        currentTargetWord = currentWord4;
        currentBoxes = letterBoxes4;
    }
    
    if (currentTyped.length === 0) return;
    
    const lastLetterIndex = currentTyped.length - 1;
    const lastLetter = currentTyped[lastLetterIndex];
    const targetBox = currentBoxes[lastLetterIndex];
    
    // Create scattered letter again at the placeholder position first
    const scatteredLetter = document.createElement('div');
    scatteredLetter.className = 'scattered-letter';
    scatteredLetter.textContent = lastLetter;
    scatteredLetter.dataset.letter = lastLetter;
    scatteredLetter.dataset.wordNumber = wordToUse.toString();
    
    // Set originalIndex - if it's the correct letter for this position, use the position
    // Otherwise, find where this letter should originally belong in the word
    let originalIndex = -1;
    if (lastLetter === currentTargetWord[lastLetterIndex]) {
        originalIndex = lastLetterIndex;
    } else {
        // Find the first occurrence of this letter in the word that hasn't been placed yet
        for (let i = 0; i < currentTargetWord.length; i++) {
            if (currentTargetWord[i] === lastLetter && i >= currentTyped.length - 1) {
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
    
    // Remove from typed letters for the correct word
    currentTyped.pop();
    
    // Reset completion flag if word was completed
    if (wordToUse === 1) {
        word1Completed = false;
    } else {
        word2Completed = false;
    }
    
    updateUI();
}

// Complete the word
function completeWord() {
    gameActive = false;
    score += 10 * level; // More points for higher levels
    
    // Track completed words based on game mode
    completedWords.push(currentWord);
    if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
        completedWords.push(currentWord2);
    }
    if (gameMode === 'triple' || gameMode === 'quad') {
        completedWords.push(currentWord3);
    }
    if (gameMode === 'quad') {
        completedWords.push(currentWord4);
    }
    
    // Increment words completed at current length
    wordsCompletedAtCurrentLength++;
    
    // Add completion animation to letter boxes
    animateWordCompletion();
    
    // Continue to next word with animated transition
    setTimeout(() => {
        level++;
        
        // Check if we need to increase word length (based on user settings)
        if (wordsCompletedAtCurrentLength >= wordsPerLength[currentWordLength]) {
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
    
    // Letter victory dance animation for all active word containers
    animateBoxesCompletion(letterBoxes);
    if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
        animateBoxesCompletion(letterBoxes2);
    }
    if (gameMode === 'triple' || gameMode === 'quad') {
        animateBoxesCompletion(letterBoxes3);
    }
    if (gameMode === 'quad') {
        animateBoxesCompletion(letterBoxes4);
    }
}

// Helper function to animate letter boxes completion
function animateBoxesCompletion(boxes) {
    boxes.forEach((box, index) => {
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
    // Stop victory animation for all active word containers
    stopVictoryAnimations(letterBoxes);
    if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
        stopVictoryAnimations(letterBoxes2);
    }
    if (gameMode === 'triple' || gameMode === 'quad') {
        stopVictoryAnimations(letterBoxes3);
    }
    if (gameMode === 'quad') {
        stopVictoryAnimations(letterBoxes4);
    }
    
    // Clean fade out with gentle scale for all active containers
    animateFadeOut(letterBoxes);
    if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
        animateFadeOut(letterBoxes2);
    }
    if (gameMode === 'triple' || gameMode === 'quad') {
        animateFadeOut(letterBoxes3);
    }
    if (gameMode === 'quad') {
        animateFadeOut(letterBoxes4);
    }
    
    // Generate new word after fade out completes
    setTimeout(() => {
        generateNewWord();
        updateUI();
        
        // Clean fade in with gentle scale for all active containers
        setTimeout(() => {
            animateFadeIn(letterBoxes);
            if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
                animateFadeIn(letterBoxes2);
            }
            if (gameMode === 'triple' || gameMode === 'quad') {
                animateFadeIn(letterBoxes3);
            }
            if (gameMode === 'quad') {
                animateFadeIn(letterBoxes4);
            }
            
            // Start scattering after fade in
            setTimeout(() => {
                scatterLettersFromPlaceholders();
                gameActive = true;
            }, 600);
        }, 100);
    }, 800);
}

// Helper functions for animation
function stopVictoryAnimations(boxes) {
    boxes.forEach(box => {
        box.style.animation = 'none';
    });
}

function animateFadeOut(boxes) {
    boxes.forEach((box, index) => {
        setTimeout(() => {
            box.style.transition = 'all 0.4s ease-out';
            box.style.transform = 'scale(0.9)';
            box.style.opacity = '0';
            
            // Clear the content and styling immediately as it fades
            setTimeout(() => {
                box.textContent = '';
                box.classList.remove('filled', 'error');
                // Remove inline styles to let CSS classes work
                box.style.background = '';
                box.style.borderColor = '';
                box.style.boxShadow = '';
            }, 200); // Clear styling halfway through fade
        }, index * 60);
    });
}

function animateFadeIn(boxes) {
    boxes.forEach((box, index) => {
        // Reset styling first - remove inline styles to let CSS classes work
        box.style.background = '';
        box.style.boxShadow = '';
        box.style.borderColor = '';
        
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

// Skip current word (don't increase level)
function skipWord() {
    if (!gameActive) return;
    
    // Track skipped word
    skippedWords.push(currentWord);
    
    skipCount++;
    
    // Check if skip limit reached
    if (skipCount >= 3) {
        gameActive = false;
        showGameOverSummary();
        skipWordBtn.style.display = 'none';
        return;
    }
    
    // Update skip button text immediately after incrementing
    updateSkipButtonText();
    
    hideMessage();
    // Don't increase level since word was skipped
    // Use the same animation flow as normal word completion
    animateToNextWord();
}

// Reset to menu
function resetToMenu() {
    hideMessage();
    gameActive = false;
    score = 0;
    level = 1;
    skipCount = 0; // Reset skip count
    
    // Hide skip button when not in game
    skipWordBtn.style.display = 'none';
    
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
    
    // Show stage info for mix mode, level for others
    if (gameMode === 'mix') {
        const config = mixModeConfig[mixModeStage];
        if (config) {
            levelEl.textContent = `Stage ${mixModeStage} (${mixModeWordsCompleted}/${config.wordsNeeded})`;
        }
    } else {
        levelEl.textContent = level;
    }
    
    // Update progress for word 1
    const currentProgressText = document.getElementById('progress-text');
    if (currentProgressText) {
        currentProgressText.textContent = typedLetters.join('');
    }
    if (typedLettersEl) {
        typedLettersEl.textContent = typedLetters.join(' ');
    }
    
    // Update progress for word 2 (if in multi-word modes)
    if (gameMode === 'double' || gameMode === 'triple' || gameMode === 'quad') {
        const currentProgressText2 = document.getElementById('progress-text-2');
        const currentTypedLettersEl2 = document.getElementById('typed-letters-2');
        
        if (currentProgressText2) {
            currentProgressText2.textContent = typedLetters2.join('');
        }
        if (currentTypedLettersEl2) {
            currentTypedLettersEl2.textContent = typedLetters2.join(' ');
        }
    }
    
    // Update progress for word 3 (if in triple or quad modes)
    if (gameMode === 'triple' || gameMode === 'quad') {
        const currentProgressText3 = document.getElementById('progress-text-3');
        const currentTypedLettersEl3 = document.getElementById('typed-letters-3');
        
        if (currentProgressText3) {
            currentProgressText3.textContent = typedLetters3.join('');
        }
        if (currentTypedLettersEl3) {
            currentTypedLettersEl3.textContent = typedLetters3.join(' ');
        }
    }
    
    // Update progress for word 4 (if in quad mode)
    if (gameMode === 'quad') {
        const currentProgressText4 = document.getElementById('progress-text-4');
        const currentTypedLettersEl4 = document.getElementById('typed-letters-4');
        
        if (currentProgressText4) {
            currentProgressText4.textContent = typedLetters4.join('');
        }
        if (currentTypedLettersEl4) {
            currentTypedLettersEl4.textContent = typedLetters4.join(' ');
        }
    }
    
    // Skip button text is updated separately to avoid flickering during animations
}

// Update skip button text
function updateSkipButtonText() {
    const remainingSkips = 3 - skipCount;
    if (skipCount < 3) {
        skipWordBtn.textContent = `Skip Word (${remainingSkips} left)`;
    } else {
        skipWordBtn.textContent = 'Skip Word';
    }
}

// Show game over summary with word performance
function showGameOverSummary() {
    const messageContent = document.getElementById('message-content');
    
    // Create custom game over content
    const totalWords = completedWords.length + skippedWords.length;
    
    let wordListHtml = '';
    if (totalWords > 0) {
        // Show completed words in green
        completedWords.forEach(word => {
            wordListHtml += `<span class="completed-word">${word}</span> `;
        });
        
        // Show skipped words in white/gray
        skippedWords.forEach(word => {
            wordListHtml += `<span class="skipped-word">${word}</span> `;
        });
    }
    
    messageContent.innerHTML = `
        <h2>Game Over!</h2>
        <p>You used all 3 skips. Final Score: <strong>${score}</strong></p>
        <div class="game-summary">
            <p><strong>Performance Summary:</strong></p>
            <p>✓ Completed: ${completedWords.length} words</p>
            <p>⏭ Skipped: ${skippedWords.length} words</p>
            ${wordListHtml ? `<div class="word-list">${wordListHtml}</div>` : ''}
        </div>
        <button id="restart-btn">Restart Game</button>
        <button id="menu-btn">Main Menu</button>
    `;
    
    // Show the overlay
    messageOverlay.classList.add('show');
    
    // Add event listeners for both buttons
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    
    restartBtn.addEventListener('click', restartGame);
    menuBtn.addEventListener('click', resetToMenu);
}

// Restart game with current settings
function restartGame() {
    hideMessage();
    // Don't reset settings, just restart the game
    startGame();
}

// Custom text functions
function showTextInput() {
    textInputOverlay.classList.add('show');
    customTextArea.focus();
}

function hideTextInput() {
    textInputOverlay.classList.remove('show');
    textStats.classList.remove('show');
    customTextArea.value = '';
}

function processCustomText() {
    const inputText = customTextArea.value.trim();
    
    if (inputText.length < 50) {
        alert('Please enter at least 50 characters of text for better word variety.');
        return;
    }
    
    // Extract and process words
    const extractedWords = extractWordsFromText(inputText);
    
    if (Object.keys(extractedWords).length === 0) {
        alert('Could not extract enough valid words from the text. Please try a different text.');
        return;
    }
    
    // Set the custom words
    customWordsByLength = extractedWords;
    usingCustomText = true;
    
    // Show statistics
    showTextStatistics(extractedWords);
    
    // Reset game progression
    resetWordProgression();
    
    // Generate new word and close modal
    setTimeout(() => {
        hideTextInput();
        generateNewWord();
        updateUI();
    }, 2000);
}

function useDefaultWords() {
    usingCustomText = false;
    customWordsByLength = null;
    resetWordProgression();
    hideTextInput();
    generateNewWord();
    updateUI();
}

function extractWordsFromText(text) {
    // Clean and split text into words
    const words = text
        .toUpperCase()
        .replace(/[^A-Z\s]/g, ' ') // Replace non-letters with spaces
        .split(/\s+/) // Split on whitespace
        .filter(word => word.length >= 3 && word.length <= 10) // Only words 3-10 letters
        .filter(word => /^[A-Z]+$/.test(word)); // Only pure letter words
    
    // Group words by length
    const wordsByLength = {};
    for (let length = 3; length <= 10; length++) {
        wordsByLength[length] = [];
    }
    
    // Add words to appropriate length groups (avoid duplicates)
    words.forEach(word => {
        const length = word.length;
        if (!wordsByLength[length].includes(word)) {
            wordsByLength[length].push(word);
        }
    });
    
    // Remove empty length categories
    Object.keys(wordsByLength).forEach(length => {
        if (wordsByLength[length].length === 0) {
            delete wordsByLength[length];
        }
    });
    
    return wordsByLength;
}

function showTextStatistics(extractedWords) {
    let statsHTML = '<strong>Words extracted:</strong><br>';
    let totalWords = 0;
    
    for (let length = 3; length <= 10; length++) {
        if (extractedWords[length] && extractedWords[length].length > 0) {
            const count = extractedWords[length].length;
            totalWords += count;
            statsHTML += `${length} letters: ${count} words<br>`;
        }
    }
    
    statsHTML += `<br><strong>Total: ${totalWords} unique words</strong>`;
    statsHTML += '<br><em>Starting game with your custom text...</em>';
    
    textStats.innerHTML = statsHTML;
    textStats.classList.add('show');
}

function resetWordProgression() {
    currentWordLength = parseInt(startingLengthSlider.value);
    wordsCompletedAtCurrentLength = 0;
    usedWordsAtCurrentLength = [];
}

// Panel functions
function togglePanel() {
    const isOpen = leftPanel.classList.contains('open');
    
    if (isOpen) {
        leftPanel.classList.remove('open');
        gameContainer.classList.remove('panel-open');
        panelToggle.textContent = '▶';
    } else {
        leftPanel.classList.add('open');
        gameContainer.classList.add('panel-open');
        panelToggle.textContent = '◀';
    }
}

function initializePanel() {
    // Create controls for each word length
    wordsPerLengthControls.innerHTML = '';
    
    for (let length = 3; length <= 10; length++) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'word-length-control';
        
        const label = document.createElement('span');
        label.className = 'word-length-label';
        label.textContent = `${length} letters:`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'word-count-input';
        input.value = wordsPerLength[length];
        input.min = 1;
        input.max = 50;
        input.dataset.length = length;
        
        // Update the setting when input changes
        input.addEventListener('input', function() {
            const lengthValue = parseInt(this.dataset.length);
            const countValue = Math.max(1, Math.min(50, parseInt(this.value) || 1));
            this.value = countValue;
            wordsPerLength[lengthValue] = countValue;
        });
        
        controlDiv.appendChild(label);
        controlDiv.appendChild(input);
        wordsPerLengthControls.appendChild(controlDiv);
    }
}

function resetWordsPerLength() {
    // Reset all values to 5
    for (let length = 3; length <= 10; length++) {
        wordsPerLength[length] = 5;
    }
    
    // Update input values
    const inputs = wordsPerLengthControls.querySelectorAll('.word-count-input');
    inputs.forEach(input => {
        input.value = 5;
    });
    
    // Show feedback
    showPanelFeedback('Settings reset to defaults (5 words each)', 'info');
}

function applyWordsPerLengthSettings() {
    // Reset the game progression with new settings
    resetWordProgression();
    generateNewWord();
    updateUI();
    
    // Show feedback
    const totalWords = Object.values(wordsPerLength).reduce((sum, count) => sum + count, 0);
    showPanelFeedback(`Settings applied! Total: ${totalWords} words`, 'success');
}

function showPanelFeedback(message, type = 'info') {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `panel-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: absolute;
        top: 70px;
        left: 20px;
        right: 20px;
        padding: 10px;
        border-radius: 5px;
        font-size: 0.9rem;
        font-weight: bold;
        z-index: 600;
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: rgba(76, 175, 80, 0.9); color: white;' : 
          type === 'info' ? 'background: rgba(33, 150, 243, 0.9); color: white;' : 
          'background: rgba(255, 152, 0, 0.9); color: white;'}
    `;
    
    leftPanel.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-20px)';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 3000);
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', init);
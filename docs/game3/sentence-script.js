// Game state variables
let currentSentence = '';
let currentSentence2 = ''; // Second sentence for two-sentence mode
let sentenceWords = [];
let sentenceWords2 = []; // Second sentence words
let scatteredWords = [];
let typedWords = [];
let typedWords2 = []; // Typed words for second sentence
let gameActive = false;
let displayTime = 5000; // 5 seconds default for sentences
let score = 0;
let level = 1;
let lives = 3; // Player starts with 3 lives
let startTime = 0;
let skipCount = 0; // Track number of skips used
let sentenceMode = 'single'; // 'single', 'double', 'progressive'
let activeSentence = 1; // Which sentence is currently being typed (1 or 2)
let sentence1Completed = false; // Track if first sentence is completed
let sentence2Completed = false; // Track if second sentence is completed
let difficulty = 'easy'; // 'easy', 'medium', 'hard'

// Game session tracking
let completedSentences = []; // Sentences that were completed successfully  
let skippedSentences = []; // Sentences that were skipped

// Sentence progression variables
let currentDifficulty = 'easy';
let sentencesCompletedAtCurrentLevel = 0;
let usedSentencesAtCurrentLevel = [];

// Custom text variables
let customSentencesByDifficulty = null; // Will store sentences extracted from custom text
let usingCustomText = false; // Flag to track if we're using custom text

// Progressive mode variables
let progressiveStage = 1; // Current stage in progressive mode
let progressiveSentencesCompleted = 0; // Sentences completed in current stage
let progressiveConfig = {
    1: { sentences: 1, difficulty: 'easy', sentencesNeeded: 3 },
    2: { sentences: 1, difficulty: 'medium', sentencesNeeded: 3 },
    3: { sentences: 2, difficulty: 'easy', sentencesNeeded: 2 },
    4: { sentences: 2, difficulty: 'medium', sentencesNeeded: 2 },
    5: { sentences: 2, difficulty: 'hard', sentencesNeeded: 2 }
};

// Sentence collections organized by difficulty
// Use sentences from common words library (loaded from common-words.js)
// Check if CommonWords is available and fallback if not
let sentencesByDifficulty;
if (window.CommonWordsLibrary && window.CommonWordsLibrary.sentencesByDifficulty) {
    sentencesByDifficulty = window.CommonWordsLibrary.sentencesByDifficulty;
    console.log('Using common sentences library');
} else {
    // Fallback sentences in case common-words.js fails to load
    sentencesByDifficulty = {
        easy: ['THE CAT RAN FAST', 'BIRDS FLY HIGH', 'SUN IS BRIGHT'],
        medium: ['THE BEAUTIFUL GARDEN HAS MANY FLOWERS', 'STUDENTS LEARN EVERY DAY'],
        hard: ['THE MAGNIFICENT AURORA DANCED ACROSS THE SKY']
    };
    console.warn('Common words library not found, using fallback sentences');
}

// DOM elements
const displayTimeSlider = document.getElementById('display-time');
const displayTimeValue = document.getElementById('display-time-value');
const wordSpacingSlider = document.getElementById('word-spacing');
const wordSpacingValue = document.getElementById('word-spacing-value');
const sentenceModeSelect = document.getElementById('sentence-mode');
const startBtn = document.getElementById('start-btn');
const placeholderWords1 = document.getElementById('placeholder-words-1');
const placeholderWords2 = document.getElementById('placeholder-words-2');
const sentenceWrapper1 = document.getElementById('sentence-wrapper-1');
const sentenceWrapper2 = document.getElementById('sentence-wrapper-2');
const scatteredWordsContainer = document.getElementById('scattered-words');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const timerEl = document.getElementById('timer');
const messageOverlay = document.getElementById('message-overlay');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const nextSentenceBtn = document.getElementById('next-sentence-btn');
const skipSentenceBtn = document.getElementById('skip-sentence-btn');
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
const applySettingsBtn = document.getElementById('apply-settings');
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');

function init() {
    setupEventListeners();
    updateDisplayTime();
    updateWordSpacing();
    initializePanel();
    updateSentenceMode();
    generateNewSentence();
    updateUI();
}

// Setup event listeners
function setupEventListeners() {
    displayTimeSlider.addEventListener('input', updateDisplayTime);
    wordSpacingSlider.addEventListener('input', updateWordSpacing);
    sentenceModeSelect.addEventListener('change', updateSentenceMode);
    startBtn.addEventListener('click', startGame);
    nextSentenceBtn.addEventListener('click', nextSentence);
    skipSentenceBtn.addEventListener('click', skipSentence);
    menuBtn.addEventListener('click', resetToMenu);
    
    // Custom text listeners
    customTextBtn.addEventListener('click', showTextInput);
    processTextBtn.addEventListener('click', processCustomText);
    useDefaultBtn.addEventListener('click', useDefaultSentences);
    cancelTextBtn.addEventListener('click', hideTextInput);
    
    // Panel listeners
    panelToggle.addEventListener('click', togglePanel);
    applySettingsBtn.addEventListener('click', applySettings);
    
    // Difficulty change listeners
    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', updateDifficulty);
    });
    
    document.addEventListener('keydown', handleKeyPress);
}

// Update display time
function updateDisplayTime() {
    const value = parseFloat(displayTimeSlider.value);
    displayTime = value * 1000;
    displayTimeValue.textContent = value.toFixed(1) + 's';
}

// Update word spacing
function updateWordSpacing() {
    const spacing = parseInt(wordSpacingSlider.value);
    wordSpacingValue.textContent = spacing + 'px';
    document.documentElement.style.setProperty('--word-spacing', spacing + 'px');
}

// Update sentence mode
function updateSentenceMode() {
    sentenceMode = sentenceModeSelect.value;
    
    // Reset progressive mode when changing modes
    if (sentenceMode === 'progressive') {
        progressiveStage = 1;
        progressiveSentencesCompleted = 0;
    }
    
    // Hide all sentence containers first
    sentenceWrapper2.style.display = 'none';
    
    // Show appropriate containers based on mode
    if (sentenceMode === 'double') {
        sentenceWrapper2.style.display = 'block';
        activeSentence = 1;
    } else if (sentenceMode === 'progressive') {
        const config = progressiveConfig[progressiveStage];
        if (config && config.sentences >= 2) {
            sentenceWrapper2.style.display = 'block';
            activeSentence = 1;
        }
    }
    
    generateNewSentence();
    updateUI();
}

// Update difficulty
function updateDifficulty() {
    const selectedRadio = document.querySelector('input[name="difficulty"]:checked');
    difficulty = selectedRadio.value;
    currentDifficulty = difficulty;
}

// Apply settings
function applySettings() {
    updateDifficulty();
    generateNewSentence();
    updateUI();
    
    // Show feedback
    const feedback = document.createElement('div');
    feedback.textContent = 'Settings applied!';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) translateY(-20px)';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 2000);
}

// Generate new sentence
function generateNewSentence() {
    // Choose sentence source (custom text or default sentences)
    const sentenceSource = usingCustomText ? customSentencesByDifficulty : sentencesByDifficulty;
    
    // Handle progressive mode
    if (sentenceMode === 'progressive') {
        const config = progressiveConfig[progressiveStage];
        if (config) {
            // Set the difficulty for this stage
            currentDifficulty = config.difficulty;
            
            // Generate sentences based on current stage
            generateSingleSentence(sentenceSource, 1);
            if (config.sentences >= 2) {
                generateSingleSentence(sentenceSource, 2);
            }
        }
    } else if (sentenceMode === 'double') {
        generateSingleSentence(sentenceSource, 1);
        generateSingleSentence(sentenceSource, 2);
    } else {
        generateSingleSentence(sentenceSource, 1);
    }
    
    createPlaceholderBoxes();
}

// Generate single sentence
function generateSingleSentence(sentenceSource, sentenceNumber) {
    const sentences = sentenceSource[currentDifficulty] || sentencesByDifficulty[currentDifficulty];
    
    // Filter out already used sentences
    const availableSentences = sentences.filter(sentence => 
        !usedSentencesAtCurrentLevel.includes(sentence)
    );
    
    // If no unused sentences, reset the used sentences list
    if (availableSentences.length === 0) {
        usedSentencesAtCurrentLevel = [];
        availableSentences.push(...sentences);
    }
    
    // Pick random sentence
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    const selectedSentence = availableSentences[randomIndex];
    
    if (sentenceNumber === 1) {
        currentSentence = selectedSentence;
        sentenceWords = currentSentence.split(' ');
    } else if (sentenceNumber === 2) {
        currentSentence2 = selectedSentence;
        sentenceWords2 = currentSentence2.split(' ');
    }
    
    // Add to used sentences
    usedSentencesAtCurrentLevel.push(selectedSentence);
}

// Create placeholder boxes for words
function createPlaceholderBoxes() {
    // Clear existing boxes
    placeholderWords1.innerHTML = '';
    placeholderWords2.innerHTML = '';
    
    // Create boxes for first sentence
    sentenceWords.forEach((word, index) => {
        const box = document.createElement('div');
        box.className = 'word-box';
        box.textContent = word; // Show the word initially
        box.dataset.wordIndex = index;
        box.dataset.sentenceNumber = '1';
        box.style.minWidth = (word.length * 12 + 20) + 'px';
        placeholderWords1.appendChild(box);
    });
    
    // Create boxes for second sentence if needed
    if (sentenceMode === 'double' || (sentenceMode === 'progressive' && progressiveConfig[progressiveStage]?.sentences >= 2)) {
        sentenceWords2.forEach((word, index) => {
            const box = document.createElement('div');
            box.className = 'word-box';
            box.textContent = word; // Show the word initially
            box.dataset.wordIndex = index;
            box.dataset.sentenceNumber = '2';
            box.style.minWidth = (word.length * 12 + 20) + 'px';
            placeholderWords2.appendChild(box);
        });
    }
    
    // Reset typed words
    typedWords = [];
    typedWords2 = [];
    sentence1Completed = false;
    sentence2Completed = false;
}

// Start game
function startGame() {
    if (!currentSentence) {
        generateNewSentence();
        return;
    }
    
    gameActive = true;
    startTime = Date.now();
    skipCount = 0;
    
    // Reset game session tracking
    completedSentences = [];
    skippedSentences = [];
    sentence1Completed = false;
    sentence2Completed = false;
    
    // Set initial active sentence for two-sentence mode
    if (sentenceMode === 'double') {
        activeSentence = 1;
    }
    
    // Show skip button during gameplay
    skipSentenceBtn.style.display = 'inline-block';
    updateSkipButtonText();
    
    // After display time, scatter words
    setTimeout(() => {
        scatterWordsFromPlaceholders();
    }, displayTime);
    
    updateTimer();
}

// Scatter words from placeholders
function scatterWordsFromPlaceholders() {
    scatteredWords = [];
    scatteredWordsContainer.innerHTML = '';
    
    const containerRect = scatteredWordsContainer.getBoundingClientRect();
    const allWords = [...sentenceWords];
    
    if (sentenceMode === 'double' || (sentenceMode === 'progressive' && progressiveConfig[progressiveStage]?.sentences >= 2)) {
        allWords.push(...sentenceWords2);
    }
    
    // Get all placeholder boxes
    const allBoxes1 = placeholderWords1.querySelectorAll('.word-box');
    const allBoxes2 = placeholderWords2.querySelectorAll('.word-box');
    const allBoxes = [...allBoxes1, ...allBoxes2];
    
    allWords.forEach((word, globalIndex) => {
        const sourceBox = allBoxes[globalIndex];
        if (!sourceBox) return;
        
        // Create scattered word element
        const wordEl = document.createElement('div');
        wordEl.className = 'scattered-word';
        wordEl.textContent = word;
        wordEl.dataset.word = word;
        
        // Determine which sentence this word belongs to
        if (globalIndex < sentenceWords.length) {
            wordEl.dataset.sentenceNumber = '1';
            wordEl.dataset.wordIndex = globalIndex;
        } else {
            wordEl.dataset.sentenceNumber = '2';
            wordEl.dataset.wordIndex = globalIndex - sentenceWords.length;
        }
        
        // Get source position (relative to the container)
        const sourceRect = sourceBox.getBoundingClientRect();
        const containerOffset = scatteredWordsContainer.getBoundingClientRect();
        
        const initialX = sourceRect.left - containerOffset.left;
        const initialY = sourceRect.top - containerOffset.top;
        
        // Set initial position to match placeholder
        wordEl.style.left = initialX + 'px';
        wordEl.style.top = initialY + 'px';
        wordEl.style.transform = 'scale(1)';
        wordEl.style.transition = 'none'; // No transition initially
        
        scatteredWordsContainer.appendChild(wordEl);
        
        // Calculate random final position
        const maxX = containerRect.width - 150;
        const maxY = containerRect.height - 60;
        const finalX = Math.random() * maxX;
        const finalY = Math.random() * maxY;
        
        // Hide the word in placeholder box
        sourceBox.classList.add('hidden');
        sourceBox.textContent = '';
        
        // Animate to final position after a small delay
        setTimeout(() => {
            wordEl.classList.add('scattering');
            wordEl.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            wordEl.style.left = finalX + 'px';
            wordEl.style.top = finalY + 'px';
            wordEl.style.transform = 'scale(1) rotate(' + (Math.random() * 20 - 10) + 'deg)';
            
            // Remove scattering class after animation
            setTimeout(() => {
                wordEl.classList.remove('scattering');
            }, 800);
        }, globalIndex * 100); // Stagger the animations
        
        scatteredWords.push(wordEl);
    });
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!gameActive) return;
    
    // Handle number keys for sentence switching
    if (sentenceMode === 'double' && (e.key === '1' || e.key === '2')) {
        const sentenceNum = parseInt(e.key);
        if (sentenceNum <= 2) {
            activeSentence = sentenceNum;
        }
        return;
    }
    
    // Handle space key for word separation
    if (e.key === ' ') {
        e.preventDefault();
        if (sentenceMode === 'single' || sentenceMode === 'progressive') {
            handleWordInput('', 1);
        } else {
            handleWordInput('', activeSentence);
        }
        return;
    }
    
    // Handle letter input
    if (e.key.match(/^[a-zA-Z]$/)) {
        const letter = e.key.toUpperCase();
        
        if (sentenceMode === 'single' || sentenceMode === 'progressive') {
            handleLetterInput(letter, 1);
        } else {
            handleLetterInput(letter, activeSentence);
        }
    }
}

// Handle letter input for word building
function handleLetterInput(letter, sentenceNumber) {
    // This will be used for building words letter by letter if needed
    // For now, we'll handle clicking on scattered words
}

// Handle word input (clicking on scattered words)
function handleWordInput(word, sentenceNumber) {
    let currentTyped, currentWords, targetContainer;
    
    if (sentenceNumber === 1) {
        currentTyped = typedWords;
        currentWords = sentenceWords;
        targetContainer = placeholderWords1;
    } else if (sentenceNumber === 2) {
        currentTyped = typedWords2;
        currentWords = sentenceWords2;
        targetContainer = placeholderWords2;
    }
    
    const wordIndex = currentTyped.length;
    const targetWord = currentWords[wordIndex];
    
    if (!targetWord) return; // No more words needed
    
    if (word === targetWord) {
        handleCorrectWord(word, sentenceNumber);
    } else {
        handleWrongWord(word, sentenceNumber);
    }
}

// Handle correct word input
function handleCorrectWord(word, sentenceNumber = 1) {
    let currentTyped, currentWords, targetContainer;
    
    if (sentenceNumber === 1) {
        currentTyped = typedWords;
        currentWords = sentenceWords;
        targetContainer = placeholderWords1;
    } else if (sentenceNumber === 2) {
        currentTyped = typedWords2;
        currentWords = sentenceWords2;
        targetContainer = placeholderWords2;
    }
    
    const wordIndex = currentTyped.length;
    const targetBox = targetContainer.children[wordIndex];
    
    if (!targetBox) return;
    
    // Find scattered word element
    const scatteredWord = scatteredWords.find(w => 
        w.dataset.word === word && 
        w.dataset.sentenceNumber === sentenceNumber.toString()
    );
    
    if (scatteredWord && targetBox) {
        // Animate word moving to placeholder
        moveWordToPlaceholder(scatteredWord, targetBox, wordIndex, word);
        
        // Add to typed words
        currentTyped.push(word);
        
        // Check if sentence is complete
        if (currentTyped.length === currentWords.length) {
            const isCorrect = currentTyped.every((w, i) => w === currentWords[i]);
            if (isCorrect) {
                if (sentenceNumber === 1) {
                    sentence1Completed = true;
                } else if (sentenceNumber === 2) {
                    sentence2Completed = true;
                }
                
                // Check if all required sentences are complete
                if (sentenceMode === 'single' || (sentenceMode === 'double' && sentence1Completed && sentence2Completed) ||
                    (sentenceMode === 'progressive' && checkProgressiveCompletion())) {
                    setTimeout(() => {
                        completeSentenceLevel();
                    }, 500);
                }
            }
        }
        
        updateUI();
    }
}

// Handle wrong word input
function handleWrongWord(word, sentenceNumber = 1) {
    let currentTyped, currentWords, targetContainer;
    
    if (sentenceNumber === 1) {
        currentTyped = typedWords;
        currentWords = sentenceWords;
        targetContainer = placeholderWords1;
    } else if (sentenceNumber === 2) {
        currentTyped = typedWords2;
        currentWords = sentenceWords2;
        targetContainer = placeholderWords2;
    }
    
    const wordIndex = currentTyped.length;
    const targetBox = targetContainer.children[wordIndex];
    
    if (!targetBox) return;
    
    // Decrease lives for wrong word
    lives--;
    console.log('Wrong word! Lives decreased to:', lives);
    
    // Find scattered word element
    const scatteredWord = scatteredWords.find(w => 
        w.dataset.word === word && 
        w.dataset.sentenceNumber === sentenceNumber.toString()
    );
    
    if (scatteredWord && targetBox) {
        // Animate word moving to placeholder with error styling
        moveWrongWordToPlaceholder(scatteredWord, targetBox, wordIndex, word);
        
        // Add to typed words
        currentTyped.push(word);
        
        updateUI();
        
        // Check for game over
        if (lives <= 0) {
            gameOver();
        }
    }
}

// Move word to placeholder
function moveWordToPlaceholder(scatteredWord, targetBox, wordIndex, word) {
    scatteredWord.classList.add('moving');
    
    const scatteredRect = scatteredWord.getBoundingClientRect();
    const targetRect = targetBox.getBoundingClientRect();
    
    const deltaX = targetRect.left - scatteredRect.left;
    const deltaY = targetRect.top - scatteredRect.top;
    
    scatteredWord.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    scatteredWord.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.9)`;
    
    setTimeout(() => {
        targetBox.textContent = word;
        targetBox.classList.remove('hidden'); // Make word visible
        targetBox.classList.add('filled');
        
        scatteredWord.remove();
        const index = scatteredWords.indexOf(scatteredWord);
        if (index > -1) {
            scatteredWords.splice(index, 1);
        }
    }, 500);
}

// Move wrong word to placeholder with error styling
function moveWrongWordToPlaceholder(scatteredWord, targetBox, wordIndex, word) {
    scatteredWord.classList.add('moving');
    
    const scatteredRect = scatteredWord.getBoundingClientRect();
    const targetRect = targetBox.getBoundingClientRect();
    
    const deltaX = targetRect.left - scatteredRect.left;
    const deltaY = targetRect.top - scatteredRect.top;
    
    scatteredWord.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    scatteredWord.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.9)`;
    
    setTimeout(() => {
        targetBox.textContent = word;
        targetBox.classList.remove('hidden'); // Make word visible
        targetBox.classList.add('error');
        
        scatteredWord.remove();
        const index = scatteredWords.indexOf(scatteredWord);
        if (index > -1) {
            scatteredWords.splice(index, 1);
        }
    }, 500);
}

// Add click handlers to scattered words
document.addEventListener('click', (e) => {
    if (!gameActive) return;
    
    if (e.target.classList.contains('scattered-word')) {
        const word = e.target.dataset.word;
        const sentenceNumber = parseInt(e.target.dataset.sentenceNumber);
        
        handleWordInput(word, sentenceNumber);
    }
});

// Set active sentence (for multi-sentence modes)
// Check progressive mode completion
function checkProgressiveCompletion() {
    const config = progressiveConfig[progressiveStage];
    if (!config) return false;
    
    if (config.sentences === 1) {
        return sentence1Completed;
    } else if (config.sentences === 2) {
        return sentence1Completed && sentence2Completed;
    }
    
    return false;
}

// Complete sentence level
function completeSentenceLevel() {
    gameActive = false;
    
    // Add completed sentences to tracking
    completedSentences.push(currentSentence);
    if (sentenceMode === 'double' || (sentenceMode === 'progressive' && progressiveConfig[progressiveStage]?.sentences >= 2)) {
        completedSentences.push(currentSentence2);
    }
    
    // Calculate score
    const baseScore = 10;
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const livesBonus = lives * 5;
    const timeBonus = Math.max(0, 30 - Math.floor((Date.now() - startTime) / 1000));
    
    const sentenceScore = (baseScore * difficultyMultiplier + livesBonus + timeBonus);
    score += sentenceScore;
    
    // Handle progressive mode advancement
    if (sentenceMode === 'progressive') {
        progressiveSentencesCompleted++;
        const config = progressiveConfig[progressiveStage];
        
        if (progressiveSentencesCompleted >= config.sentencesNeeded) {
            if (progressiveStage < Object.keys(progressiveConfig).length) {
                advanceProgressiveStage();
            } else {
                // Completed all progressive stages
                showMessage('Congratulations!', 'You completed all progressive stages!', true);
                return;
            }
        }
    } else {
        level++;
    }
    
    showMessage('Well Done!', `You completed the sentence correctly! +${sentenceScore} points`, true);
}

// Advance progressive stage
function advanceProgressiveStage() {
    progressiveStage++;
    progressiveSentencesCompleted = 0;
    
    // Update difficulty and sentence count for new stage
    const config = progressiveConfig[progressiveStage];
    if (config) {
        currentDifficulty = config.difficulty;
        
        // Show/hide second sentence container based on new stage
        if (config.sentences >= 2) {
            sentenceWrapper2.style.display = 'block';
        } else {
            sentenceWrapper2.style.display = 'none';
        }
        
        showMessage('Stage Complete!', `Advancing to Stage ${progressiveStage}`, true);
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

// Next sentence
function nextSentence() {
    hideMessage();
    generateNewSentence();
    startGame();
}

// Skip current sentence
function skipSentence() {
    if (!gameActive) return;
    
    // Track skipped sentences
    skippedSentences.push(currentSentence);
    if (sentenceMode === 'double' || (sentenceMode === 'progressive' && progressiveConfig[progressiveStage]?.sentences >= 2)) {
        skippedSentences.push(currentSentence2);
    }
    
    skipCount++;
    
    // Check if skip limit reached
    if (skipCount >= 3) {
        gameActive = false;
        showGameOverSummary();
        skipSentenceBtn.style.display = 'none';
        return;
    }
    
    updateSkipButtonText();
    hideMessage();
    generateNewSentence();
    startGame();
}

// Update skip button text
function updateSkipButtonText() {
    const remainingSkips = 3 - skipCount;
    if (skipCount < 3) {
        skipSentenceBtn.textContent = `Skip Sentence (${remainingSkips} left)`;
    } else {
        skipSentenceBtn.textContent = 'Skip Sentence';
    }
}

// Game over when lives reach 0
function gameOver() {
    console.log('Game Over called! Current lives:', lives);
    gameActive = false;
    skipSentenceBtn.style.display = 'none';
    
    const messageContent = document.getElementById('message-content');
    const totalSentences = completedSentences.length + skippedSentences.length;
    
    let sentenceListHtml = '';
    if (totalSentences > 0) {
        completedSentences.forEach(sentence => {
            sentenceListHtml += `<div class="completed-sentence">${sentence}</div>`;
        });
        
        skippedSentences.forEach(sentence => {
            sentenceListHtml += `<div class="skipped-sentence">${sentence}</div>`;
        });
    }
    
    messageContent.innerHTML = `
        <h2 style="color: #f44336;">Game Over!</h2>
        <p>You ran out of lives! Final Score: <strong>${score}</strong></p>
        <div class="game-summary">
            <p><strong>Performance Summary:</strong></p>
            <p>✓ Completed: ${completedSentences.length} sentences</p>
            <p>⏭ Skipped: ${skippedSentences.length} sentences</p>
            ${sentenceListHtml ? `<div class="sentence-list">${sentenceListHtml}</div>` : ''}
        </div>
        <button id="restart-btn" class="message-btn">Try Again</button>
        <button id="menu-btn-final" class="message-btn">Main Menu</button>
    `;
    
    messageOverlay.classList.add('show');
    
    // Add event listeners for the new buttons
    const restartBtn = document.getElementById('restart-btn');
    const menuBtnFinal = document.getElementById('menu-btn-final');
    
    if (restartBtn) {
        // Remove any existing listeners by cloning the element
        const newRestartBtn = restartBtn.cloneNode(true);
        restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
        
        newRestartBtn.addEventListener('click', () => {
            restartGame();
            startGame();
        });
    }
    
    if (menuBtnFinal) {
        // Remove any existing listeners by cloning the element
        const newMenuBtn = menuBtnFinal.cloneNode(true);
        menuBtnFinal.parentNode.replaceChild(newMenuBtn, menuBtnFinal);
        
        newMenuBtn.addEventListener('click', () => {
            hideMessage();
            resetToMenu();
        });
    }
}

// Show game over summary with sentence performance
function showGameOverSummary() {
    const messageContent = document.getElementById('message-content');
    
    const totalSentences = completedSentences.length + skippedSentences.length;
    
    let sentenceListHtml = '';
    if (totalSentences > 0) {
        completedSentences.forEach(sentence => {
            sentenceListHtml += `<div class="completed-sentence">${sentence}</div>`;
        });
        
        skippedSentences.forEach(sentence => {
            sentenceListHtml += `<div class="skipped-sentence">${sentence}</div>`;
        });
    }
    
    messageContent.innerHTML = `
        <h2>Game Over!</h2>
        <p>You used all 3 skips. Final Score: <strong>${score}</strong></p>
        <div class="game-summary">
            <p><strong>Performance Summary:</strong></p>
            <p>✓ Completed: ${completedSentences.length} sentences</p>
            <p>⏭ Skipped: ${skippedSentences.length} sentences</p>
            ${sentenceListHtml ? `<div class="sentence-list">${sentenceListHtml}</div>` : ''}
        </div>
        <button id="restart-btn">Restart Game</button>
        <button id="menu-btn">Main Menu</button>
    `;
    
    messageOverlay.classList.add('show');
    
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    
    // Remove any existing listeners by cloning the elements
    const newRestartBtn = restartBtn.cloneNode(true);
    const newMenuBtn = menuBtn.cloneNode(true);
    restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    
    newRestartBtn.addEventListener('click', () => {
        restartGame();
        startGame();
    });
    newMenuBtn.addEventListener('click', resetToMenu);
}

// Reset to menu
function resetToMenu() {
    hideMessage();
    gameActive = false;
    score = 0;
    level = 1;
    lives = 3;
    skipCount = 0;
    
    skipSentenceBtn.style.display = 'none';
    
    // Reset sentence progression variables
    currentDifficulty = 'easy';
    sentencesCompletedAtCurrentLevel = 0;
    usedSentencesAtCurrentLevel = [];
    
    // Reset progressive mode
    progressiveStage = 1;
    progressiveSentencesCompleted = 0;
    
    generateNewSentence();
    updateUI();
}

// Restart game (preserves custom text and game mode settings)
function restartGame() {
    hideMessage();
    gameActive = false;
    score = 0;
    level = 1;
    lives = 3;
    skipCount = 0;
    console.log('Game restarted - Lives reset to:', lives);
    
    // Reset typed words
    typedWords = [];
    typedWords2 = [];
    
    // Reset game session tracking
    completedSentences = [];
    skippedSentences = [];
    sentence1Completed = false;
    sentence2Completed = false;
    activeSentence = 1;
    
    // Reset sentence progression variables
    sentencesCompletedAtCurrentLevel = 0;
    usedSentencesAtCurrentLevel = [];
    
    // Reset progressive mode progression
    progressiveStage = 1;
    progressiveSentencesCompleted = 0;
    
    // Hide skip button
    skipSentenceBtn.style.display = 'none';
    
    // Generate new sentence and update UI
    generateNewSentence();
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
    livesEl.textContent = lives;
    
    // Update lives visual feedback
    const livesContainer = livesEl.parentElement;
    livesContainer.classList.remove('low', 'critical');
    
    if (lives === 1) {
        livesContainer.classList.add('critical');
    } else if (lives === 2) {
        livesContainer.classList.add('low');
    }
    
    // Show stage info for progressive mode, level for others
    if (sentenceMode === 'progressive') {
        const config = progressiveConfig[progressiveStage];
        if (config) {
            levelEl.textContent = `Stage ${progressiveStage} (${progressiveSentencesCompleted}/${config.sentencesNeeded})`;
        }
    } else {
        levelEl.textContent = level;
    }
    

}

// Panel functions
function initializePanel() {
    // Panel is initially closed
    leftPanel.classList.remove('open');
    panelToggle.textContent = '▶';
}

function togglePanel() {
    leftPanel.classList.toggle('open');
    const isOpen = leftPanel.classList.contains('open');
    panelToggle.textContent = isOpen ? '◀' : '▶';
    
    // Update game container padding
    const gameContainer = document.querySelector('.game-container');
    if (isOpen) {
        gameContainer.classList.add('panel-open');
    } else {
        gameContainer.classList.remove('panel-open');
    }
}

// Custom text functions
function showTextInput() {
    textInputOverlay.classList.add('show');
    customTextArea.focus();
}

function hideTextInput() {
    textInputOverlay.classList.remove('show');
}

function processCustomText() {
    const text = customTextArea.value.trim();
    if (text.length < 50) {
        alert('Please provide at least 50 characters of text for better sentence extraction.');
        return;
    }
    
    // Extract sentences from text
    const sentences = extractSentencesFromText(text);
    customSentencesByDifficulty = categorizeSentences(sentences);
    
    // Show statistics
    const totalSentences = Object.values(customSentencesByDifficulty).flat().length;
    textStats.innerHTML = `
        <h4>Text processed successfully!</h4>
        <p>Total sentences extracted: ${totalSentences}</p>
        <p>Easy sentences (3-5 words): ${customSentencesByDifficulty.easy.length}</p>
        <p>Medium sentences (6-8 words): ${customSentencesByDifficulty.medium.length}</p>
        <p>Hard sentences (9+ words): ${customSentencesByDifficulty.hard.length}</p>
    `;
    
    usingCustomText = true;
    hideTextInput();
    generateNewSentence();
    updateUI();
}

function extractSentencesFromText(text) {
    // Split by sentence endings and clean up
    return text.split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 10) // Minimum sentence length
        .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.');
}

function categorizeSentences(sentences) {
    const categorized = { easy: [], medium: [], hard: [] };
    
    sentences.forEach(sentence => {
        const wordCount = sentence.split(' ').length;
        if (wordCount <= 5) {
            categorized.easy.push(sentence);
        } else if (wordCount <= 8) {
            categorized.medium.push(sentence);
        } else {
            categorized.hard.push(sentence);
        }
    });
    
    return categorized;
}

function useDefaultSentences() {
    customSentencesByDifficulty = null;
    usingCustomText = false;
    textStats.innerHTML = '';
    hideTextInput();
    generateNewSentence();
    updateUI();
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', init);
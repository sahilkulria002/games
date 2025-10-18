// Game Controls Manager - Handles UI interactions and settings
class GameControls {
    constructor(game) {
        this.game = game;
        this.initializeControls();
    }
    
    initializeControls() {
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.onclick = () => {
                this.startGame();
            };
        }
        
        // Restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.onclick = () => {
                this.restartGame();
            };
        }
        
        // Pause button
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.onclick = () => {
                if (this.game.paused) {
                    this.game.resumeGame();
                } else {
                    this.game.pauseGame();
                }
            };
        }
        
        // Resume button (in modal)
        const resumeBtn = document.getElementById('resumeBtn');
        if (resumeBtn) {
            resumeBtn.onclick = () => {
                this.game.resumeGame();
            };
        }
        
        // Game over popup buttons
        const playAgainBtn = document.getElementById('playAgainBtn');
        const closePopupBtn = document.getElementById('closePopupBtn');
        const gameOverPopup = document.getElementById('gameOverPopup');
        
        if (playAgainBtn && gameOverPopup) {
            playAgainBtn.onclick = () => {
                gameOverPopup.style.display = 'none';
                this.startGame();
            };
        }
        
        if (closePopupBtn && gameOverPopup) {
            closePopupBtn.onclick = () => {
                gameOverPopup.style.display = 'none';
                // Update button state when popup is closed
                this.updateSetWordsButtonState();
            };
        }
        
        // Speed slider
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        if (speedSlider && speedValue) {
            speedSlider.oninput = (e) => {
                this.game.speed = parseInt(e.target.value);
                let ms = this.game.getStepMs();
                let displaySteps = (0.5 + (this.game.speed-1)*(19.5/99)).toFixed(2);
                speedValue.textContent = displaySteps;
                if (this.game.running && !this.game.paused) { 
                    clearInterval(this.game.interval); 
                    this.game.interval = setInterval(() => this.game.move(), ms); 
                }
            };
        }
        
        // Speed slider keyboard protection
        if (speedSlider) {
            speedSlider.addEventListener('keydown', (e) => {
                if (this.game.running && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.target.blur();
                }
            });
            
            // Speed slider focus protection
            speedSlider.addEventListener('focus', (e) => {
                if (this.game.running) {
                    e.target.blur();
                }
            });
        }
        
        // Edge mode button
        const edgeBtn = document.getElementById('edgeBtn');
        if (edgeBtn) {
            edgeBtn.onclick = () => {
                this.game.edgeMode = this.game.edgeMode === 'stiff' ? 'pass' : 'stiff';
                edgeBtn.textContent = 'Edge: ' + (this.game.edgeMode === 'stiff' ? 'Stiff' : 'Pass Through');
            };
        }
        
        // Set words button (for word learning mode)
        const setWordsBtn = document.getElementById('setWordsBtn');
        const wordInput = document.getElementById('wordInput');
        if (setWordsBtn && wordInput) {
            setWordsBtn.onclick = () => {
                if (this.game.running) {
                    alert('Cannot change words while the game is running!');
                    return;
                }
                const val = wordInput.value.trim();
                this.game.setWords(val);
            };
        }
    }
    
    startGame() {
        this.game.resetGame();
        let ms = this.game.getStepMs();
        clearInterval(this.game.interval);
        this.game.interval = setInterval(() => this.game.move(), ms);
        
        // Start bullet loop if it's Python Attack mode
        if (this.game.startBulletLoop) {
            this.game.startBulletLoop();
        }
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
        
        this.updateSetWordsButtonState();
    }
    
    restartGame() {
        this.game.resetGame();
        let ms = this.game.getStepMs();
        clearInterval(this.game.interval);
        this.game.interval = setInterval(() => this.game.move(), ms);
        
        // Start bullet loop if it's Python Attack mode
        if (this.game.startBulletLoop) {
            this.game.startBulletLoop();
        }
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';
        if (restartBtn) restartBtn.style.display = 'inline-block';
        
        this.updateSetWordsButtonState();
    }
    
    updateSetWordsButtonState() {
        const setWordsBtn = document.getElementById('setWordsBtn');
        if (!setWordsBtn) return;
        
        console.log('Updating set words button state. Game running:', this.game.running);
        
        if (this.game.running) {
            setWordsBtn.disabled = true;
            console.log('Set words button disabled');
        } else {
            setWordsBtn.disabled = false;
            console.log('Set words button enabled');
        }
    }
    
    initializeSpeedDisplay() {
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            let displaySteps = (0.5 + (this.game.speed-1)*(19.5/99)).toFixed(2);
            speedValue.textContent = displaySteps;
        }
    }
    
    initialize() {
        // Initialize default words for word learning mode
        const wordInput = document.getElementById('wordInput');
        if (this.game.setWords && wordInput) {
            // Use common phrases if textarea is empty
            let val = wordInput.value.trim();
            if (!val && window.CommonWordsLibrary && window.CommonWordsLibrary.commonPhrases) {
                val = window.CommonWordsLibrary.commonPhrases.join(' ');
                wordInput.value = val;
                console.log('Using common phrases for snake game');
            } else if (!val) {
                // Fallback text if common words library is not available
                val = 'My name is John. I am a student of Greenwood High School. I live in a peaceful area surrounded by nature and kind people who always encourage me to study hard and do something great in life. I have been deeply interested in science and technology. I love learning how things work — from tiny machines to giant rockets. My biggest dream is to become a great scientist in the field of space research. I want to create new inventions that can help people explore other planets and make life better for everyone on Earth. I believe that hard work, discipline, and curiosity are the most important things a student should have. I always try to learn new things every day, whether in school or at home, and I enjoy doing small science projects that make me think creatively. In the future, I wish to work with brilliant scientists and build machines that can go beyond our solar system. My goal is not only to gain knowledge but also to use it for the benefit of humanity and to make my country proud.';
                wordInput.value = val;
                console.log('Using fallback text for snake game');
            }
            this.game.setWords(val);
        }
        
        this.initializeSpeedDisplay();
        this.updateSetWordsButtonState();
        this.game.draw();
    }
}
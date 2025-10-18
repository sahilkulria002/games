// Word Maze Game - Main game logic
class WordMazeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings
        this.GRID_SIZE = 20;
        this.CELL_SIZE = 30;
        this.canvas.width = this.GRID_SIZE * this.CELL_SIZE;
        this.canvas.height = 15 * this.CELL_SIZE; // 20x15 grid
        
        // Game state
        this.running = false;
        this.paused = false;
        this.level = 1;
        this.score = 0;
        this.startTime = 0;
        this.gameTime = 0;
        
        // Player position
        this.player = { x: 1, y: 1 };
        this.goal = { x: 18, y: 13 };
        
        // Game elements
        this.maze = null;
        this.letterWalls = []; // Letters embedded in walls
        this.currentSentence = '';
        this.targetLetterIndex = 0;
        this.collectedLetters = [];
        this.sentenceList = [];
        
        // Timing
        this.interval = null;
        this.timeInterval = null;
        this.animationId = null;
        this.targetFPS = 60;
        this.lastFrameTime = 0;
        
        // Visual effects
        this.particles = [];
        this.playerTrail = [];
        
        this.initializeWordList();
        this.initializeEventListeners();
    }
    
    initializeWordList() {
        // Use sentences from common words library (loaded from common-words.js)
        if (window.CommonWordsLibrary && window.CommonWordsLibrary.sentencesByLevel) {
            this.sentencesByLevel = window.CommonWordsLibrary.sentencesByLevel;
            console.log('Using common sentences library for maze game');
        } else {
            // Fallback sentences in case common-words.js fails to load
            this.sentencesByLevel = {
                1: ['WIN THE GAME', 'RUN TO WIN', 'GET THE SUN', 'CAT AND DOG'],
                2: ['PLAY THE MAZE GAME', 'JUMP TO THE GOAL', 'MOVE FAST TO WIN', 'WORD PUZZLE FUN'],
                3: ['QUEST FOR MAGIC POWER', 'BRAVE AND SMART HERO', 'FOCUS ON THE PRIZE', 'SPEED IS THE KEY'],
                4: ['VICTORY AWAITS THE BRAVE', 'AMAZING CREATIVE TRIUMPH', 'PERFECT STELLAR SUCCESS', 'AWESOME PUZZLE SOLVER'],
                5: ['OUTSTANDING MAGNIFICENT ACHIEVEMENT', 'EXTRAORDINARY BRILLIANT PERFORMANCE', 'SPECTACULAR PHENOMENAL VICTORY', 'INCREDIBLE MARVELOUS QUEST']
            };
            console.warn('Common words library not found, using fallback sentences for maze game');
        }
        
        this.updateSentenceList();
    }
    
    updateSentenceList() {
        let levelSentences = this.sentencesByLevel[Math.min(this.level, 5)] || this.sentencesByLevel[5];
        this.sentenceList = [...levelSentences];
        
        // Select random sentence for current level
        this.currentSentence = this.sentenceList[Math.floor(Math.random() * this.sentenceList.length)];
        this.targetLetterIndex = 0;
        this.collectedLetters = [];
    }
    
    initializeEventListeners() {
        // Input handling will be managed by controls
    }
    
    resetGame() {
        this.running = false;
        this.paused = false;
        this.level = 1;
        this.score = 0;
        this.gameTime = 0;
        this.startTime = Date.now();
        
        this.player = { x: 1, y: 1 };
        
        this.letterWalls = [];
        this.particles = [];
        this.playerTrail = [];
        
        this.updateSentenceList();
        this.generateMaze();
        this.placeSentenceLettersInMaze();
        
        this.updateUI();
        this.draw();
    }
    
    startGame() {
        if (this.running) {
            return;
        }
        
        this.resetGame();
        this.running = true;
        this.startTime = Date.now();
        this.lastFrameTime = Date.now();
        
        // Start animation loop (replaces interval-based updates)
        this.startAnimationLoop();
        
        // Start timer only
        this.timeInterval = setInterval(() => this.updateTimer(), 1000);
        
        this.updateUI();
    }
    
    pauseGame() {
        if (!this.running || this.paused) return;
        this.paused = true;
        clearInterval(this.timeInterval);
        this.stopAnimationLoop();
    }
    
    resumeGame() {
        if (!this.running || !this.paused) return;
        this.paused = false;
        this.timeInterval = setInterval(() => this.updateTimer(), 1000);
        this.startAnimationLoop();
    }
    
    stopGame() {
        this.running = false;
        this.paused = false;
        clearInterval(this.interval);
        clearInterval(this.timeInterval);
        this.stopAnimationLoop();
    }
    
    generateMaze() {
        // Use the MazeGenerator class
        const generator = new MazeGenerator(this.GRID_SIZE, 15);
        this.maze = generator.generate();
        
        // Ensure start and end are clear
        this.maze[1][1] = 0; // Start position
        this.maze[18][13] = 0; // Goal position
        
        // Create guaranteed path from start to goal for level 1
        if (this.level === 1) {
            this.createSimplePath();
        } else if (this.level > 2) {
            this.createGuaranteedPaths();
        }
        
        // Ensure there are some open spaces around the start
        this.clearAroundStart();
    }
    
    createSimplePath() {
        // Create a simple path from start to goal for the first level
        let x = 1, y = 1;
        
        // Move right first
        while (x < 18) {
            this.maze[x][y] = 0;
            x++;
        }
        
        // Then move down to goal
        while (y < 13) {
            this.maze[x][y] = 0;
            y++;
        }
        
        // Add some alternate paths for variety
        for (let i = 2; i < 17; i++) {
            if (Math.random() < 0.3) {
                this.maze[i][2] = 0; // Top path
            }
            if (Math.random() < 0.3) {
                this.maze[i][12] = 0; // Bottom path
            }
        }
    }
    
    clearAroundStart() {
        // Clear a small area around the start position
        const startX = 1, startY = 1;
        
        for (let dx = 0; dx <= 2; dx++) {
            for (let dy = 0; dy <= 2; dy++) {
                if (startX + dx < this.GRID_SIZE && startY + dy < 15) {
                    this.maze[startX + dx][startY + dy] = 0;
                }
            }
        }
    }
    
    placeSentenceLettersInMaze() {
        this.letterWalls = [];
        
        // Remove spaces and get unique letters in order
        const letters = this.currentSentence.split('').filter(char => char !== ' ');
        
        // Find good positions for letters in the maze walls
        const wallPositions = [];
        for (let x = 2; x < this.GRID_SIZE - 2; x++) {
            for (let y = 2; y < 13; y++) {
                if (this.maze[x][y] === 1) { // It's a wall
                    // Check if this wall is adjacent to paths (good for accessibility)
                    let adjacentPaths = 0;
                    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
                    for (let [dx, dy] of directions) {
                        if (x+dx >= 0 && x+dx < this.GRID_SIZE && 
                            y+dy >= 0 && y+dy < 15 && 
                            this.maze[x+dx][y+dy] === 0) {
                            adjacentPaths++;
                        }
                    }
                    if (adjacentPaths >= 1) {
                        wallPositions.push({x, y});
                    }
                }
            }
        }
        
        // Shuffle wall positions for variety
        for (let i = wallPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wallPositions[i], wallPositions[j]] = [wallPositions[j], wallPositions[i]];
        }
        
        // Place letters in walls
        for (let i = 0; i < letters.length && i < wallPositions.length; i++) {
            const pos = wallPositions[i];
            this.letterWalls.push({
                x: pos.x,
                y: pos.y,
                letter: letters[i],
                index: i,
                collected: false
            });
        }
    }
    
    createGuaranteedPaths() {
        // Create additional paths to make maze more interesting
        for (let i = 0; i < 3; i++) {
            let x = 2 + Math.floor(Math.random() * (this.GRID_SIZE - 4));
            let y = 2 + Math.floor(Math.random() * 11);
            
            // Create small clearings
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (x + dx > 0 && x + dx < this.GRID_SIZE - 1 && 
                        y + dy > 0 && y + dy < 14) {
                        this.maze[x + dx][y + dy] = 0;
                    }
                }
            }
        }
    }
    
    generateWordTokens() {
        this.wordTokens = [];
        let tokenCount = 3 + this.level;
        
        for (let i = 0; i < tokenCount; i++) {
            let pos = this.findEmptyPosition();
            if (pos) {
                this.wordTokens.push({
                    x: pos.x,
                    y: pos.y,
                    collected: false,
                    word: this.getRandomWord(),
                    pulseTimer: Math.random() * Math.PI * 2,
                    glowIntensity: 0
                });
            }
        }
    }
    
    findEmptyPosition() {
        let attempts = 0;
        while (attempts < 100) {
            let x = 2 + Math.floor(Math.random() * (this.GRID_SIZE - 4));
            let y = 2 + Math.floor(Math.random() * 11);
            
            if (this.maze[x][y] === 0 && 
                !(x === this.player.x && y === this.player.y) &&
                !(x === this.goal.x && y === this.goal.y)) {
                return { x, y };
            }
            attempts++;
        }
        return null;
    }
    
    getRandomWord() {
        if (this.wordList.length === 0) {
            this.updateWordList();
        }
        
        let word = this.wordList[Math.floor(Math.random() * this.wordList.length)];
        return word;
    }
    
    generateNewWord() {
        if (this.wordList.length === 0) {
            this.updateWordList();
        }
        
        // Get a word that hasn't been used recently
        let availableWords = this.wordList.filter(word => !this.usedWords.includes(word));
        if (availableWords.length === 0) {
            availableWords = [...this.wordList];
            this.usedWords = [];
        }
        
        this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        this.usedWords.push(this.currentWord);
        
        // Keep only last 5 used words
        if (this.usedWords.length > 5) {
            this.usedWords.shift();
        }
        
        // Update UI
        const wordChallenge = document.getElementById('wordChallenge');
        if (wordChallenge) {
            wordChallenge.textContent = this.currentWord;
        }
    }
    
    movePlayer(direction) {
        if (!this.running || this.paused) {
            return false;
        }
        
        const newX = this.player.x + direction.dx;
        const newY = this.player.y + direction.dy;
        
        // Check bounds
        if (newX < 0 || newX >= this.GRID_SIZE || newY < 0 || newY >= 15) {
            return false;
        }
        
        // Check if moving into a letter wall
        const letterWall = this.letterWalls.find(lw => 
            lw.x === newX && lw.y === newY && !lw.collected
        );
        
        if (letterWall) {
            return this.handleLetterWallCollision(letterWall);
        }
        
        // Check regular maze walls
        if (this.maze[newX] && this.maze[newX][newY] === 1) {
            return false; // Can't move through walls
        }
        
        // Valid move
        this.playerTrail.push({ ...this.player, life: 10 });
        this.player.x = newX;
        this.player.y = newY;
        
        // Create movement particles
        this.createParticles(this.player.x, this.player.y, '#4ade80', 2);
        
        // Check if puzzle is complete
        if (this.targetLetterIndex >= this.currentSentence.replace(/\s/g, '').length) {
            this.levelComplete();
        }
        
        this.updateUI();
        return true;
    }
    
    handleLetterWallCollision(letterWall) {
        const expectedLetter = this.currentSentence.replace(/\s/g, '')[this.targetLetterIndex];
        
        if (letterWall.letter === expectedLetter) {
            // Correct letter!
            letterWall.collected = true;
            this.collectedLetters.push(letterWall.letter);
            this.targetLetterIndex++;
            
            // Move player to the letter position (wall becomes passable)
            this.playerTrail.push({ ...this.player, life: 10 });
            this.player.x = letterWall.x;
            this.player.y = letterWall.y;
            
            // Convert wall to path
            this.maze[letterWall.x][letterWall.y] = 0;
            
            // Score and effects
            this.score += 50;
            this.createParticles(this.player.x, this.player.y, '#22c55e', 8);
            
            this.updateUI();
            return true;
        } else {
            // Wrong letter - can't pass through
            this.createParticles(this.player.x, this.player.y, '#ef4444', 4);
            return false;
        }
    }


    
    getPlayerDirection() {
        // Try to find a valid direction toward the goal
        const dx = this.goal.x - this.player.x;
        const dy = this.goal.y - this.player.y;
        
        // List of possible directions in order of preference
        const directions = [];
        
        // Prioritize movement toward goal
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal movement preferred
            directions.push({ dx: dx > 0 ? 1 : -1, dy: 0 });
            directions.push({ dx: 0, dy: dy > 0 ? 1 : -1 });
            directions.push({ dx: 0, dy: dy > 0 ? -1 : 1 });
            directions.push({ dx: dx > 0 ? -1 : 1, dy: 0 });
        } else {
            // Vertical movement preferred
            directions.push({ dx: 0, dy: dy > 0 ? 1 : -1 });
            directions.push({ dx: dx > 0 ? 1 : -1, dy: 0 });
            directions.push({ dx: dx > 0 ? -1 : 1, dy: 0 });
            directions.push({ dx: 0, dy: dy > 0 ? -1 : 1 });
        }
        
        // Try each direction and return the first valid one
        for (let dir of directions) {
            const newX = this.player.x + dir.dx;
            const newY = this.player.y + dir.dy;
            
            if (this.isValidMove(newX, newY)) {
                return dir;
            }
        }
        
        // If no direction works, try all 4 cardinal directions
        const allDirections = [
            { dx: 1, dy: 0 },   // Right
            { dx: -1, dy: 0 },  // Left
            { dx: 0, dy: 1 },   // Down
            { dx: 0, dy: -1 }   // Up
        ];
        
        for (let dir of allDirections) {
            const newX = this.player.x + dir.dx;
            const newY = this.player.y + dir.dy;
            
            if (this.isValidMove(newX, newY)) {
                return dir;
            }
        }
        
        // If still no valid move, return no movement
        return { dx: 0, dy: 0 };
    }
    
    isValidMove(x, y) {
        // Check bounds
        if (x < 0 || x >= this.GRID_SIZE || y < 0 || y >= 15) {
            return false;
        }
        
        // Check maze walls
        return this.maze[x][y] === 0;
    }
    
    checkWordTokenCollection() {
        for (let token of this.wordTokens) {
            if (!token.collected && 
                token.x === this.player.x && 
                token.y === this.player.y) {
                
                token.collected = true;
                this.score += 25;
                
                // Create collection particles
                this.createParticles(token.x, token.y, '#fbbf24', 8);
            }
        }
    }
    
    levelComplete() {
        this.level++;
        this.score += 100; // Level completion bonus
        
        // Create celebration particles
        this.createParticles(this.player.x, this.player.y, '#8b5cf6', 15);
        
        // Setup next level
        setTimeout(() => {
            this.player = { x: 1, y: 1 };
            this.updateSentenceList();
            this.generateMaze();
            this.placeSentenceLettersInMaze();
            this.draw();
        }, 1000);
        
        this.updateUI();
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x * this.CELL_SIZE + this.CELL_SIZE / 2,
                y: y * this.CELL_SIZE + this.CELL_SIZE / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: color,
                life: 30,
                maxLife: 30,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    update() {
        if (!this.running || this.paused) return;
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98; // Friction
            particle.vy *= 0.98;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update player trail
        for (let i = this.playerTrail.length - 1; i >= 0; i--) {
            this.playerTrail[i].life--;
            if (this.playerTrail[i].life <= 0) {
                this.playerTrail.splice(i, 1);
            }
        }
        
        // Update word token animations
        for (let token of this.wordTokens) {
            if (!token.collected) {
                token.pulseTimer += 0.1;
                token.glowIntensity = (Math.sin(token.pulseTimer) + 1) / 2;
            }
        }
        
        this.draw();
    }
    
    updateTimer() {
        if (!this.running || this.paused) return;
        
        this.gameTime = Math.floor((Date.now() - this.startTime) / 1000);
        this.updateUI();
    }
    
    updateUI() {
        // Update stats display
        const levelEl = document.getElementById('level');
        const scoreEl = document.getElementById('score');
        const timeEl = document.getElementById('time');
        
        if (levelEl) levelEl.textContent = this.level;
        if (scoreEl) scoreEl.textContent = this.score;
        if (timeEl) {
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = this.gameTime % 60;
            timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update sentence display
        if (window.controls) {
            window.controls.updateSentenceDisplay();
        }
    }
    
    startAnimationLoop() {
        console.log('Starting animation loop');
        const animate = (currentTime) => {
            if (!this.running) {
                console.log('Animation loop stopped - game not running');
                return;
            }
            
            // Calculate delta time for smooth animations
            const deltaTime = currentTime - this.lastFrameTime;
            const targetFrameTime = 1000 / this.targetFPS;
            
            // Only draw if enough time has passed (frame limiting)
            if (deltaTime >= targetFrameTime) {
                this.animationUpdate(deltaTime);
                this.draw();
                this.lastFrameTime = currentTime - (deltaTime % targetFrameTime);
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    stopAnimationLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animationUpdate(deltaTime) {
        // Update particles with smooth animation
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            
            // Update position based on deltaTime for smooth movement
            particle.x += particle.vx * (deltaTime / 16.67); // Normalize to 60fps
            particle.y += particle.vy * (deltaTime / 16.67);
            particle.life--;
            
            // Apply gravity and fade
            particle.vy += 0.1 * (deltaTime / 16.67);
            particle.size *= 0.995;
            
            if (particle.life <= 0 || particle.size < 0.1) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update player trail with smooth fading
        for (let i = this.playerTrail.length - 1; i >= 0; i--) {
            this.playerTrail[i].life -= deltaTime / 100; // Smooth fade based on time
            if (this.playerTrail[i].life <= 0) {
                this.playerTrail.splice(i, 1);
            }
        }
        
        // Update letter wall glow animation
        for (let letterWall of this.letterWalls) {
            if (!letterWall.collected) {
                letterWall.glowPhase = (letterWall.glowPhase || 0) + deltaTime * 0.003;
            }
        }
        
        // Update word token animations
        if (this.wordTokens) {
            for (let token of this.wordTokens) {
                token.pulseTimer += deltaTime * 0.006; // Smooth animation based on delta time
                token.glowIntensity = (Math.sin(token.pulseTimer) + 1) / 2;
            }
        }
    }
    
    draw() {
        if (!this.ctx || !this.canvas) {
            console.error('Canvas or context not available for drawing');
            return;
        }
        
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.drawMaze();
        
        // Draw letter walls
        this.drawLetterWalls();
        
        // Draw player trail
        this.drawPlayerTrail();
        
        // Draw player
        this.drawPlayer();
        
        // Draw particles
        this.drawParticles();
    }
    
    drawMaze() {
        for (let x = 0; x < this.GRID_SIZE; x++) {
            for (let y = 0; y < 15; y++) {
                if (this.maze[x][y] === 1) {
                    // Wall
                    this.ctx.fillStyle = '#4a3a5a';
                    this.ctx.fillRect(
                        x * this.CELL_SIZE, 
                        y * this.CELL_SIZE, 
                        this.CELL_SIZE, 
                        this.CELL_SIZE
                    );
                    
                    // Wall border
                    this.ctx.strokeStyle = '#6a4a7a';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        x * this.CELL_SIZE, 
                        y * this.CELL_SIZE, 
                        this.CELL_SIZE, 
                        this.CELL_SIZE
                    );
                }
            }
        }
    }
    
    drawWordTokens() {
        for (let token of this.wordTokens) {
            if (token.collected) continue;
            
            const x = token.x * this.CELL_SIZE;
            const y = token.y * this.CELL_SIZE;
            
            // Glow effect
            const glowSize = this.CELL_SIZE * (0.8 + token.glowIntensity * 0.3);
            const glowAlpha = 0.3 + token.glowIntensity * 0.2;
            
            this.ctx.fillStyle = `rgba(251, 191, 36, ${glowAlpha})`;
            this.ctx.fillRect(
                x + (this.CELL_SIZE - glowSize) / 2,
                y + (this.CELL_SIZE - glowSize) / 2,
                glowSize,
                glowSize
            );
            
            // Token body
            this.ctx.fillStyle = '#fbbf24';
            this.ctx.fillRect(
                x + 3,
                y + 3,
                this.CELL_SIZE - 6,
                this.CELL_SIZE - 6
            );
            
            // Token letter
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                token.word[0],
                x + this.CELL_SIZE / 2,
                y + this.CELL_SIZE / 2 + 4
            );
        }
    }
    
    drawLetterWalls() {
        const expectedLetter = this.currentSentence.replace(/\s/g, '')[this.targetLetterIndex];
        
        for (let letterWall of this.letterWalls) {
            if (letterWall.collected) continue;
            
            const x = letterWall.x * this.CELL_SIZE;
            const y = letterWall.y * this.CELL_SIZE;
            
            // Letter wall background with smooth glow
            if (letterWall.letter === expectedLetter) {
                // Smooth pulsing glow for target letter
                const glowIntensity = 0.6 + Math.sin(letterWall.glowPhase || 0) * 0.3;
                this.ctx.fillStyle = `rgba(34, 197, 94, ${glowIntensity})`;
            } else {
                this.ctx.fillStyle = '#4a5568';
            }
            this.ctx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
            
            // Letter border
            this.ctx.strokeStyle = letterWall.letter === expectedLetter ? '#22c55e' : '#2d3748';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
            
            // Draw the letter
            this.ctx.fillStyle = letterWall.letter === expectedLetter ? '#ffffff' : '#a0aec0';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                letterWall.letter, 
                x + this.CELL_SIZE / 2, 
                y + this.CELL_SIZE / 2
            );
        }
    }
    
    drawPlayerTrail() {
        for (let trail of this.playerTrail) {
            const alpha = trail.life / 10;
            this.ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.3})`;
            this.ctx.fillRect(
                trail.x * this.CELL_SIZE + 2,
                trail.y * this.CELL_SIZE + 2,
                this.CELL_SIZE - 4,
                this.CELL_SIZE - 4
            );
        }
    }
    
    drawPlayer() {
        const x = this.player.x * this.CELL_SIZE;
        const y = this.player.y * this.CELL_SIZE;
        
        // Player glow
        this.ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        this.ctx.fillRect(x - 2, y - 2, this.CELL_SIZE + 4, this.CELL_SIZE + 4);
        
        // Player body
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
        
        // Player center
        this.ctx.fillStyle = '#16a34a';
        this.ctx.fillRect(x + 6, y + 6, this.CELL_SIZE - 12, this.CELL_SIZE - 12);
    }
    
    drawGoal() {
        const x = this.goal.x * this.CELL_SIZE;
        const y = this.goal.y * this.CELL_SIZE;
        
        // Animated goal
        const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
        
        this.ctx.fillStyle = `rgba(139, 92, 246, ${pulse})`;
        this.ctx.fillRect(x - 2, y - 2, this.CELL_SIZE + 4, this.CELL_SIZE + 4);
        
        this.ctx.fillStyle = '#8b5cf6';
        this.ctx.fillRect(x + 1, y + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
        
        // Goal symbol
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('★', x + this.CELL_SIZE / 2, y + this.CELL_SIZE / 2 + 5);
    }
    
    drawParticles() {
        this.ctx.save();
        for (let particle of this.particles) {
            const alpha = Math.max(0, particle.life / particle.maxLife);
            
            // Convert color to rgba with smooth alpha
            let color = particle.color;
            if (color.includes('rgb(')) {
                color = color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
            } else if (color.startsWith('#')) {
                // Convert hex to rgba
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    gameOver(reason = 'Game Over') {
        this.stopGame();
        
        // Show game over modal
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('modalTitle');
        const message = document.getElementById('modalMessage');
        
        if (modal && title && message) {
            title.textContent = reason;
            message.innerHTML = `
                Final Score: <strong>${this.score}</strong><br>
                Level Reached: <strong>${this.level}</strong><br>
                Time Played: <strong>${Math.floor(this.gameTime / 60)}:${(this.gameTime % 60).toString().padStart(2, '0')}</strong>
            `;
            modal.style.display = 'flex';
        }
    }
}
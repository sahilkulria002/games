// Maze Generator for Word Maze Game
class MazeGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.maze = [];
    }
    
    generate() {
        // Initialize maze with all walls
        this.initializeMaze();
        
        // Generate maze using recursive backtracking
        this.generateRecursiveBacktrack();
        
        // Add some random openings for more paths
        this.addRandomOpenings();
        
        return this.maze;
    }
    
    initializeMaze() {
        this.maze = [];
        for (let x = 0; x < this.width; x++) {
            this.maze[x] = [];
            for (let y = 0; y < this.height; y++) {
                // 1 = wall, 0 = path
                this.maze[x][y] = 1;
            }
        }
    }
    
    generateRecursiveBacktrack() {
        const stack = [];
        const visited = new Set();
        
        // Start from (1, 1)
        const start = { x: 1, y: 1 };
        stack.push(start);
        visited.add(`${start.x},${start.y}`);
        this.maze[start.x][start.y] = 0;
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current, visited);
            
            if (neighbors.length > 0) {
                // Choose random neighbor
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Remove wall between current and next
                this.removeWall(current, next);
                
                // Mark as visited and add to stack
                visited.add(`${next.x},${next.y}`);
                this.maze[next.x][next.y] = 0;
                stack.push(next);
            } else {
                // Backtrack
                stack.pop();
            }
        }
    }
    
    getUnvisitedNeighbors(cell, visited) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -2 }, // Up
            { x: 2, y: 0 },  // Right
            { x: 0, y: 2 },  // Down
            { x: -2, y: 0 }  // Left
        ];
        
        for (let dir of directions) {
            const nx = cell.x + dir.x;
            const ny = cell.y + dir.y;
            
            if (nx >= 1 && nx < this.width - 1 && 
                ny >= 1 && ny < this.height - 1 && 
                !visited.has(`${nx},${ny}`)) {
                neighbors.push({ x: nx, y: ny });
            }
        }
        
        return neighbors;
    }
    
    removeWall(current, next) {
        const wallX = current.x + (next.x - current.x) / 2;
        const wallY = current.y + (next.y - current.y) / 2;
        this.maze[wallX][wallY] = 0;
    }
    
    addRandomOpenings() {
        // Add some random openings to make maze less linear
        const openingCount = Math.floor((this.width * this.height) * 0.05);
        
        for (let i = 0; i < openingCount; i++) {
            const x = 1 + Math.floor(Math.random() * (this.width - 2));
            const y = 1 + Math.floor(Math.random() * (this.height - 2));
            
            // Only open walls that would create interesting connections
            if (this.maze[x][y] === 1 && this.shouldOpenWall(x, y)) {
                this.maze[x][y] = 0;
            }
        }
    }
    
    shouldOpenWall(x, y) {
        // Count adjacent paths
        let pathCount = 0;
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        
        for (let dir of directions) {
            const nx = x + dir.x;
            const ny = y + dir.y;
            
            if (nx >= 0 && nx < this.width && 
                ny >= 0 && ny < this.height && 
                this.maze[nx][ny] === 0) {
                pathCount++;
            }
        }
        
        // Open wall if it connects exactly 2 paths (creates shortcuts)
        return pathCount === 2;
    }
    
    // Generate a simpler maze for lower levels
    generateSimple() {
        this.initializeMaze();
        
        // Create main horizontal corridors
        for (let y = 1; y < this.height; y += 2) {
            for (let x = 1; x < this.width - 1; x++) {
                this.maze[x][y] = 0;
            }
        }
        
        // Create vertical connections
        for (let x = 3; x < this.width; x += 4) {
            for (let y = 1; y < this.height - 1; y++) {
                this.maze[x][y] = 0;
            }
        }
        
        // Add some random walls for complexity
        const wallCount = Math.floor((this.width * this.height) * 0.1);
        for (let i = 0; i < wallCount; i++) {
            const x = 2 + Math.floor(Math.random() * (this.width - 4));
            const y = 2 + Math.floor(Math.random() * (this.height - 4));
            
            if (this.maze[x][y] === 0 && 
                !(x === 1 && y === 1) && 
                !(x === this.width - 2 && y === this.height - 2)) {
                this.maze[x][y] = 1;
            }
        }
        
        return this.maze;
    }
    
    // Generate a more complex maze for higher levels
    generateComplex() {
        this.generate();
        
        // Add extra complexity
        this.addDeadEnds();
        this.addLoops();
        
        return this.maze;
    }
    
    addDeadEnds() {
        const deadEndCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < deadEndCount; i++) {
            const x = 2 + Math.floor(Math.random() * (this.width - 4));
            const y = 2 + Math.floor(Math.random() * (this.height - 4));
            
            if (this.maze[x][y] === 0) {
                // Create a small dead end
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (x + dx > 0 && x + dx < this.width - 1 && 
                            y + dy > 0 && y + dy < this.height - 1) {
                            this.maze[x + dx][y + dy] = 0;
                        }
                    }
                }
                
                // Block some exits to create dead end
                if (Math.random() < 0.5) {
                    this.maze[x + 1][y] = 1;
                }
                if (Math.random() < 0.5) {
                    this.maze[x][y + 1] = 1;
                }
            }
        }
    }
    
    addLoops() {
        const loopCount = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < loopCount; i++) {
            const centerX = 3 + Math.floor(Math.random() * (this.width - 6));
            const centerY = 3 + Math.floor(Math.random() * (this.height - 6));
            
            // Create a small loop
            const loopPositions = [
                { x: centerX - 1, y: centerY - 1 },
                { x: centerX, y: centerY - 1 },
                { x: centerX + 1, y: centerY - 1 },
                { x: centerX + 1, y: centerY },
                { x: centerX + 1, y: centerY + 1 },
                { x: centerX, y: centerY + 1 },
                { x: centerX - 1, y: centerY + 1 },
                { x: centerX - 1, y: centerY }
            ];
            
            for (let pos of loopPositions) {
                if (pos.x > 0 && pos.x < this.width - 1 && 
                    pos.y > 0 && pos.y < this.height - 1) {
                    this.maze[pos.x][pos.y] = 0;
                }
            }
        }
    }
}
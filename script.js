/**
 * @description Represents the Game of Life grid state and controls
 * @constant {Object} CELL_STATES - Enum for cell animation states
 */
const CELL_STATES = {
    DEAD: 'level-0',
    DYING: 'level-1',
    ALIVE: 'level-2',
    BORN: 'level-3'
};

const grid = document.getElementById('grid');
const cols = Math.floor(window.innerWidth / 10);
const rows = Math.floor(window.innerHeight / 10);
let cells = [];
let isRunning = true;

// Initialize grid
grid.style.gridTemplateColumns = `repeat(${cols}, 10px)`;
grid.style.gridTemplateRows = `repeat(${rows}, 10px)`;

// Create cells
for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.alive = Math.random() > 0.7;
    cell.classList.add(cell.alive ? CELL_STATES.ALIVE : CELL_STATES.DEAD);
    grid.appendChild(cell);
    cells.push(cell);
}

/**
 * @description Counts living neighbors for a given cell position
 * @param {number} pos - Index of current cell in the grid
 * @returns {number} Number of living neighbors (0-8)
 */
function countNeighbors(pos) {
    const above = pos - cols;
    const below = pos + cols;
    const left = pos - 1;
    const right = pos + 1;
    let count = 0;

    // Check valid column bounds
    const isLeftEdge = pos % cols === 0;
    const isRightEdge = pos % cols === cols - 1;

    if (above >= 0) {
        if (cells[above].alive) count++;
        if (!isLeftEdge && cells[above - 1]?.alive) count++;
        if (!isRightEdge && cells[above + 1]?.alive) count++;
    }
    if (below < cells.length) {
        if (cells[below].alive) count++;
        if (!isLeftEdge && cells[below - 1]?.alive) count++;
        if (!isRightEdge && cells[below + 1]?.alive) count++;
    }
    if (!isLeftEdge && cells[left]?.alive) count++;
    if (!isRightEdge && cells[right]?.alive) count++;
    
    return count;
}

/**
 * @description Updates the grid based on Conway's Game of Life rules
 */
function updateGrid() {
    const nextGen = cells.map((cell, index) => {
        const neighbors = countNeighbors(index);
        const willLive = cell.alive ? 
            (neighbors === 2 || neighbors === 3) : 
            neighbors === 3;
            
        return {
            element: cell,
            nextState: willLive
        };
    });

    // Update cell states with transitions
    nextGen.forEach(({element, nextState}) => {
        if (nextState !== element.alive) {
            element.classList.remove(
                element.alive ? CELL_STATES.ALIVE : CELL_STATES.DEAD
            );
            element.classList.add(
                nextState ? CELL_STATES.BORN : CELL_STATES.DYING
            );
            element.alive = nextState;
        }
    });
}

/**
 * @description Main game loop
 */
function gameLoop() {
    if (isRunning) {
        updateGrid();
        requestAnimationFrame(() => setTimeout(gameLoop, 200));
    }
}

// Start the game
gameLoop();
// Define Tetris pieces as shapes with relative coordinates
const TETRIS_PIECES = {
    O: [[0, 0], [1, 0], [0, 1], [1, 1]],  // Square piece
    L: [[0, 0], [0, 1], [0, 2], [1, 2]],  // L piece
    J: [[1, 0], [1, 1], [1, 2], [0, 2]],  // J piece
    T: [[0, 0], [1, 0], [2, 0], [1, 1]],  // T piece
    Z: [[0, 0], [1, 0], [1, 1], [2, 1]],  // Z piece
    I: [[0, 0], [0, 1], [0, 2], [0, 3]], // I shape (vertical line)
    S: [[1, 0], [2, 0], [0, 1], [1, 1]]  // S shape
};

// Constants for the grid
const GRID_WIDTH = 10;
const GRID_HEIGHT = 100;

// Initialize the grid
function createGrid() {
    return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
}

// Place a piece onto the grid and return the new grid state
function placePiece(grid, pieceType, startX) {
    const shape = TETRIS_PIECES[pieceType];
    let dropHeight = GRID_HEIGHT;

    // Find the lowest point where the piece can land
    for (let dx = 0; dx < shape.length; dx++) {
        const part = shape[dx];
        let localDrop = 0;

        while (true) {
            const x = startX + part[0];
            const y = localDrop + part[1];
            if (y >= GRID_HEIGHT || grid[y][x] === 1) break;
            localDrop++;
        }

        dropHeight = Math.min(dropHeight, localDrop - 1);
    }

    // Place the piece at the calculated height
    shape.forEach(([dx, dy]) => {
        const x = startX + dx;
        const y = dropHeight + dy;
        grid[y][x] = 1;
    });

    return clearFullRows(grid);
}

// Clear full rows and shift the grid down
function clearFullRows(grid) {
    return grid.filter(row => row.includes(0)).concat(
        Array.from({ length: GRID_HEIGHT - grid.filter(row => row.includes(0)).length }, () => Array(GRID_WIDTH).fill(0))
    );
}

// Compute the maximum height of blocks in the grid
function computeMaxHeight(grid) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        if (grid[y].some(cell => cell === 1)) return GRID_HEIGHT - y;
    }
    return 0;
}

// Main resolver function
function resolveTetrisGame(input) {
    const games = input.trim().split("\n");
    const results = [];

    games.forEach(game => {
        const grid = createGrid();
        const moves = game.split(",");

        moves.forEach(move => {
            const [piece, x] = [move[0], parseInt(move.slice(1), 10)];
            placePiece(grid, piece, x);
        });

        results.push(computeMaxHeight(grid));
    });

    return results.join("\n");
}

// Example usage with file input
const fs = require("fs");

fs.readFile("game.txt", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    const result = resolveTetrisGame(data);
    fs.writeFileSync("output.txt", result);
    console.log("Results written to output.txt");
});

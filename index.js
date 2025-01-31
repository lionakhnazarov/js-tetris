const fs = require('fs'); // Import file system module

const WIDTH = 10; // Define the width of the grid
const HEIGHT = 100; // Define the height of the grid

// Define the Tetris shapes with their relative coordinates
const SHAPES = {
    'O': [[0, 0], [1, 0], [0, 1], [1, 1]], // O shape (2x2 block)
    'L': [[0, 0], [0, 1], [0, 2], [1, 2]], // L shape
    'J': [[1, 0], [1, 1], [1, 2], [0, 2]], // J shape
    'T': [[0, 0], [1, 0], [2, 0], [1, 1]], // T shape
    'Z': [[0, 0], [1, 0], [1, 1], [2, 1]], // Z shape
    'I': [[0, 0], [0, 1], [0, 2], [0, 3]], // I shape (vertical line)
    'S': [[1, 0], [2, 0], [0, 1], [1, 1]]  // S shape
};

// Function to place a piece in the grid at the given x position
function placePiece(grid, piece, x) {
    let shape = SHAPES[piece];
    if (shape.some(([dx]) => x + dx >= WIDTH)) return; // Prevent out-of-bounds placement

    let minY = HEIGHT;

    // Find the lowest position where the piece can be placed
    for (let y = 0; y < HEIGHT; y++) {
        if (shape.some(([dx, dy]) => y + dy >= HEIGHT || grid[y + dy][x + dx] === 1)) {
            minY = y - 1;
            break;
        }
    }

    // Place the piece on the grid
    shape.forEach(([dx, dy]) => {
        grid[minY + dy][x + dx] = 1;
    });

    // Remove full rows if any
    removeFullRows(grid);
}

// Function to remove full rows from the grid
function removeFullRows(grid) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell === 1)) { // Check if the row is full
            grid.splice(y, 1); // Remove the row
            grid.unshift(new Array(WIDTH).fill(0)); // Add a new empty row at the top
            y++; // Adjust index to check the next row
        }
    }
}

// Function to get the maximum height of the remaining blocks
function getMaxHeight(grid) {
    for (let y = 0; y < HEIGHT; y++) {
        if (grid[y].some(cell => cell === 1)) { // Find the first occupied row from the top
            return HEIGHT - y; // Return height from bottom to top
        }
    }
    return 0; // If no blocks remain, return height 0
}

// Function to process a game from an input line
function processGame(line) {
    let grid = Array.from({ length: HEIGHT }, () => new Array(WIDTH).fill(0)); // Initialize empty grid
    let pieces = line.split(','); // Split input into individual pieces

    // Place each piece in the grid
    pieces.forEach(piece => {
        let type = piece[0]; // Get piece type (e.g., 'O', 'L')
        let x = parseInt(piece.slice(1), 10); // Get x-coordinate
        placePiece(grid, type, x); // Place the piece
    });

    console.log(getMaxHeight(grid)); // Output the maximum height
}

// Main function to read input and process each game
function main() {
    let input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n'); // Read input from stdin
    input.forEach(line => {
        processGame(line); // Process each game line
    });
}

// Run main function if script is executed directly
if (require.main === module) {
    main();
}
const fs = require('fs');

const WIDTH = 10;
const HEIGHT = 100;
const SHAPES = {
    'O': [[0, 0], [1, 0], [0, 1], [1, 1]],
    'L': [[0, 0], [0, 1], [0, 2], [1, 2]],
    'J': [[1, 0], [1, 1], [1, 2], [0, 2]],
    'T': [[0, 0], [1, 0], [2, 0], [1, 1]],
    'Z': [[0, 0], [1, 0], [1, 1], [2, 1]]
};

function placePiece(grid, piece, x) {
    let shape = SHAPES[piece];
    let maxY = 0;

    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (shape.every(([dx, dy]) => y + dy < HEIGHT && !grid[y + dy][x + dx])) {
            maxY = y;
        } else {
            break;
        }
    }

    shape.forEach(([dx, dy]) => {
        grid[maxY + dy][x + dx] = 1;
    });

    removeFullRows(grid);
}

function removeFullRows(grid) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell === 1)) {
            grid.splice(y, 1);
            grid.unshift(new Array(WIDTH).fill(0));
        }
    }
}

function getMaxHeight(grid) {
    for (let y = 0; y < HEIGHT; y++) {
        if (grid[y].some(cell => cell === 1)) {
            return HEIGHT - y;
        }
    }
    return 0;
}

function processGame(line) {
    let grid = Array.from({ length: HEIGHT }, () => new Array(WIDTH).fill(0));
    let pieces = line.split(',');

    pieces.forEach(piece => {
        let type = piece[0];
        let x = parseInt(piece.slice(1), 10);
        placePiece(grid, type, x);
    });

    return getMaxHeight(grid);
}

function main() {
    let input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    input.forEach(line => {
        console.log(processGame(line));
    });
}
console.log(require.main === module)
if (require.main === module) {
    main();
}

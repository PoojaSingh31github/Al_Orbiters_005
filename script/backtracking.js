// References to key elements
const problemTitle = document.getElementById('problemTitle');
const problemDescription = document.getElementById('problemDescription');
const visualizationContainer = document.getElementById('visualization');
const arrayInput = document.getElementById('arrayInput');

// Current selected problem
let currentProblem = 'sudoku';

const problemData = {
    sudoku: {
        title: 'Sudoku Solver Visualizer',
        description: `
            Solve a 9x9 Sudoku grid using backtracking.
        `,
    },
};

// Set the current problem and reset the UI
function setBacktrackingProblem(problem) {
    currentProblem = problem;
    const { title, description } = problemData[problem];
    problemTitle.innerText = title;
    problemDescription.innerText = description;
    resetVisualization();
}

// Generate random input for the selected problem
function generateRandomInput() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < 20; i++) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        grid[row][col] = Math.floor(Math.random() * 9) + 1;
    }
    arrayInput.value = JSON.stringify(grid);
    visualizeGrid(grid);
}

// Visualize the Sudoku grid
function visualizeGrid(grid) {
    visualizationContainer.innerHTML = '';
    grid.forEach((row) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex space-x-1';
        row.forEach((cell) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = w-8 h-8 text-center ${cell === 0 ? 'bg-gray-700' : 'bg-gray-500'} p-1 border border-gray-600;
            cellDiv.innerText = cell !== 0 ? cell : '';
            rowDiv.appendChild(cellDiv);
        });
        visualizationContainer.appendChild(rowDiv);
    });
}

// Recursive function to solve Sudoku
async function solveSudoku(grid, row = 0, col = 0) {
    if (row === 9) return true;
    if (col === 9) return solveSudoku(grid, row + 1, 0);
    if (grid[row][col] !== 0) return solveSudoku(grid, row, col + 1);

    for (let num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            visualizeGrid(grid);
            await new Promise((resolve) => setTimeout(resolve, 1));

            if (await solveSudoku(grid, row, col + 1)) return true;

            grid[row][col] = 0;
            visualizeGrid(grid);
            await new Promise((resolve) => setTimeout(resolve, 1));
        }
    }
    return false;
}

// Check if a number can be placed in a cell
function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || 
            grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

// Reset the visualization
function resetVisualization() {
    visualizationContainer.innerHTML = '';
    arrayInput.value = '';
}

// Start visualization based on the current problem
function startVisualization() {
    const grid = JSON.parse(arrayInput.value);
    solveSudoku(grid);
}

// Generate initial input
generateRandomInput();
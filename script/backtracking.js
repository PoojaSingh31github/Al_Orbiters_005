// References to key elements
const problemTitle = document.getElementById('problemTitle');
const problemDescription = document.getElementById('problemDescription');
const visualizationContainer = document.getElementById('visualization');
const arrayInput = document.getElementById('arrayInput');

// Current selected problem
let currentProblem = 'ratInMaze';

const problemData = {
    sudoku: {
        title: 'Sudoku Solver Visualizer',
        description: `
            Solve a 9x9 Sudoku grid using backtracking.
        `,
    },
    ratInMaze: {
        title: 'Rat in a Maze Visualizer',
        description: `
            Find a path from the start to the end of a maze using backtracking.
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
    if (currentProblem === 'sudoku') {
        const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
        for (let i = 0; i < 20; i++) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            grid[row][col] = Math.floor(Math.random() * 9) + 1;
        }
        arrayInput.value = JSON.stringify(grid);
        visualizeGrid(grid);
    } else if (currentProblem === 'ratInMaze') {
        const maze = generateSolvableMaze(5, 5);
        arrayInput.value = JSON.stringify(maze);
        visualizeMaze(maze);
    }
}

// Generate a guaranteed solvable maze for Rat in a Maze
function generateSolvableMaze(rows, cols) {
    // Initialize the maze with all walls
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

    // Create a guaranteed path from (0, 0) to (rows - 1, cols - 1)
    let x = 0, y = 0;
    maze[x][y] = 2; // Start point

    const path = [[x, y]];

    while (x !== rows - 1 || y !== cols - 1) {
        if (x < rows - 1 && (y === cols - 1 || Math.random() > 0.5)) {
            x++; // Move down
        } else {
            y++; // Move right
        }
        maze[x][y] = 0; // Mark as a valid path
        path.push([x, y]);
    }

    maze[rows - 1][cols - 1] = 3; // End point

    // Randomly add walls, keeping the guaranteed path intact
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (maze[i][j] === 0 && Math.random() > 0.7 && !path.some(([px, py]) => px === i && py === j)) {
                maze[i][j] = 1; // Add a wall
            }
        }
    }

    return maze;
}


// Visualize the maze
function visualizeMaze(maze) {
    visualizationContainer.innerHTML = '';
    maze.forEach((row) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex space-x-1';
        row.forEach((cell) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = `
                w-8 h-8 text-center 
                ${cell === 1 ? 'bg-gray-600' : 
                  cell === 2 ? 'bg-green-500' : 
                  cell === 3 ? 'bg-red-500' : 
                  cell === 9 ? 'bg-blue-400' : 'bg-white'} 
                p-1 border border-gray-600
            `;
            rowDiv.appendChild(cellDiv);
        });
        visualizationContainer.appendChild(rowDiv);
    });
}

// Recursive function to solve the Rat in a Maze problem
async function solveRatInMaze(maze, x = 0, y = 0) {
    const rows = maze.length;
    const cols = maze[0].length;

    // Base case: If the rat reaches the destination
    if (x === rows - 1 && y === cols - 1) {
        maze[x][y] = 9; // Mark the destination
        visualizeMaze(maze);
        await new Promise((resolve) => setTimeout(resolve, 200));
        return true;
    }

    // Check if the current position is safe to move
    if (isSafeToMove(maze, x, y)) {
        maze[x][y] = 9; // Mark the cell as part of the path
        visualizeMaze(maze);
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Try moving in all 4 directions
        if (await solveRatInMaze(maze, x, y + 1)) return true; // Right
        if (await solveRatInMaze(maze, x + 1, y)) return true; // Down
        if (await solveRatInMaze(maze, x, y - 1)) return true; // Left
        if (await solveRatInMaze(maze, x - 1, y)) return true; // Up

        // Backtrack: Unmark the cell
        maze[x][y] = 0;
        visualizeMaze(maze);
        await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return false;
}

// Check if the rat can move to a specific cell
function isSafeToMove(maze, x, y) {
    const rows = maze.length;
    const cols = maze[0].length;
    return x >= 0 && y >= 0 && x < rows && y < cols && maze[x][y] === 0;
}

// Visualize the Sudoku grid
function visualizeGrid(grid) {
    visualizationContainer.innerHTML = '';
    grid.forEach((row) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex space-x-1';
        row.forEach((cell) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = `w-8 h-8 text-center ${cell === 0 ? 'bg-gray-700' : 'bg-gray-500'} p-1 border border-gray-600`;
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
    if (currentProblem === 'ratInMaze') {
        const maze = JSON.parse(arrayInput.value);
        solveRatInMaze(maze).then((solved) => {
            if (!solved) alert("No solution found for the maze!");
        });
    } else if (currentProblem === 'sudoku') {
        const grid = JSON.parse(arrayInput.value);
        solveSudoku(grid);
    }
}

// Generate initial input
generateRandomInput();

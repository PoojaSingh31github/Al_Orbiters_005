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
            The Sudoku Solver uses backtracking to fill a 9x9 grid so that each row, column, 
            and 3x3 section contain the numbers 1 to 9 without repetition. The algorithm works 
            by filling in empty cells one at a time, and if it finds that a given cell can't 
            hold any valid number, it backtracks to the previous cell and tries the next possible number. 
            The algorithm continues this process until the grid is completely filled or no solution is found.
        `,
        timeComplexity: `
            <strong>Best Case:</strong> O(n²) (when there are fewer empty cells to fill).<br>
            <strong>Average and Worst Case:</strong> O(9^(n²)) (for each empty cell, there are up to 9 possible values to try).
        `,
        spaceComplexity: `
            O(n²) (requires space for the grid and recursion stack).
        `,
        conclusion: `
           The Sudoku Solver is an excellent demonstration of backtracking, but it is not suitable for large puzzles due to its exponential time complexity.
        `
    },
    nQueens: {
        title: 'N-Queens Problem',
        description: `
            The N-Queens problem involves placing N queens on an N×N chessboard so that no two queens 
            threaten each other. Each queen must be placed such that no other queen is in the same row, 
            column, or diagonal. Backtracking is used to try placing a queen in each row, and if placing 
            the queen leads to a conflict later on, the algorithm backtracks and tries the next possible position.
        `,
        timeComplexity: `
            <strong>Best Case:</strong> O(n²) (this assumes that the solution is found early in the process).<br>
            <strong>Average and Worst Case:</strong> O(n!) (due to the recursive nature of the problem and trying all possible positions for each queen).
        `,
        spaceComplexity: `
            O(n) (requires space to track the positions of the queens).
        `,
        conclusion: `
           The N-Queens problem is a classic demonstration of backtracking, but it becomes computationally expensive for larger values of N due to the exponential growth in possible placements.
        `
    },
    wordBreak: {
        title: 'Word Break Problem',
        description: `
            The Word Break problem determines if a given string can be segmented into words from a dictionary. 
            The problem is solved by checking if there exists a valid partition of the string such that each segment 
            of the partition is a word found in the dictionary. This is typically solved using backtracking or dynamic programming.
        `,
        timeComplexity: `
            <strong>Best Case:</strong> O(n) (if the string can be segmented with minimal backtracking).<br>
            <strong>Average and Worst Case:</strong> O(n²) (since each substring check could involve iterating over a portion of the string).
        `,
        spaceComplexity: `
            O(n) (for storing intermediate results when using dynamic programming or recursion stack for backtracking).
        `,
        conclusion: `
           The Word Break problem is a great example of backtracking, though it may not be the most efficient approach for longer strings when compared to dynamic programming.
        `
    },
    ratInMaze: {
        title: 'Rat in a Maze',
        description: `
            The Rat in a Maze problem involves finding a path for a rat from the start to the end of a grid. 
            The rat can only move in 4 directions (up, down, left, right), and it can only move through 
            cells that are open (denoted as 1). The algorithm uses backtracking to explore all possible paths, 
            and when it reaches a dead end, it backtracks to the previous cell and tries a new direction.
        `,
        timeComplexity: `
            <strong>Best Case:</strong> O(n) (if the path is found early in the grid).<br>
            <strong>Average and Worst Case:</strong> O(2^(n²)) (because the algorithm explores all possible paths in the grid).
        `,
        spaceComplexity: `
            O(n²) (for storing the grid and recursion stack).
        `,
        conclusion: `
           The Rat in a Maze problem demonstrates backtracking in exploring paths, but it becomes inefficient in larger grids due to its exponential time complexity.
        `

    }
};


// Function to update the UI for the selected problem
function setBacktrackingProblem(problem) {
    currentProblem = problem;
    const { title, description, timeComplexity, spaceComplexity, conclusion } = problemData[problem];
    problemTitle.innerText = title;
    problemDescription.innerHTML = `
        <div class="p-6 mt-4 bg-gray-800 rounded-lg shadow-lg space-y-4" id="problemDescription">
                <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500" id="problemTitle">
                    ${title}
                </h2>
                <p class="text-gray-300 leading-relaxed" id="problemDescriptionText">
                    ${description}
                </p>
                
                <!-- Time Complexity Section -->
                <div class="bg-gray-700 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-2">
                        Time Complexity:
                    </h3>
                    <p class="text-gray-300">
                    ${timeComplexity}    
                    </p>
                </div>
            
                <!-- Space Complexity Section -->
                <div class="bg-gray-700 p-4 rounded-lg">
                    <h3 class="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
                        Space Complexity:
                    </h3>
                    <p class="text-gray-300">
                       ${spaceComplexity}
                    </p>
                </div>
            
                <!-- Additional Problem Information -->
                <p class="text-gray-400 italic">
                   ${conclusion}
                </p>
            </div>
    `;
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

// Visualize grid function to update UI with the current state of the Sudoku grid
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

// Check if a number can be placed in a given position
function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num || grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

// Recursive function to solve Sudoku with visualization
async function solveSudoku(grid, row = 0, col = 0) {
    if (row === 9) return true;
    if (col === 9) return solveSudoku(grid, row + 1, 0);
    if (grid[row][col] !== 0) return solveSudoku(grid, row, col + 1);

    for (let num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            visualizeGrid(grid); // Update visualization
            await new Promise((resolve) => setTimeout(resolve, 200)); // Pause for visualization

            if (await solveSudoku(grid, row, col + 1)) return true;

            grid[row][col] = 0;
            visualizeGrid(grid); 
            await new Promise((resolve) => setTimeout(resolve, 200)); // Pause for visualization
        }
    }
    return false;
}

function startVisualization() {
    const grid = JSON.parse(arrayInput.value);
    solveSudoku(grid);
}

function resetVisualization() {
    visualizationContainer.innerHTML = '';
    arrayInput.value = '';
}

generateRandomInput();
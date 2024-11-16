let n;
let board = [];
let visualizationContainer = document.getElementById("visualization");
let queenElements = []; // Store the DOM elements of queens for animation

// Function to start the N-Queens visualization
function startNQueensVisualization() {
    n = parseInt(document.getElementById("nInput").value) || 8; // Default to 8 if no input
    board = Array(n).fill().map(() => Array(n).fill(0)); // Initialize the board to 0 (empty)
    queenElements = []; // Reset queen elements
    visualizationContainer.innerHTML = ""; // Clear previous visualization
    drawBoard(); // Draw the board first
    solveNQueens(0); // Start solving from the first row
}

// Function to reset the visualization
function resetNQueensVisualization() {
    board = [];
    queenElements = [];
    visualizationContainer.innerHTML = ""; // Clear the visualization
}

// Function to generate a random size for the board (between 4 and 10)
// Only draws the board without animation
function generateRandomInput() {
    n = Math.floor(Math.random() * 7) + 4; // Generates a number between 4 and 10
    document.getElementById("nInput").value = n;
    board = Array(n).fill().map(() => Array(n).fill(0)); // Initialize an empty board
    queenElements = []; // Reset queen elements
    visualizationContainer.innerHTML = ""; // Clear previous visualization
    drawBoard(); // Draw the board without solving or animating
}

// Solve N-Queens using backtracking
async function solveNQueens(row) {
    if (row === n) {
        return true; // All queens placed successfully
    }

    for (let col = 0; col < n; col++) {
        if (isSafe(row, col)) {
            board[row][col] = 1; // Place queen
            await animateQueenMove(row, col); // Animate the queen's move

            if (await solveNQueens(row + 1)) return true; // Move to next row
            board[row][col] = 0; // Backtrack
            await animateBacktrack(row, col); // Animate the backtracking
        }
    }

    return false; // No valid placement found
}

// Check if a queen can be placed at board[row][col]
function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false; // Check column
        if (board[i][col - (row - i)] === 1) return false; // Check left diagonal
        if (board[i][col + (row - i)] === 1) return false; // Check right diagonal
    }
    return true;
}

// Animate the queen's movement from one cell to another
async function animateQueenMove(row, col) {
    const cellDiv = document.querySelector(`.cell-${row}-${col}`);
    if (!cellDiv) {
        console.error(`Cell for position (${row}, ${col}) not found.`);
        return;
    }
    
    const queenIcon = document.createElement('i');
    queenIcon.className = "fa-solid fa-chess-queen text-black"; 
    cellDiv.appendChild(queenIcon);

    // Add the queen element to the array for tracking
    queenElements.push({ row, col, element: queenIcon });

    await new Promise(resolve => setTimeout(resolve, 500)); // Delay for visual effect
}

// Animate the backtracking by removing the queen
async function animateBacktrack(row, col) {
    const queen = queenElements.find(q => q.row === row && q.col === col);
    if (queen) {
        queen.element.remove(); // Remove the queen icon from the board
        queenElements = queenElements.filter(q => !(q.row === row && q.col === col)); // Remove from tracking array
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay for visual effect
}

// Draw the current state of the board with a chessboard pattern
function drawBoard() {
    visualizationContainer.innerHTML = ""; // Clear the visualization container

    for (let i = 0; i < n; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid grid-cols-' + n; // Create a row with n columns
        
        for (let j = 0; j < n; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = `w-10 h-10 border-2 border-gray-600 cell-${i}-${j} ${((i + j) % 2 === 0) ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}`;

            rowDiv.appendChild(cellDiv); // Add cell to row
        }
        
        visualizationContainer.appendChild(rowDiv); // Add row to visualization container
    }
}

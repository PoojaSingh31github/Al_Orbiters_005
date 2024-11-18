let n;
let board = [];
let visualizationContainer = document.getElementById("visualization");
let queenElements = [];

// start the N-Queens visualization
function startNQueensVisualization() {
    n = parseInt(document.getElementById("nInput").value) || 8;
    board = Array(n).fill().map(() => Array(n).fill(0));
    queenElements = [];
    visualizationContainer.innerHTML = "";
    drawBoard();
    solveNQueens(0);
}

// reset the visualization
function resetNQueensVisualization() {
    board = [];
    queenElements = [];
    visualizationContainer.innerHTML = "";
}

// Function to generate a random size for the board
function generateRandomInput() {
    n = Math.floor(Math.random() * 7) + 4;
    document.getElementById("nInput").value = n;
    board = Array(n).fill().map(() => Array(n).fill(0));
    queenElements = [];
    visualizationContainer.innerHTML = "";
    drawBoard();
}


async function solveNQueens(row) {
    if (row === n) {
        return true;
    }

    for (let col = 0; col < n; col++) {
        if (isSafe(row, col)) {
            board[row][col] = 1;
            await animateQueenMove(row, col);

            if (await solveNQueens(row + 1)) return true;
            board[row][col] = 0;
            await animateBacktrack(row, col);
        }
    }
    return false;
}

// Check if a queen can be placed at board[row][col]
function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false;
        if (board[i][col - (row - i)] === 1) return false;
        if (board[i][col + (row - i)] === 1) return false;
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
    queenIcon.className = "fa-solid fa-chess-queen text-black queen-icon"; 
    cellDiv.appendChild(queenIcon);
    queenElements.push({ row, col, element: queenIcon });
    await new Promise(resolve => setTimeout(resolve, 500));
}

// Animate removing the queen
async function animateBacktrack(row, col) {
    const queen = queenElements.find(q => q.row === row && q.col === col);
    if (queen) {
        queen.element.remove();
        queenElements = queenElements.filter(q => !(q.row === row && q.col === col));
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
}

// Draw the current state of the board with a chessboard pattern
function drawBoard() {
    visualizationContainer.innerHTML = "";

    for (let i = 0; i < n; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid grid-cols-' + n;
        
        for (let j = 0; j < n; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = `w-10 h-10 border-2 border-gray-600 cell-${i}-${j} ${((i + j) % 2 === 0) ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}`;

            rowDiv.appendChild(cellDiv);
        }
        
        visualizationContainer.appendChild(rowDiv);
    }
}

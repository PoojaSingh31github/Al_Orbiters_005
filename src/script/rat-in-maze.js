let maze = [];
let pathFound = false;

// Generate a maze based on user input size
function generateRandomMazeWithInput() {
    const sizeInput = document.getElementById("mazeSizeInput").value;
    const size = parseInt(sizeInput, 10);
    if (isNaN(size) || size < 2) {
        alert("Please enter a valid maze size (minimum 2).");
        return;
    }
    generateRandomMaze(size);
}

// Generate a random maze
function generateRandomMaze(size) {
    maze = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => (Math.random() < 0.8 ? 1 : 0))
    );
    maze[0][0] = 1;
    maze[size - 1][size - 1] = 1;
    displayMaze(maze);
}


// Display the maze in the visualization area
function displayMaze(maze) {
    const visualizationArea = document.getElementById("visualizationArea");
    visualizationArea.innerHTML = "";
    const n = maze.length;
    visualizationArea.style.gridTemplateColumns = `repeat(${n},50px)`;
    for (let i = 0; i < n; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "visualization-row";

        for (let j = 0; j < n; j++) {
            const cell = document.createElement("div");
            cell.className = "visualization-box";
            cell.id = `cell-${i}-${j}`;
            if (i === 0 && j === 0) {
                cell.classList.add("start");
            } else if (i === n - 1 && j === n - 1) {
                cell.classList.add("end");
            } else if (maze[i][j] === 0) {
                cell.classList.add("block");
            }
            
            rowDiv.appendChild(cell);
        }

        visualizationArea.appendChild(rowDiv);
    }
}

// Start the maze visualization
async function startMazeVisualization() {
    if (maze.length === 0) {
        alert("Please generate a maze first!");
        return;
    }

    const size = maze.length;
    const solution = Array.from({ length: size }, () => Array(size).fill(0));
    pathFound = false;
    
    try {
        if (!await solveMaze(maze, solution, 0, 0)) {
            alert("No path found!");
        }
    } catch (e) {
        if (e instanceof RangeError) {
            alert("No path found! (Maximum call stack size exceeded)");
        } else {
            throw e;
        }
    } finally {
        clearPaths(solution);
    }
}

// Solve the maze
async function solveMaze(maze, solution, x, y) {
    const n = maze.length;
    if (x === n - 1 && y === n - 1) {
        solution[x][y] = 1;
        await highlightSolution(solution);
        pathFound = true;
        return true;
    }

    // Check if the current cell is safe to visit
    if (isSafe(maze, x, y)) {
        solution[x][y] = 1;
        await highlightCell(x, y, true);
        const directions = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: -1 }
        ];

        for (const { dx, dy } of directions) {
            if (await solveMaze(maze, solution, x + dx, y + dy)) return true;
        }

        solution[x][y] = 0;
        await highlightCell(x, y, false);
    }

    return false;
}

// Check if the current cell is safe
function isSafe(maze, x, y) {
    const n = maze.length;
    return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1;
}

// Highlight the current cell
async function highlightCell(x, y, isPath) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    if (cell) {
        cell.className = `visualization-box ${isPath ? "highlight-success" : "highlight-fail"}`;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
}

// Highlight the entire solution path
async function highlightSolution(solution) {
    const n = solution.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (solution[i][j] === 1) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) {
                    cell.className = "visualization-box highlight-success";
                }
            }
        }
    }
    setTimeout(() => {
        if (!pathFound) {
            alert("No path found!");
        } else {
            alert("Path found!");
        }
    }, 500);
}

// Clear the previous paths or any flags
function clearPaths(solution) {
    const n = solution.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (solution[i][j] === 1) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) {
                    cell.className = "visualization-box";
                }
            }
        }
    }
    pathFound = false;
}

// Reset the maze visualization
function resetMazeVisualization() {
    maze = [];
    document.getElementById("visualizationArea").innerHTML = "";
}

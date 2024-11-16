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
    maze[0][0] = 1; // Start point
    maze[size - 1][size - 1] = 1; // End point
    displayMaze(maze);
}


// Display the maze in the visualization area
function displayMaze(maze) {
    const visualizationArea = document.getElementById("visualizationArea");
    visualizationArea.innerHTML = ""; // Clear previous content
    const n = maze.length;
    visualizationArea.style.gridTemplateColumns = `repeat(${n},50px)`;
    for (let i = 0; i < n; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "visualization-row";

        for (let j = 0; j < n; j++) {
            const cell = document.createElement("div");
            cell.className = "visualization-box";
            cell.id = `cell-${i}-${j}`;
            // Mark start and end points with unique colors
            if (i === 0 && j === 0) {
                cell.classList.add("start");
            } else if (i === n - 1 && j === n - 1) {
                cell.classList.add("end");
            } else if (maze[i][j] === 0) {
                cell.classList.add("block"); // Blocked cells
            }
            
            rowDiv.appendChild(cell);
        }

        visualizationArea.appendChild(rowDiv);
    }
}

// Start the maze visualization (no new maze generation)
async function startMazeVisualization() {
    if (maze.length === 0) {
        alert("Please generate a maze first!");
        return;
    }

    const size = maze.length; // Get the size of the existing maze
    const solution = Array.from({ length: size }, () => Array(size).fill(0));
    pathFound = false; // Reset the path found flag
    
    try {
        // Start solving the maze using backtracking
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
        // Clear the previous paths or any flags
        clearPaths(solution);
    }
}

// Solve the maze using backtracking with animation
async function solveMaze(maze, solution, x, y) {
    const n = maze.length;

    // Base case: Reached destination
    if (x === n - 1 && y === n - 1) {
        solution[x][y] = 1;
        await highlightSolution(solution);
        pathFound = true; // Set the path found flag
        return true;
    }

    // Check if the current cell is safe to visit
    if (isSafe(maze, x, y)) {
        solution[x][y] = 1;
        await highlightCell(x, y, true);

        // Define the priority of directions: down, right, up, left
        const directions = [
            { dx: 1, dy: 0 }, // Down
            { dx: 0, dy: 1 }, // Right
            { dx: -1, dy: 0 }, // Up
            { dx: 0, dy: -1 } // Left
        ];

        // Try moving in the prioritized directions
        for (const { dx, dy } of directions) {
            if (await solveMaze(maze, solution, x + dx, y + dy)) return true;
        }

        // Backtrack: Unmark the current cell as part of the solution path
        solution[x][y] = 0;
        await highlightCell(x, y, false);
    }

    return false; // No valid path found from here
}

// Check if the current cell is safe (within bounds and not blocked)
function isSafe(maze, x, y) {
    const n = maze.length;
    return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1;
}

// Highlight the current cell (animate path and failure)
async function highlightCell(x, y, isPath) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    if (cell) {
        cell.className = `visualization-box ${isPath ? "highlight-success" : "highlight-fail"}`;
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Add delay for visualization
}

// Highlight the entire solution path once it's found
async function highlightSolution(solution) {
    const n = solution.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (solution[i][j] === 1) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) {
                    cell.className = "visualization-box highlight-success"; // Highlight the path
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
                    cell.className = "visualization-box"; // Clear the path
                }
            }
        }
    }
    pathFound = false; // Reset the path found flag
}

// Reset the maze visualization
function resetMazeVisualization() {
    maze = []; // Clear the existing maze
    document.getElementById("visualizationArea").innerHTML = "";
}

function startWordBreakVisualization() {
    const word = document.getElementById("wordInput").value.trim();
    const dictionary = document.getElementById("dictionaryInput").value.trim().split(",");

    if (!word || dictionary.length === 0) {
        alert("Please provide valid inputs!");
        return;
    }

    visualizeWordBreak(word, dictionary);
}

// Visualize Word Break using Backtracking
function visualizeWordBreak(word, dictionary) {
    const visualizationArea = document.getElementById("visualizationArea");
    visualizationArea.innerHTML = ""; // Clear previous visualizations

    const n = word.length;

    // Start the backtracking from the 0th index
    function canBreak(start, path) {
        // If we reached the end of the word, then highlight the path and finish
        if (start === word.length) {
            setTimeout(() => {
                visualizationArea.innerHTML = ""; // Clear intermediate highlights
                highlightPath(word, path); // Highlight only the final segments
                alert("Word can be segmented!");
            }, 500 * path.length);
            return true;
        }

        // Try every possible word break from the current position
        for (let end = start + 1; end <= word.length; end++) {
            const substring = word.slice(start, end); // Extract the current substring

            if (dictionary.includes(substring)) {
                // If the substring is in the dictionary, it's a valid segment
                setTimeout(() => {
                    highlightSubstring(word, start, end - 1, true); // Highlight valid substring
                }, 500 * path.length);

                // Add this valid segment to the path and recursively check the remaining part
                const newPath = [...path, { start, end }];
                if (canBreak(end, newPath)) {
                    return true;
                }
            } else {
                // Optional: Highlight invalid segments
                setTimeout(() => {
                    highlightSubstring(word, start, end - 1, false); // Highlight invalid substring
                }, 500 * path.length);
            }
        }

        // If no valid segmentation is found, return false
        return false;
    }

    // Begin the backtracking process
    if (!canBreak(0, [])) {
        setTimeout(() => {
            alert("Word cannot be segmented.");
        }, 500 * n);
    }
}

// Function to highlight a valid or invalid substring in the visualization
function highlightSubstring(word, start, end, isValid) {
    const substring = word.slice(start, end + 1); // Get the substring
    const box = document.createElement("div");
    box.className = `visualization-box ${isValid ? "highlight-success" : "highlight-fail"}`;
    box.textContent = substring; // Show the substring
    document.getElementById("visualizationArea").appendChild(box); // Append the segment
}

// Function to highlight the entire valid path once the word is segmented
function highlightPath(word, path) {
    path.forEach(({ start, end }) => {
        const segment = word.slice(start, end); // Get the full segment as a string
        const segmentBox = document.createElement("div");
        segmentBox.className = "visualization-box highlight-path";
        segmentBox.textContent = segment; // Display the segment
        document.getElementById("visualizationArea").appendChild(segmentBox);
    });
}

// Reset the visualization area
function resetWordBreakVisualization() {
    document.getElementById("wordInput").value = "";
    document.getElementById("dictionaryInput").value = "";
    document.getElementById("visualizationArea").innerHTML = "";
}

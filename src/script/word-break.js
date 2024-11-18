function startWordBreakVisualization() {
    const word = document.getElementById("wordInput").value.trim();
    const dictionary = document.getElementById("dictionaryInput").value.trim().split(",");

    if (!word || dictionary.length === 0) {
        alert("Please provide valid inputs!");
        return;
    }

    visualizeWordBreak(word, dictionary);
}

// Visualization of Word Break
function visualizeWordBreak(word, dictionary) {
    const visualizationArea = document.getElementById("visualizationArea");
    visualizationArea.innerHTML = "";
    const n = word.length;
    function canBreak(start, path) {
        if (start === word.length) {
            setTimeout(() => {
                visualizationArea.innerHTML = "";
                highlightPath(word, path);
                alert("Word can be segmented!");
            }, 500 * path.length);
            return true;
        }

        for (let end = start + 1; end <= word.length; end++) {
            const substring = word.slice(start, end); 

            if (dictionary.includes(substring)) {
                setTimeout(() => {
                    highlightSubstring(word, start, end - 1, true);
                }, 500 * path.length);

                const newPath = [...path, { start, end }];
                if (canBreak(end, newPath)) {
                    return true;
                }
            } else {
                setTimeout(() => {
                    highlightSubstring(word, start, end - 1, false);
                }, 500 * path.length);
            }
        }
        return false;
    }

    if (!canBreak(0, [])) {
        setTimeout(() => {
            alert("Word cannot be segmented.");
        }, 500 * n);
    }
}

// highlight a valid or invalid substring in the visualization
function highlightSubstring(word, start, end, isValid) {
    const substring = word.slice(start, end + 1);
    const box = document.createElement("div");
    box.className =` visualization-box ${isValid ? "highlight-success" : "highlight-fail"}`;
    box.textContent = substring;
    document.getElementById("visualizationArea").appendChild(box);
}

// highlight the entire valid path
function highlightPath(word, path) {
    path.forEach(({ start, end }) => {
        const segment = word.slice(start, end);
        const segmentBox = document.createElement("div");
        segmentBox.className = "visualization-box highlight-path";
        segmentBox.textContent = segment;
        document.getElementById("visualizationArea").appendChild(segmentBox);
    });
}

// Reset the visualization area
function resetWordBreakVisualization() {
    document.getElementById("wordInput").value = "";
    document.getElementById("dictionaryInput").value = "";
    document.getElementById("visualizationArea").innerHTML = "";
}
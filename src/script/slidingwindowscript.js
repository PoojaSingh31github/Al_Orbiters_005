let slidingWindows = [];
let currentIndex = 0;
let animationInterval = null;

// Handles sliding window type change
document.getElementById("windowType").addEventListener("change", (event) => {
  const fixedWindowInput = document.getElementById("fixedWindowInput");
  const variableWindowInput = document.getElementById("variableWindowInput");

  if (event.target.value === "fixed") {
    fixedWindowInput.classList.remove("hidden");
    variableWindowInput.classList.add("hidden");
  } else if (event.target.value === "variable") {
    fixedWindowInput.classList.add("hidden");
    variableWindowInput.classList.remove("hidden");
  }
});

// Handles Enter button
document.getElementById("enterButton").addEventListener("click", () => {
  const inputArray = document.getElementById("inputArray").value
    .split(",")
    .map((num) => parseInt(num.trim()));
  const windowType = document.getElementById("windowType").value;
  const visualizer = document.getElementById("visualizer");

  visualizer.innerHTML = "";
  slidingWindows = [];
  currentIndex = 0;

  if (animationInterval) {
    clearInterval(animationInterval);
  }

  if (inputArray.length === 0 || inputArray.some(isNaN)) {
    showError("Invalid array input. Please enter a comma-separated list of numbers.");
    return;
  }

  if (windowType === "fixed") {
    const windowSize = parseInt(document.getElementById("windowSize").value);

    if (isNaN(windowSize) || windowSize <= 0) {
      showError("Invalid fixed window size. Please enter a positive number.");
      return;
    }

    if (windowSize > inputArray.length) {
      showError("Window size cannot be larger than the array length.");
      return;
    }

    // Generate fixed sliding windows
    for (let i = 0; i <= inputArray.length - windowSize; i++) {
      slidingWindows.push(inputArray.slice(i, i + windowSize));
    }
  } else if (windowType === "variable") {
    const variableSizes = document.getElementById("variableSizes").value
      .split(",")
      .map((num) => parseInt(num.trim()));

    if (
      variableSizes.length === 0 ||
      variableSizes.some(isNaN) ||
      variableSizes.some((size) => size <= 0)
    ) {
      showError(
        "Invalid variable window sizes. Please enter a comma-separated list of positive integers."
      );
      return;
    }

    let totalElementsCovered = 0;
    for (const size of variableSizes) {
      totalElementsCovered += size;
    }

    if (totalElementsCovered > inputArray.length) {
      showError(
        "Variable window sizes exceed the array length. Adjust sizes or input a larger array."
      );
      return;
    }

    // Generate variable sliding windows
    let start = 0;
    for (const size of variableSizes) {
      if (start + size <= inputArray.length) {
        slidingWindows.push(inputArray.slice(start, start + size));
        start += size;
      } else {
        break;
      }
    }
  }

  displayInitialArray(inputArray);
  animateSlidingWindow();
});

// Handles Reset button
document.getElementById("resetButton").addEventListener("click", resetVisualizer);

function resetVisualizer() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
  document.getElementById("visualizer").innerHTML = "";
  slidingWindows = [];
  currentIndex = 0;

  if (animationInterval) {
    clearInterval(animationInterval);
  }
}

function showError(message) {
  const visualizer = document.getElementById("visualizer");
  visualizer.innerHTML = `<p class="text-red-500 font-semibold">${message}</p>`;
}

function displayInitialArray(inputArray) {
  const visualizer = document.getElementById("visualizer");
  visualizer.innerHTML = "";

  inputArray.forEach((num, index) => {
    const numDiv = document.createElement("div");
    numDiv.className =
      "text-center text-white bg-gray-400 rounded-full w-12 h-12 flex items-center justify-center font-bold transition-transform";
    numDiv.id = `element-${index}`;
    numDiv.innerText = num;
    visualizer.appendChild(numDiv);
  });
}

// Animate the sliding window
function animateSlidingWindow() {
  const interval = 1000;
  let windowElements = [];

  animationInterval = setInterval(() => {
    // Clear the previous window
    windowElements.forEach((el) => {
      el.classList.remove("bg-blue-500");
      el.classList.add("bg-gray-400");
    });

    if (currentIndex >= slidingWindows.length) {
      clearInterval(animationInterval);
      return;
    }

    // Highlight the current window
    const currentWindow = slidingWindows[currentIndex];
    windowElements = [];

    currentWindow.forEach((num) => {
      const el = document.getElementById(
        `element-${currentIndex + currentWindow.indexOf(num)}`
      );
      el.classList.remove("bg-gray-400");
      el.classList.add("bg-blue-500");
      windowElements.push(el);
    });

    currentIndex++;
  }, interval);
}

document.getElementById('enterArray').addEventListener('click', generateBars);
document.getElementById('sortButton').addEventListener('click', sortArray);
document.getElementById('resetButton').addEventListener('click', reset);


const algorithmsData = {
    bubbleSort: {
        name: "Bubble Sort",
        description: "Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process continues until the list is sorted.",
        timeComplexity: "Best Case: O(n), Average and Worst Case: O(n²)",
        spaceComplexity: "O(1) (in-place sorting)",
        note: "Bubble Sort is not suitable for large datasets due to its inefficiency. However, it is simple to implement."
    },
    selectionSort: {
        name: "Selection Sort",
        description: "Selection Sort is an in-place comparison-based algorithm. It works by dividing the list into two parts: a sorted and an unsorted part. It repeatedly selects the smallest element from the unsorted part and moves it to the sorted part.",
        timeComplexity: "Best, Average, and Worst Case: O(n²)",
        spaceComplexity: "O(1) (in-place sorting)",
        note: "Selection Sort is efficient for small datasets but inefficient for large datasets."
    },
    insertionSort: {
        name: "Insertion Sort",
        description: "Insertion Sort builds the sorted array one element at a time. It takes one element from the unsorted part and inserts it into its correct position in the sorted part.",
        timeComplexity: "Best Case: O(n), Average and Worst Case: O(n²)",
        spaceComplexity: "O(1) (in-place sorting)",
        note: "Insertion Sort is efficient for small datasets but inefficient for large datasets."
    },
    mergeSort: {
        name: "Merge Sort",
        description: "Merge Sort is a divide-and-conquer algorithm. It divides the array into two halves, recursively sorts each half, and then merges the two sorted halves back together.",
        timeComplexity: "Best, Average, and Worst Case: O(n log n)",
        spaceComplexity: "O(n) (not in-place)",
        note: "Merge Sort is efficient for large datasets and guarantees O(n log n) performance, but it requires additional space for merging."
    },
    quickSort: {
        name: "Quick Sort",
        description: "Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot. The subarrays are then recursively sorted.",
        timeComplexity: "Best and Average Case: O(n log n), Worst Case: O(n²)",
        spaceComplexity: "O(log n) (in-place sorting)",
        note: "Quick Sort is efficient but can degrade to O(n²) if not implemented properly (e.g., with a bad pivot)."
    },
    heapSort: {
        name: "Heap Sort",
        description: "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It first builds a heap from the input array and then repeatedly extracts the maximum element from the heap to build the sorted array.",
        timeComplexity: "Best, Average, and Worst Case: O(n log n)",
        spaceComplexity: "O(1) (in-place sorting)",
        note: "Heap Sort is efficient and guarantees O(n log n) performance, but it is not stable and does not preserve the order of equal elements."
    }
};


let array = [];
let selectedAlgorithm = 'bubbleSort';

function setSortAlgorithm(algorithm) {
    selectedAlgorithm = algorithm;
    // Update the main algorithm name
    document.getElementById('algorithmName').textContent = `${capitalize(algorithm)} Visualizer`;

    // Update the algorithm details dynamically
    const algorithmData = algorithmsData[algorithm];
    document.querySelector('.algorithm-details h2').textContent = algorithmData.name;
    document.querySelector('.algorithm-details p').textContent = algorithmData.description;
    document.querySelector('#timeComplexity').textContent = `Time Complexity: ${algorithmData.timeComplexity}`;
    document.querySelector('#spaceComplexity').textContent = `Space Complexity: ${algorithmData.spaceComplexity}`;
    document.querySelector('.note').textContent = algorithmData.note;
}


function capitalize(str) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

function generateBars() {
    const arrayInput = document.getElementById('arrayInput').value;
    array = arrayInput.split(',').map(Number);
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = ''; // Clear existing bars

    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 5}px`;
        bar.textContent = value;
        visualization.appendChild(bar);
    });

    // Adjust the visualization container height dynamically
    adjustVisualizationHeight();
}

function sortArray() {
    switch (selectedAlgorithm) {
        case 'bubbleSort':
            bubbleSort();
            break;
        case 'selectionSort':
            selectionSort();
            break;
        case 'insertionSort':
            insertionSort();
            break;
        case 'mergeSort':
            mergeSort(0, array.length - 1);
            break;
        case 'quickSort':
            quickSort(0, array.length - 1);
            break;
        case 'heapSort':
            heapSort();
            break;
    }
}

async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add('active');
            bars[j + 1].classList.add('active');
            
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateBars(bars, j, j + 1);
                await pause();
            }

            bars[j].classList.remove('active');
            bars[j + 1].classList.remove('active');
        }
        bars[array.length - i - 1].classList.add('sorted');
    }

    // Adjust the visualization container height dynamically after sorting
    adjustVisualizationHeight();
}

async function selectionSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        bars[minIdx].classList.add('active');
        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add('active');
            if (array[j] < array[minIdx]) {
                bars[minIdx].classList.remove('active');
                minIdx = j;
                bars[minIdx].classList.add('active');
            }
            await pause();
            bars[j].classList.remove('active');
        }
        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            updateBars(bars, i, minIdx);
            await pause();
        }
        bars[minIdx].classList.remove('active');
        bars[i].classList.add('sorted');
    }
    // Adjust the visualization container height dynamically after sorting
    adjustVisualizationHeight();
}

async function insertionSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j] < array[j - 1]) {
            [array[j], array[j - 1]] = [array[j - 1], array[j]];
            updateBars(bars, j, j - 1);
            j--;
            await pause();
        }
        bars[i].classList.add('sorted');
    }

    // Adjust the visualization container height dynamically after sorting
    adjustVisualizationHeight();
}

async function mergeSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
}

async function merge(left, mid, right) {
    let temp = [];
    let i = left, j = mid + 1;
    while (i <= mid && j <= right) {
        if (array[i] <= array[j]) temp.push(array[i++]);
        else temp.push(array[j++]);
    }
    while (i <= mid) temp.push(array[i++]);
    while (j <= right) temp.push(array[j++]);
    for (let k = left; k <= right; k++) {
        array[k] = temp[k - left];
        document.querySelectorAll('.bar')[k].style.height = `${array[k] * 5}px`;
        document.querySelectorAll('.bar')[k].textContent = array[k];
        await pause();
    }

    // Adjust the visualization container height dynamically after sorting
    adjustVisualizationHeight();
}

async function quickSort(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBars(document.querySelectorAll('.bar'), i, j);
            await pause();
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateBars(document.querySelectorAll('.bar'), i + 1, high);
    await pause();
    return i + 1;
}

async function heapSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = Math.floor(array.length / 2 - 1); i >= 0; i--) await heapify(array.length, i, bars);
    for (let i = array.length - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        updateBars(bars, 0, i);
        await pause();
        await heapify(i, 0, bars);
    }

    // Adjust the visualization container height dynamically after sorting
    adjustVisualizationHeight();
}

async function heapify(n, i, bars) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        updateBars(bars, i, largest);
        await pause();
        await heapify(n, largest, bars);
    }
}

function updateBars(bars, i, j) {
    bars[i].style.height = `${array[i] * 5}px`;
    bars[i].textContent = array[i];
    bars[j].style.height = `${array[j] * 5}px`;
    bars[j].textContent = array[j];
    bars[i].classList.add('selected');
    bars[j].classList.add('selected');
    setTimeout(() => {
        bars[i].classList.remove('selected');
        bars[j].classList.remove('selected');
    }, 100);
}

function reset() {
    array = [];
    document.getElementById('visualization').innerHTML = '';
    document.getElementById('arrayInput').value = '';
}

function pause() {
    return new Promise(resolve => setTimeout(resolve, 200));
}

function adjustVisualizationHeight() {
    const bars = document.querySelectorAll('.bar');
    let maxHeight = 0;

    bars.forEach(bar => {
        const barHeight = bar.offsetHeight;
        if (barHeight > maxHeight) {
            maxHeight = barHeight;
        }
    });

    const visualization = document.getElementById('visualization');
    visualization.style.height = `${maxHeight + 20}px`;
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  addNodeToStart(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.display();
  }

  addNodeToEnd(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.display();
  }

  deleteNodeFromStart() {
    if (this.head) {
      this.head = this.head.next;
      this.display();
    }
  }

  deleteNodeFromEnd() {
    if (!this.head) return;
    if (!this.head.next) {
      this.head = null;
    } else {
      let current = this.head;
      while (current.next && current.next.next) {
        current = current.next;
      }
      current.next = null;
    }
    this.display();
  }

  display() {
    const listContainer = document.getElementById("listContainer");
    listContainer.innerHTML = "";
    let current = this.head;

    // Display nodes
    while (current) {
      const nodeDiv = document.createElement("div");
      nodeDiv.className = "node";
      nodeDiv.innerHTML = `
        <div class="node-value">${current.value}</div>
      `;
      listContainer.appendChild(nodeDiv);

      const arrowDiv = document.createElement("div");
      arrowDiv.className = "arrow";
      listContainer.appendChild(arrowDiv);

      current = current.next;
    }

    // Display the null node at the end
    const nullNode = document.createElement("div");
    nullNode.className = "null-node";
    nullNode.textContent = "null";
    listContainer.appendChild(nullNode);
  }
}

const linkedList = new LinkedList();

function addNodeToStart() {
  const value = document.getElementById("nodeValue").value;
  if (value) {
    linkedList.addNodeToStart(value);
    document.getElementById("nodeValue").value = "";
  }
}

function addNodeToEnd() {
  const value = document.getElementById("nodeValue").value;
  if (value) {
    linkedList.addNodeToEnd(value);
    document.getElementById("nodeValue").value = "";
  }
}

function deleteNodeFromStart() {
  linkedList.deleteNodeFromStart();
}

function deleteNodeFromEnd() {
  linkedList.deleteNodeFromEnd();
}

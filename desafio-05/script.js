// script.js
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
}

let taskLists = {
  "Lista Padrão": [],
};
let currentList = "Lista Padrão";

function saveTasks() {
  localStorage.setItem("taskLists", JSON.stringify(taskLists));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("taskLists"));
  if (savedTasks) {
    taskLists = savedTasks;
  }
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filteredTasks = taskLists[currentList].filter((task) =>
    task.title
      .toLowerCase()
      .includes(document.getElementById("searchInput").value.toLowerCase())
  );

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleTaskCompletion(task.id);

    const title = document.createElement("span");
    title.textContent = task.title;

    li.appendChild(checkbox);
    li.appendChild(title);

    taskList.appendChild(li);
  });
}

function toggleTaskInput() {
  const addTaskButton = document.getElementById("addTaskButton");
  const taskInputContainer = document.getElementById("taskInputContainer");
  const taskInput = document.getElementById("taskInput");

  if (taskInputContainer.style.display === "none") {
    taskInputContainer.style.display = "block";
    addTaskButton.style.display = "none";
    taskInput.focus();
  } else {
    taskInputContainer.style.display = "none";
    addTaskButton.style.display = "block";
  }
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskComplete = document.getElementById("taskComplete");
  const currentList = "Lista Padrão"; 
  const taskLists = {}; 

  if (taskInput.value.trim() === "") {
    alert("Por favor, insira uma tarefa.");
    return;
  }

  if (typeof currentList === "undefined") {
    alert("Nenhuma lista selecionada.");
    return;
  }

  if (!Array.isArray(taskLists[currentList])) {
    taskLists[currentList] = [];
  }

  if (taskLists[currentList].length >= 25) {
    alert("A lista já atingiu o limite de 25 itens.");
    return;
  }

  const task = {
    id: Date.now(),
    title: taskInput.value,
    completed: taskComplete.checked,
  };

  taskLists[currentList].push(task);

  const li = document.createElement("li");
  li.textContent = task.title;

  const checkboxContainer = document.createElement("label");
  checkboxContainer.className = "custom-checkbox";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.onchange = function () {
    if (checkbox.checked) {
      li.classList.add("strikethrough");
    } else {
      li.classList.remove("strikethrough");
    }
  };

  const checkmark = document.createElement("span");
  checkmark.className = "checkmark";

  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(checkmark);
  li.prepend(checkboxContainer);

  if (task.completed) {
    li.classList.add("strikethrough");
  }

  document.getElementById("taskList").appendChild(li);

  taskInput.value = "";
  taskComplete.checked = false;

  toggleTaskInput();
}

function toggleTaskCompletion(taskId) {
  const task = taskLists[currentList].find((task) => task.id === taskId);
  task.completed = !task.completed;
}

function changeList(listName) {
  currentList = listName;
  document.getElementById("currentListTitle").textContent = listName;

  const listItems = document.querySelectorAll(".sidebar-list ul li");
  listItems.forEach((li) => {
    li.classList.remove("active");
  });

  const selectedListItem = Array.from(listItems).find((li) =>
    li.textContent.includes(listName)
  );
  if (selectedListItem) {
    selectedListItem.classList.add("active");
  }

  renderTasks();
}

let listNameToDelete = "";

function addNewList() {
  document.getElementById("newListModal").style.display = "block";
  document.getElementById("errorMessage").style.display = "none"; 
}

function closeModal() {
  document.getElementById("newListModal").style.display = "none";
}

function createNewList() {
  const newListName = document.getElementById("newListName").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  if (newListName) {
    const ul = document.getElementById("taskLists");
    const existingLists = ul.getElementsByTagName("li");
    for (let i = 0; i < existingLists.length; i++) {
      if (
        existingLists[i].textContent.replace(/\s*\u00D7\s*$/, "") ===
        newListName
      ) {
        errorMessage.textContent = "Uma lista com esse nome já existe.";
        errorMessage.style.display = "block";
        return;
      }
    }

    const li = document.createElement("li");
    li.textContent = newListName;
    li.onclick = function () {
      changeList(newListName);
    };

    const trashIcon = document.createElement("i");
    trashIcon.className = "fas fa-trash trash-icon";
    trashIcon.onclick = function (event) {
      event.stopPropagation();
      openConfirmDeleteModal(newListName);
    };

    li.appendChild(trashIcon);
    ul.appendChild(li);
    closeModal();
  } else {
    errorMessage.textContent = "Por favor, insira um nome para a nova lista.";
    errorMessage.style.display = "block";
  }
}

function openConfirmDeleteModal(listName) {
  listNameToDelete = listName;
  document.getElementById("listNameToDelete").textContent = listName;
  document.getElementById("confirmDeleteModal").style.display = "block";
}

function closeConfirmDeleteModal() {
  document.getElementById("confirmDeleteModal").style.display = "none";
}

function confirmDelete() {
  const ul = document.getElementById("taskLists");
  const items = ul.getElementsByTagName("li");
  for (let i = 0; i < items.length; i++) {
    if (items[i].textContent.includes(listNameToDelete)) {
      ul.removeChild(items[i]);
      break;
    }
  }
  delete taskLists[listNameToDelete];
  if (currentList === listNameToDelete) {
    currentList = null;
    document.getElementById("currentListTitle").textContent = "";
    document.getElementById("taskList").innerHTML = "";
  }
  closeConfirmDeleteModal();
}

function clearTaskList() {
  taskLists[currentList] = [];
  saveTasks();
  renderTasks();
}

document.getElementById("searchInput").oninput = () => renderTasks();

document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

loadTasks();

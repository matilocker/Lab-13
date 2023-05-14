// Variables globales
let tasks = [];

// Función para cargar las tareas almacenadas en el localstorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

// Función para guardar las tareas en el localstorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Función para crear una nueva tarea
function createTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const task = {
            id: Date.now(),
            text: taskText,
            status: 'todo'
        };

        tasks.push(task);
        saveTasks();
        renderTasks();

        taskInput.value = '';
    }
}

// Función para renderizar las tareas en el tablero
function renderTasks() {
    const todoColumn = document.getElementById('todoColumn');
    const doingColumn = document.getElementById('doingColumn');
    const doneColumn = document.getElementById('doneColumn');

    // Limpiar las columnas antes de renderizar las tareas
    todoColumn.innerHTML = '';
    doingColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    // Iterar sobre las tareas y agregarlas a la columna correspondiente
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.id = task.id;
        taskElement.draggable = true;
        taskElement.addEventListener('dragstart', dragStart);

        taskElement.innerHTML = `
        <p class="name">${task.text}</p>
        <div class="buttons">
        <button class="blue" onclick="changeStatus(${task.id}, 'up')"></button>
        <button class="red" onclick="changeStatus(${task.id}, 'down')"></button>
        </div>
        <div class="buttonx">
        <button class="x" onclick="deleteTask(${task.id})">X</button>
        </div>
      `;

        switch (task.status) {
            case 'todo':
                todoColumn.appendChild(taskElement);
                break;
            case 'doing':
                doingColumn.appendChild(taskElement);
                break;
            case 'done':
                doneColumn.appendChild(taskElement);
                break;
        }
    });
}

// Función para cambiar el estado de una tarea
function changeStatus(taskId, direction) {
    const task = tasks.find(task => task.id === taskId);

    if (task) {
        switch (direction) {
            case 'up':
                if (task.status === 'todo') {
                    task.status = 'doing';
                } else if (task.status === 'doing') {
                    task.status = 'done';
                }
                break;
            case 'down':
                if (task.status === 'done') {
                    task.status = 'doing';
                } else if (task.status === 'doing') {
                    task.status = 'todo';
                }
                break;
        }

        saveTasks();
        renderTasks();
    }
}

// Función para eliminar una tarea
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Funciones para el arrastre de las tareas
function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function drop(event, status) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = tasks.find(task => task.id === parseInt(taskId));

    if (task) {
        task.status = status;
        saveTasks();
        renderTasks();
    }
}

// Cargar las tareas al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});


const taskformElement = document.querySelector('#newTaskForm');
const taskListElement = document.querySelector('#tasksList');
const empty = document.querySelector('#empty');
const usernameElement = document.querySelector('#username');

async function getUser() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    usernameElement.textContent = clientPrincipal.userDetails;
}

async function updateTask() {
    // TODO
}

taskformElement.addEventListener('submit', async (e) => {

    e.preventDefault();
    const newTaskInput = taskformElement.elements.new_task_input;

    // const response = await fetch('https://static-app-backend.azurewebsites.net/api/tasks?', {
    const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ label: newTaskInput.value })
    });
    const payload = await response.json();

    const task = generateTask(payload.task);

    taskListElement.appendChild(task);

    newTaskInput.value = '';
});

async function getTasks() {
    // const response = await fetch('https://static-app-backend.azurewebsites.net/api/tasks?');
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    console.log(tasks);

    if (tasks) {
        document.querySelector("#empty").remove();
        for (const task of tasks) {
            taskListElement.appendChild(generateTask(task))
        }
    }
}

function generateTask(task) {
    const tmpl = `
    <li class="task-item" id="${task._id}">
        <label>
            <input type="checkbox" ${task.status}>
            <p>${task.label}</p>
        </label>
    </li>
    `;
    const range = document.createRange();
    const fragment = range.createContextualFragment(tmpl);

    fragment.querySelector('input').addEventListener('change', updateTask);
    
    return fragment;
}

getUser();
getTasks();

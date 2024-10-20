// Hola a todos, aquí es donde tienen que trabajar
// Buena suerte 🫡
const baseURL = "https://wd1-todos-api.diurivj.workers.dev/api/Esme/";

async function loadTodos(filter = '') {
    const response = await fetch(`${baseURL}todos?filter=${filter}`, { 
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.todos;
}

async function createTodo(todo) {
    const response = await fetch(`${baseURL}todos`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo })
    });
    if (!response.ok) {
        throw new Error('kha pasaaa');
    }
    const data = await response.json();
    return data.todo;
}

async function updateTodo(todo, completed) {
    const response = await fetch(`${baseURL}todos`, { 
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: todo.id, completed })
    });
    const data = await response.json();
    replaceTodo(data.todo);
}

function generateTodo(todo) {
    const li = document.createElement('li');
    li.id = todo.id;
    li.className = `flex p-4 items-center gap-x-4 ${todo.completed ? 'line-through' : ''}`;

    const input = document.createElement('input');
    input.id = `${todo.id}-${todo.todo}`;
    input.className = 'w-5 h-5 cursor-pointer';
    input.type = 'checkbox';
    input.checked = todo.completed;
    input.onchange = e => updateTodo(todo, e.target.checked);

    const label = document.createElement('label');
    label.className = 'cursor-pointer w-full';
    label.htmlFor = `${todo.id}-${todo.todo}`;
    label.innerText = todo.todo;

    li.appendChild(input);
    li.appendChild(label);
    return li;
}

function appendTodo(todo) {
    const li = generateTodo(todo);
    todosContainer.appendChild(li);
}

async function renderTodos() {
    const todos = await loadTodos();
    todosContainer.innerHTML = ''; 
    todos.forEach(todo => appendTodo(todo));
}

function replaceTodo(todo) {
    const node = document.getElementById(todo.id);
    const newNode = generateTodo(todo);
    node.replaceWith(newNode);
}

function styleFilters() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
}


renderTodos();
styleFilters();

const createTodoInput = document.getElementById('createTodoInput');
createTodoInput.addEventListener('keydown', async e => {
    if (e.key === 'Enter' && createTodoInput.value.trim() !== '') {
        const todo = await createTodo(createTodoInput.value.trim());
        appendTodo(todo);
        createTodoInput.value = '';
    }
});

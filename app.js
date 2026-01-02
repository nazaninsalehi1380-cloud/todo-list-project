let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const stats = document.getElementById("stats");
const clearCompletedBtn = document.getElementById("clearCompleted");
const darkModeBtn = document.getElementById("darkModeBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

const saveTodos = () => {

  localStorage.setItem("todos", JSON.stringify(todos));
};

const renderTodos = () => {
  list.innerHTML = "";

  let filteredTodos = todos;


  if (currentFilter === "active") {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter(t => t.completed);
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement("li");
    li.classList.toggle("completed", todo.completed);

    const span = document.createElement("span");
    span.textContent = todo.text;

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.onclick = () => {
      todos = todos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      );
      saveTodos();
      renderTodos();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      todos = todos.filter(t => t.id !== todo.id);
      saveTodos();
      renderTodos();
    };

    li.append(span, doneBtn, deleteBtn);
    list.appendChild(li);
  });

  updateStats();
};

addBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;

  const newTodo = {
    id: Date.now(),
    text: input.value,
    completed: false
  };

  todos = [...todos, newTodo];
  input.value = "";
  saveTodos();
  renderTodos();
});


input.addEventListener("keypress", e => {
  if (e.key === "Enter") addBtn.click();
});

const updateStats = () => {
  const completed = todos.filter(t => t.completed).length;
  stats.textContent = `${completed}/${todos.length} completed `;
};

clearCompletedBtn.addEventListener("click", () => {

  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
});


filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

renderTodos();
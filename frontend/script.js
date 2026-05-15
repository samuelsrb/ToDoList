const API_URL = "http://localhost:3000/tasks";

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const tasksList = document.querySelector("#tasks-list");

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  tasksList.innerHTML = "";

  if (tasks.length === 0) {
    tasksList.innerHTML = "<p>Nenhuma tarefa cadastrada.</p>";
    return;
  }

  tasks.forEach((task) => {
    const taskCard = document.createElement("article");
    taskCard.className = "task-card";

    if (task.status === "completed") {
      taskCard.classList.add("completed");
    }

    taskCard.innerHTML = `
      <div>
        <h3>${task.title}</h3>

        <p>${task.description || "Sem descrição"}</p>

        <span class="status ${task.status}">
          ${task.status === "completed" ? "Concluída" : "Pendente"}
        </span>
      </div>

      <div class="task-actions">
        <button type="button" onclick="toggleStatus(${task.id}, '${task.status}')">
          ${task.status === "completed" ? "Desmarcar" : "Concluir"}
        </button>

        <button type="button" onclick="deleteTask(${task.id})">
          Excluir
        </button>
      </div>
    `;

    tasksList.appendChild(taskCard);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    alert("Informe o título da tarefa.");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      status: "pending",
    }),
  });

  titleInput.value = "";
  descriptionInput.value = "";

  await loadTasks();
});

async function toggleStatus(id, currentStatus) {
  const nextStatus = currentStatus === "completed" ? "pending" : "completed";

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: nextStatus,
    }),
  });

  await loadTasks();
}

async function deleteTask(id) {
  const confirmDelete = confirm("Deseja excluir esta tarefa?");

  if (!confirmDelete) return;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  await loadTasks();
}

loadTasks();
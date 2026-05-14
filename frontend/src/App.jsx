import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3333/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadTasks() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      setTitle("");
      setDescription("");

      loadTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  }

  async function toggleStatus(task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await fetch(`${API_URL}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      loadTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

  async function deleteTask(taskId) {
    const shouldDelete = window.confirm("Deseja excluir esta tarefa?");

    if (!shouldDelete) return;

    try {
      await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });

      loadTasks();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  }

  return (
    <div>
      <h1>To-Do List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit">Criar tarefa</button>
      </form>

      <p>{tasks.length} tarefa(s)</p>

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>

              {task.description && <p>{task.description}</p>}

              <div>
                <span>Status: {task.status}</span>

                <button onClick={() => toggleStatus(task)}>
                  {task.status === "completed"
                    ? "Marcar como pendente"
                    : "Concluir"}
                </button>

                <button onClick={() => deleteTask(task.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

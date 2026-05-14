import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3333/tasks";

const emptyForm = {
  title: "",
  description: "",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);

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

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    try {
      await fetch(editingTask ? `${API_URL}/${editingTask.id}` : API_URL, {
        method: editingTask ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setForm(emptyForm);
      setEditingTask(null);

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

  function startEditing(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
    });
  }

  return (
    <div>
      <h1>To-Do List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título da tarefa"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          placeholder="Descrição"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          {editingTask ? "Salvar edição" : "Criar tarefa"}
        </button>
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

                <button onClick={() => startEditing(task)}>Editar</button>

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

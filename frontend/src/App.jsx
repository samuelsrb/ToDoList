import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

const emptyForm = {
  title: "",
  description: "",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setTasks(response.data);
    } catch (error) {
      setError("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
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
      setSaving(true);
      setError("");

      if (editingTask) {
        await axios.patch(`${API_URL}/${editingTask.id}`, form);
      } else {
        await axios.post(API_URL, {
          ...form,
          status: "pending",
        });
      }

      setForm(emptyForm);
      setEditingTask(null);

      loadTasks();
    } catch (error) {
      setError("Erro ao salvar tarefa.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await axios.patch(`${API_URL}/${task.id}`, {
        status: nextStatus,
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
      await axios.delete(`${API_URL}/${taskId}`);

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

        <button type="submit" disabled={saving}>
          {saving
            ? "Salvando..."
            : editingTask
              ? "Salvar edição"
              : "Criar tarefa"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <p>{tasks.length} tarefa(s)</p>

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : tasks.length === 0 ? (
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

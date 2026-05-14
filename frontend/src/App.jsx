import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3333/tasks";

function App() {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div>
      <h1>To-Do List</h1>

      <p>{tasks.length} tarefa(s)</p>

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>

              {task.description && <p>{task.description}</p>}

              <span>Status: {task.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

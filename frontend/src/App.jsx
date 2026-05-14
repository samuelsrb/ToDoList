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
    </div>
  );
}

export default App;
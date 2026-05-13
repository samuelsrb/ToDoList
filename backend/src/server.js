const express = require("express");
const cors = require("cors");
require("./database");

const tasksRoutes = require("./routes/tasks");

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API de tarefas funcionando." });
});

app.use("/tasks", tasksRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor." });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

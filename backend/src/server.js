const express = require('express');

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de tarefas funcionando.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
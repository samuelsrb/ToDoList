# To-Do List API

Mini aplicação de gerenciamento de tarefas desenvolvida como teste prático.

## Tecnologias

### Backend
- Node.js
- Express
- SQLite

### Frontend
- HTML
- CSS
- JavaScript

---

## Funcionalidades

- Criar tarefas
- Listar tarefas
- Editar tarefas
- Concluir tarefas
- Excluir tarefas

---

## Como executar o projeto

### Backend

Entre na pasta backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Execute o servidor:

```bash
npm run dev
```

Servidor disponível em:

```txt
http://localhost:3000
```

---

### Frontend

Abra o arquivo:

```txt
frontend/index.html
```

Ou utilize a extensão Live Server do VSCode.

---

## Endpoints da API

### Listar tarefas

```http
GET /tasks
```

### Buscar tarefa por ID

```http
GET /tasks/:id
```

### Criar tarefa

```http
POST /tasks
```

Body:

```json
{
  "title": "Minha tarefa",
  "description": "Descrição da tarefa",
  "status": "pending"
}
```

### Atualizar tarefa

```http
PATCH /tasks/:id
```

### Excluir tarefa

```http
DELETE /tasks/:id
```

---

## Autor

Samuel Soares
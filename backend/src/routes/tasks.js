const express = require("express");
const db = require("../database");

const router = express.Router();

const allowedStatuses = ["pending", "completed"];

function isValidStatus(status) {
  return allowedStatuses.includes(status);
}

function getTaskById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM tasks WHERE id = ?", [id], (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

router.post("/", (req, res, next) => {
  const { title, description = null, status = "pending" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "O campo title é obrigatório." });
  }

  if (!isValidStatus(status)) {
    return res
      .status(400)
      .json({ error: "O campo status deve ser pending ou completed." });
  }

  const sql = `
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `;

  db.run(
    sql,
    [title.trim(), description, status],
    async function onInsert(error) {
      if (error) return next(error);

      try {
        const task = await getTaskById(this.lastID);
        return res.status(201).json(task);
      } catch (lookupError) {
        return next(lookupError);
      }
    },
  );
});

router.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM tasks ORDER BY created_at DESC, id DESC",
    [],
    (error, rows) => {
      if (error) return next(error);
      return res.json(rows);
    },
  );
});

router.get("/:id", (req, res, next) => {
  db.get("SELECT * FROM tasks WHERE id = ?", [req.params.id], (error, row) => {
    if (error) return next(error);

    if (!row) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    return res.json(row);
  });
});

async function updateTask(req, res, next) {
  const { title, description, status } = req.body;
  const fields = [];
  const values = [];

  if (title !== undefined) {
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ error: "O campo title não pode ser vazio." });
    }

    fields.push("title = ?");
    values.push(title.trim());
  }

  if (description !== undefined) {
    fields.push("description = ?");
    values.push(description);
  }

  if (status !== undefined) {
    if (!isValidStatus(status)) {
      return res
        .status(400)
        .json({ error: "O campo status deve ser pending ou completed." });
    }

    fields.push("status = ?");
    values.push(status);
  }

  if (fields.length === 0) {
    return res
      .status(400)
      .json({ error: "Informe ao menos um campo para atualizar." });
  }

  try {
    const existingTask = await getTaskById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(req.params.id);

    db.run(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values,
      async (error) => {
        if (error) return next(error);

        try {
          const updatedTask = await getTaskById(req.params.id);
          return res.json(updatedTask);
        } catch (lookupError) {
          return next(lookupError);
        }
      },
    );
  } catch (error) {
    return next(error);
  }
}

router.put("/:id", updateTask);
router.patch("/:id", updateTask);

router.delete("/:id", async (req, res, next) => {
  try {
    const existingTask = await getTaskById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], (error) => {
      if (error) return next(error);

      return res.status(204).send();
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

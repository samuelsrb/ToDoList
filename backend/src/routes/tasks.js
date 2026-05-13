const express = require("express");
const db = require("../database");

const router = express.Router();

const allowedStatuses = ["pending", "completed"];

function isValidStatus(status) {
  return allowedStatuses.includes(status);
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

  db.run(sql, [title.trim(), description, status], function (error) {
    if (error) return next(error);

    return res.status(201).json({
      id: this.lastID,
      title: title.trim(),
      description,
      status,
    });
  });
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

router.put("/:id", (req, res, next) => {
  const { title, description = null, status = "pending" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "O campo title é obrigatório." });
  }

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [title.trim(), description, status, req.params.id],
    function (error) {
      if (error) return next(error);

      if (this.changes === 0) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      return res.json({
        id: Number(req.params.id),
        title: title.trim(),
        description,
        status,
      });
    },
  );
});

router.delete("/:id", (req, res, next) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], function (error) {
    if (error) return next(error);

    if (this.changes === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    return res.status(204).send();
  });
});

module.exports = router;

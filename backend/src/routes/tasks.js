const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { title, description = null, status = 'pending' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'O campo title é obrigatório.' });
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

router.get('/', (req, res, next) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC, id DESC', [], (error, rows) => {
    if (error) return next(error);
    return res.json(rows);
  });
});

module.exports = router;
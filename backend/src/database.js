const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databasePath = path.resolve(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Erro ao conectar ao SQLite:', error.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
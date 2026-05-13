const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databasePath = path.resolve(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error('Erro ao conectar ao SQLite:', error.message);
    process.exit(1);
  }

  console.log('Banco SQLite conectado.');
});

module.exports = db;
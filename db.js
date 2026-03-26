const Database = require("better-sqlite3");
const db = new Database("database.sqlite");

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  age INTEGER,
  city TEXT
)
`).run();

module.exports = db;
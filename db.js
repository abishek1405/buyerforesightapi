const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite DB");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    age INTEGER,
    city TEXT
  )
`);

// 👉 SEED DATA
db.serialize(() => {
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
      console.log("Seeding initial data...");

      const stmt = db.prepare(
        "INSERT INTO users (name, email, age, city) VALUES (?, ?, ?, ?)"
      );

      const users = [
        ["Abishek", "abi@gmail.com", 23, "Chennai"],
        ["Ravi", "ravi@gmail.com", 25, "Bangalore"],
        ["Priya", "priya@gmail.com", 22, "Hyderabad"],
        ["Karthik", "karthik@gmail.com", 28, "Mumbai"]
      ];

      users.forEach(user => stmt.run(user));

      stmt.finalize();
    }
  });
});

module.exports = db;
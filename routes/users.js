const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/", (req, res) => {
  try {
    let query = "SELECT * FROM users";

    if (req.query.search) {
      query += ` WHERE name LIKE '%${req.query.search}%'`;
    }

    if (req.query.sort) {
      query += ` ORDER BY ${req.query.sort} ${req.query.order || "ASC"}`;
    }

    const users = db.prepare(query).all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", (req, res) => {
  try {
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/", (req, res) => {
  try {
    const { name, email, age, city } = req.body;

    const result = db
      .prepare(
        "INSERT INTO users (name, email, age, city) VALUES (?, ?, ?, ?)"
      )
      .run(name, email, age, city);

    res.json({
      id: result.lastInsertRowid,
      name,
      email,
      age,
      city,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", (req, res) => {
  try {
    const { name, email, age, city } = req.body;

    db.prepare(
      "UPDATE users SET name=?, email=?, age=?, city=? WHERE id=?"
    ).run(name, email, age, city, req.params.id);

    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM users WHERE id=?").run(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
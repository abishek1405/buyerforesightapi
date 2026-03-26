const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all users (search + sort)
router.get("/", (req, res) => {
  let query = "SELECT * FROM users";
  const params = [];

  if (req.query.search) {
    query += " WHERE name LIKE ?";
    params.push(`%${req.query.search}%`);
  }

  if (req.query.sort) {
    query += ` ORDER BY ${req.query.sort} ${req.query.order || "ASC"}`;
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// GET user by ID
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json(err);
    if (!row) return res.status(404).json({ message: "User not found" });

    res.json(row);
  });
});

// POST create user
router.post("/", (req, res) => {
  const { name, email, age, city } = req.body;

  db.run(
    "INSERT INTO users (name, email, age, city) VALUES (?, ?, ?, ?)",
    [name, email, age, city],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        name,
        email,
        age,
        city
      });
    }
  );
});

// PUT update user
router.put("/:id", (req, res) => {
  const { name, email, age, city } = req.body;

  db.run(
    "UPDATE users SET name=?, email=?, age=?, city=? WHERE id=?",
    [name, email, age, city, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ message: "User updated" });
    }
  );
});

// DELETE user
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json(err);

    res.json({ message: "User deleted" });
  });
});

module.exports = router;
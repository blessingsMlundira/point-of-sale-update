const db = require("../db/database");

/* GET ALL CATEGORIES */
exports.getCategories = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM categories ORDER BY id DESC").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET CATEGORY BY ID */
exports.getCategoryById = (req, res) => {
  const { id } = req.params;

  try {
    const category = db
      .prepare("SELECT * FROM categories WHERE id = ?")
      .get(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* CREATE CATEGORY */
exports.createCategory = (req, res) => {
  const { name, description } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Missing or invalid category name" });
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO categories (name, description) VALUES (?, ?)`
      )
      .run(name, description || null);

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "Category name already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE CATEGORY */
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Missing or invalid category name" });
  }

  try {
    const result = db
      .prepare(
        `UPDATE categories SET name = ?, description = ? WHERE id = ?`
      )
      .run(name, description || null, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ success: true, message: "Category updated" });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "Category name already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

/* DELETE CATEGORY */
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  try {
    const result = db
      .prepare("DELETE FROM categories WHERE id = ?")
      .run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

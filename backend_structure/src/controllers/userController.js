const db = require("../db/database");

/* GET ALL USERS */
exports.getUsers = (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM users ORDER BY id DESC").all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET USER BY ID */
exports.getUserById = (req, res) => {
  const { id } = req.params;

  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* CREATE USER */
exports.createUser = (req, res) => {
  const {
    employee_code,
    username,
    password_hash,
    first_name,
    last_name,
    email,
    phone,
    role,
    status,
  } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Missing or invalid username" });
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO users (employee_code, username, password_hash, first_name, last_name, email, phone, role, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        employee_code || null,
        username,
        password_hash || null,
        first_name || null,
        last_name || null,
        email || null,
        phone || null,
        role || null,
        status || "Active"
      );

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE USER */
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const {
    employee_code,
    username,
    password_hash,
    first_name,
    last_name,
    email,
    phone,
    role,
    status,
    last_login,
  } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Missing or invalid username" });
  }

  try {
    const result = db
      .prepare(
        `UPDATE users SET
          employee_code = ?,
          username = ?,
          password_hash = ?,
          first_name = ?,
          last_name = ?,
          email = ?,
          phone = ?,
          role = ?,
          status = ?,
          last_login = ?
        WHERE id = ?`
      )
      .run(
        employee_code || null,
        username,
        password_hash || null,
        first_name || null,
        last_name || null,
        email || null,
        phone || null,
        role || null,
        status || "Active",
        last_login || null,
        id
      );

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE USER */
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  try {
    const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

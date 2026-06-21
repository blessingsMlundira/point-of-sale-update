const db = require("../db/database");

exports.login = (req, res) => {
  const { employee_code, username } = req.body;

  if (!employee_code || !username) {
    return res.status(400).json({ error: "Employee code and username are required." });
  }

  try {
    const user = db
      .prepare(
        "SELECT id, employee_code, username, first_name, last_name, email, phone, role, status FROM users WHERE employee_code = ? AND username = ?"
      )
      .get(employee_code, username);

    if (!user) {
      return res.status(401).json({ error: "Invalid employee code or username." });
    }

    db.prepare("UPDATE users SET last_login = ? WHERE id = ?").run(new Date().toISOString(), user.id);

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const db = require("../db/database");

exports.getCustomers = (req, res) => {
  try {
    const customers = db.prepare("SELECT * FROM customers ORDER BY id DESC").all();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCustomer = (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Missing customer fields" });
  }

  try {
    const result = db
      .prepare(`INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`)
      .run(name, email, phone);

    res.json({ id: result.lastInsertRowid, name, email, phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
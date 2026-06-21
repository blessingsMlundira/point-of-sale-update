const db = require("../db/database");

exports.getSales = (req, res) => {
  try {
    const sales = db.prepare("SELECT * FROM sales ORDER BY id DESC").all();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSale = (req, res) => {
  const { invoice, items, total, status } = req.body;

  if (!invoice || !Array.isArray(items) || items.length === 0 || typeof total !== "number") {
    return res.status(400).json({ error: "Missing or invalid sale data" });
  }

  try {
    const insertSale = db.prepare(
      `INSERT INTO sales (invoice, total, status) VALUES (?, ?, ?)`
    );

    const insertItem = db.prepare(
      `INSERT INTO sale_items (saleId, name, qty, price, total) VALUES (?, ?, ?, ?, ?)`
    );

    const insertMany = (saleId, itemsList) => {
      const transaction = db.transaction((rows) => {
        for (const item of rows) {
          if (!item.name || typeof item.qty !== "number" || typeof item.price !== "number" || typeof item.total !== "number") {
            throw new Error("Invalid sale item payload");
          }
          insertItem.run(saleId, item.name, item.qty, item.price, item.total);
        }
      });
      transaction(itemsList);
    };

    const saleResult = insertSale.run(invoice, total, status || "pending");
    const saleId = saleResult.lastInsertRowid;

    insertMany(saleId, items);

    res.json({ message: "Sale saved successfully", saleId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
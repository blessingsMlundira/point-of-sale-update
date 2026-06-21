const db = require("../db/database");

exports.getDetailedSales = (req, res) => {
  try {
    const detailedSales = db.prepare("SELECT * FROM detailed_sales ORDER BY id DESC").all();
    res.json(detailedSales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDetailedSale = (req, res) => {
  const {
    id,
    sale_id,
    invoice_number,
    product_id,
    product_name,
    category,
    quantity,
    unit_price,
    line_total,
    subtotal,
    tax_amount,
    discount_amount,
    grand_total,
    payment_method,
    payment_reference,
    cashier_id,
    cashier_name,
    customer_id,
    customer_name,
    sale_date,
  } = req.body;

  if (
    typeof id !== "number" ||
    typeof sale_id !== "number" ||
    !invoice_number ||
    typeof product_id !== "number" ||
    !product_name ||
    typeof quantity !== "number" ||
    typeof unit_price !== "number" ||
    typeof line_total !== "number" ||
    typeof subtotal !== "number" ||
    typeof tax_amount !== "number" ||
    typeof grand_total !== "number" ||
    !payment_method ||
    !cashier_name ||
    typeof customer_id !== "number" ||
    !customer_name
  ) {
    return res.status(400).json({ error: "Missing or invalid detailed sale fields" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO detailed_sales (
        id,
        sale_id,
        invoice_number,
        product_id,
        product_name,
        category,
        quantity,
        unit_price,
        line_total,
        subtotal,
        tax_amount,
        discount_amount,
        grand_total,
        payment_method,
        payment_reference,
        cashier_id,
        cashier_name,
        customer_id,
        customer_name,
        sale_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      sale_id,
      invoice_number,
      product_id,
      product_name,
      category,
      quantity,
      unit_price,
      line_total,
      subtotal,
      tax_amount,
      discount_amount || 0,
      grand_total,
      payment_method,
      payment_reference,
      cashier_id,
      cashier_name,
      customer_id,
      customer_name,
      sale_date || new Date().toISOString()
    );

    res.status(201).json({ message: "Detailed sale record created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
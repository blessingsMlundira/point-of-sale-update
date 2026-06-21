const Database = require("better-sqlite3");

// create or open database file
const db = new Database("database_updated.sqlite");

// ==========================
// CREATE TABLES
// ==========================

// PRODUCTS
db.prepare(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  price REAL,
  stock INTEGER
)
`).run();

// SALES
db.prepare(`
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice TEXT,
  total REAL,
  status TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// SALE ITEMS
db.prepare(`
CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  saleId INTEGER,
  name TEXT,
  qty INTEGER,
  price REAL,
  total REAL
)
`).run();

// CATEGORIES
db.prepare(`
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  description TEXT
)
`).run();

// USERS
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  employee_code TEXT,
  username TEXT NOT NULL,
  password_hash TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  status TEXT DEFAULT 'Active',
  last_login TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

// CUSTOMERS
db.prepare(`
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  totalSpent REAL DEFAULT 0
)
`).run();

// DETAILED SALES
db.prepare(`
CREATE TABLE IF NOT EXISTS detailed_sales (
  id INTEGER PRIMARY KEY,
  sale_id INTEGER,
  invoice_number TEXT,
  product_id INTEGER,
  product_name TEXT,
  category TEXT,
  quantity INTEGER,
  unit_price REAL,
  line_total REAL,
  subtotal REAL,
  tax_amount REAL,
  discount_amount REAL DEFAULT 0,
  grand_total REAL,
  payment_method TEXT,
  payment_reference TEXT,
  cashier_id INTEGER,
  cashier_name TEXT,
  customer_id INTEGER,
  customer_name TEXT,
  sale_date TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

module.exports = db;
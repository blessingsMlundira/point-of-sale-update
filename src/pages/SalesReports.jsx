import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from "@mui/material";

import {
  PointOfSale,
  TrendingUp,
  ReceiptLong,
  ShoppingCart,
  Add
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

const printReceipt = (sale) => {
  const receiptWindow = window.open("", "_blank", "width=400,height=600");

  const itemsHtml = sale.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">$${item.price}</td>
        <td style="text-align:right">$${item.total}</td>
      </tr>
    `
    )
    .join("");

  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt ${sale.invoice}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          .receipt {
            max-width: 320px;
            margin: auto;
          }

          h2 {
            text-align: center;
            margin-bottom: 5px;
          }

          .meta {
            text-align: center;
            font-size: 12px;
            margin-bottom: 15px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th, td {
            padding: 6px 0;
            border-bottom: 1px dashed #ccc;
          }

          th {
            text-align: left;
          }

          .total {
            font-weight: bold;
            font-size: 14px;
            text-align: right;
            margin-top: 10px;
          }

          .footer {
            text-align: center;
            font-size: 11px;
            margin-top: 15px;
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <h2>POS RECEIPT</h2>
          <div class="meta">
            Invoice: ${sale.invoice}<br/>
            Date: ${new Date().toLocaleString()}
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align:center">Qty</th>
                <th style="text-align:right">Price</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total">
            Grand Total: $${sale.total}
          </div>

          <div class="footer">
            Thank you for your purchase!
          </div>
        </div>
      </body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();

  setTimeout(() => {
    receiptWindow.print();
    receiptWindow.close();
  }, 500);
};

/* -----------------------------
   PRODUCT CATALOG
------------------------------ */
const products = [
  { name: "Dell Laptop", price: 1200 },
  { name: "HP Printer", price: 300 },
  { name: "Scanner Pro", price: 180 },
  { name: "Wireless Keyboard", price: 40 },
  { name: "Mouse Logitech", price: 25 },
  { name: "Samsung Monitor", price: 350 }
];

/* -----------------------------
   CHART DATA
------------------------------ */
const salesTrend = [
  { day: "Mon", sales: 12000 },
  { day: "Tue", sales: 18000 },
  { day: "Wed", sales: 15000 },
  { day: "Thu", sales: 22000 },
  { day: "Fri", sales: 28000 },
  { day: "Sat", sales: 35000 },
  { day: "Sun", sales: 26000 }
];

const topProducts = [
  { name: "Dell Laptop", sales: 120 },
  { name: "HP Printer", sales: 80 },
  { name: "Scanner", sales: 65 },
  { name: "Keyboard", sales: 150 }
];

/* -----------------------------
   KPI CARD
------------------------------ */
const InfoCard = ({ icon, title, value, color }) => (
  <Card
    sx={{
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}22, #fff)`
    }}
  >
    <CardContent>
      <Box display="flex" gap={2} alignItems="center">
        <Box sx={{ color }}>{icon}</Box>
        <Box>
          <Typography fontSize={13} color="text.secondary">
            {title}
          </Typography>
          <Typography fontWeight="bold" variant="h6">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/* -----------------------------
   SALES PAGE
------------------------------ */
const Sales = () => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get("/products"),
          api.get("/sales")
        ]);

        setProducts(productsRes.data);
        setSales(salesRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

  /* -----------------------------
     FILTERED SEARCH RESULTS
  ------------------------------ */
  const filteredProducts = products.filter(
    (p) =>
      p.name &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* -----------------------------
     ADD TO CART
  ------------------------------ */
  const addToCart = () => {
    if (!selectedProduct) return;

    const item = {
      name: selectedProduct.name,
      qty: Number(qty),
      price: selectedProduct.price,
      total: selectedProduct.price * qty
    };

    setCart(prev => [...prev, item]);

    setSearch("");
    setSelectedProduct(null);
    setQty(1);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.total, 0);

  const generateInvoice = () =>
    "INV-" + Date.now().toString().slice(-6);

  const completeSale = async () => {
  if (cart.length === 0) return;

  const invoice = generateInvoice();

  const newSale = {
    invoice,
    items: cart,
    total: cartTotal,
    status: "Paid"
  };

  try {
    const response = await api.post("/sales", newSale);

    console.log("Sale saved:", response.data);

    await loadData();

    setCart([]);
    setOpen(false);

    printReceipt(newSale);

  } catch (error) {
    console.error("Failed to save sale:", error);
    alert("Failed to save sale.");
  }
};
if (loading) {
  return (
    <Box p={3}>
      <Typography>Loading POS Data...</Typography>
    </Box>
  );
}

  return (
    <Box>

      {/* HEADER */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          color: "#fff",
          background: "linear-gradient(135deg,#1976d2,#00c6ff)"
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Smart POS Sales System
        </Typography>
        <Typography sx={{ opacity: 0.9 }}>
          Type-to-search product selection (Dynamics-style)
        </Typography>
      </Box>

      {/* ACTION */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography fontWeight="bold" variant="h6">
          Sales Dashboard
        </Typography>

       
      </Box>

      {/* CHARTS */}
      <Grid container spacing={2} mb={3}>
        <Grid item >
          <Card>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>
                Weekly Sales Trend
              </Typography>

              <ResponsiveContainer width="100%" height={300} width={600}>
                <LineChart data={salesTrend}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="sales" stroke="#1976d2" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item >
          <Card>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>
                Top Products
              </Typography>

              <ResponsiveContainer height={300} width={600}>
                <BarChart data={topProducts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      

      
    </Box>
  );
};

export default Sales;
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
        <td style="text-align:right">K${item.price}</td>
        <td style="text-align:right">K${item.total}</td>
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

          <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:13px;">
            <span>Subtotal:</span>
            <span>K${sale.subtotal.toFixed(2)}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:5px; font-size:13px;">
            <span>VAT (16%):</span>
            <span>K${sale.vat.toFixed(2)}</span>
          </div>
          <div class="total">
            Grand Total: K${sale.total.toFixed(2)}
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
  const cartVat = Number((cartTotal * 0.16).toFixed(2));
  const totalWithVat = Number((cartTotal + cartVat).toFixed(2));

  const generateInvoice = () =>
    "INV-" + Date.now().toString().slice(-6);

  const completeSale = async () => {
  if (cart.length === 0) return;

  const invoice = generateInvoice();

  const newSale = {
    invoice,
    items: cart,
    subtotal: cartTotal,
    vat: cartVat,
    total: totalWithVat,
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

      {/* MAIN CONTENT AREA */}
      <Box
        sx={{
          position: "relative",
          mb: 3,
          minHeight: 260,
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "rgba(25, 118, 210, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3
        }}
      >
        <ShoppingCart
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: { xs: "14rem", md: "18rem" },
            color: "rgba(25, 118, 210, 0.08)",
            animation: "pulseBasket 10s ease-in-out infinite"
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Start a new sale
              </Typography>
              <Typography sx={{ opacity: 0.8, mt: 1 }}>
                Click below to begin processing a fresh transaction.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ zIndex: 2 }}
            >
              New Sale
            </Button>
          </Box>
        </Box>

        <Box
          component="style"
          children={`
            @keyframes pulseBasket {
              0%, 100% { transform: translate(-50%, -50%) scale(1); }
              50% { transform: translate(-50%, -50%) scale(1.03); }
            }
          `}
        />
      </Box>

     

      
      

      {/* ================= MODAL ================= */}
      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  fullWidth
  maxWidth="lg"
  PaperProps={{
    sx: {
      borderRadius: 4,
      height: "800px"
    }
  }}
>

  {/* HEADER */}
  <Box
    sx={{
      p: 3,
      color: "white",
      background:
        "linear-gradient(135deg, #1976d2, #42a5f5, #26c6da)"
    }}
  >
    <Typography variant="h5" fontWeight="bold">
      New POS Transaction
    </Typography>

    <Typography variant="body2" sx={{ opacity: 0.9 }}>
      Create and process a customer sale
    </Typography>
  </Box>

  <DialogContent sx={{ bgcolor: "#f8fafc" }}>
    <Stack spacing={3} mt={2}>

      {/* PRODUCT SEARCH SECTION */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 2
        }}
      >
        <Box p={5}>

         

          <TextField
          sx={{mt: 2, mb: 2}}
            label="Search Product here"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedProduct(null);
            }}
            fullWidth
          />

          {/* SUGGESTIONS */}
          {search && !selectedProduct && (
            <Card
              sx={{
                mt: 2,
                maxHeight: 200,
                overflowY: "auto",
                borderRadius: 1,
                bgcolor: "#fafafa"
              }}
            >
              {filteredProducts.map((p, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    transition: "0.2s",
                    "&:hover": {
                      background: "#e3f2fd"
                    }
                  }}
                  onClick={() => {
                    setSelectedProduct(p);
                    setSearch(p.name);
                  }}
                >
                  <Typography fontWeight="600">
                    {p.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="primary"
                  >
                    K{p.price}
                  </Typography>
                </Box>
              ))}
            </Card>
          )}
        </Box>
      </Card>

      {/* PRODUCT DETAILS */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Price"
            value={selectedProduct ? selectedProduct.price : ""}
            fullWidth
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Quantity"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="large"
        onClick={addToCart}
        sx={{
          borderRadius: 3,
          py: 1.5
        }}
      >
        Add To Cart
      </Button>

      {/* CART SECTION */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2
        }}
      >
        <Box p={6}>

          <Typography

            sx={{margin: 3}}
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Shopping Cart
          </Typography>

          {cart.length === 0 ? (
            <Typography sx={{margin: 3}} color="text.secondary">
              No items added yet
            </Typography>
          ) : (
            <Stack spacing={1}>
              {cart.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography fontWeight="600">
                      {item.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Qty: {item.qty}
                    </Typography>
                  </Box>

                  <Typography
                    fontWeight="bold"
                    color="primary"
                  >
                    K{item.total}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}

        </Box>
      </Card>

      {/* TOTAL CARD */}
      <Card
        sx={{
          borderRadius: 1,
          background:
            "linear-gradient(135deg, #43a047, #66bb6a)",
          color: "white"
        }}
      >
        <Box
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{margin: 2}} variant="h6">
            Total Amount
          </Typography>

          <Stack spacing={1} sx={{ width: "100%" }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                Subtotal
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                K{cartTotal.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                VAT (16%)
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.8)">
                K{cartVat.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ pt: 1, borderTop: "1px solid rgba(255,255,255,0.25)" }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                K{totalWithVat.toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Card>

    </Stack>
  </DialogContent>

  <DialogActions
    sx={{
      p: 3,
      bgcolor: "#fafafa"
    }}
  >
    <Button
      onClick={() => setOpen(false)}
      size="large"
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      size="large"
      onClick={completeSale}
      sx={{
        px: 4,
        borderRadius: 2
      }}
    >
      Complete Sale
    </Button>
  </DialogActions>

</Dialog>

    </Box>
  );
};

export default Sales;
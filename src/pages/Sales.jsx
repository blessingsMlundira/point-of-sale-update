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
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide
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

          .logo {
            display: block;
            margin: 0 auto 10px auto;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            object-fit: cover;
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <img src="/logo.jpeg" class="logo" />
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
  const [barcode, setBarcode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountGiven, setAmountGiven] = useState("");
  const [changeDue, setChangeDue] = useState(0);

  useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get("/products"),
          api.get("/sales")
        ]);

        const loadedProducts = productsRes.data.map((product) => ({
          ...product,
          sku: product.sku || `PRD-${product.id?.toString().padStart(3, "0")}`,
          barcode: product.barcode || ""
        }));

        setProducts(loadedProducts);
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
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      category: selectedProduct.category || "",
      qty: Number(qty),
      price: selectedProduct.price,
      total: selectedProduct.price * Number(qty)
    };

    setCart((prev) => [...prev, item]);

    setSearch("");
    setSelectedProduct(null);
    setQty(1);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.total, 0);
  const cartVat = Number((cartTotal * 0.16).toFixed(2));
  const totalWithVat = Number((cartTotal + cartVat).toFixed(2));

  const generateInvoice = () =>
    "INV-" + Date.now().toString().slice(-6);

  const handleAmountGivenChange = (value) => {
    const numericValue = Number(value);
    setAmountGiven(value);
    if (!isNaN(numericValue)) {
      setChangeDue(Math.max(0, numericValue - totalWithVat));
    } else {
      setChangeDue(0);
    }
  };

  const findProductByBarcode = () => {
    const trimmed = barcode.trim();
    if (!trimmed) return;

    const matched = products.find(
      (product) =>
        product.barcode === trimmed ||
        product.sku === trimmed ||
        product.id?.toString() === trimmed ||
        product.name?.toLowerCase() === trimmed.toLowerCase()
    );

    if (matched) {
      setSelectedProduct(matched);
      setSearch(matched.name);
    } else {
      alert("No product found for this barcode/SKU.");
    }
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      alert("Please add items to the cart before completing the sale.");
      return;
    }

    if (paymentMethod === "cash") {
      const numericAmountGiven = Number(amountGiven);
      if (isNaN(numericAmountGiven) || numericAmountGiven < totalWithVat) {
        alert("Please enter an amount given that covers the total for cash payments.");
        return;
      }
    }

    const invoice = generateInvoice();

    const newSale = {
      invoice,
      items: cart,
      subtotal: cartTotal,
      vat: cartVat,
      total: totalWithVat,
      paymentMethod,
      amountGiven: Number(amountGiven) || 0,
      changeDue,
      status: "Paid"
    };

    try {
      const response = await api.post("/sales", newSale);
      const saleId = response.data?.saleId;

      if (!saleId) {
        throw new Error("Sale created but no saleId returned from backend.");
      }

      const inventoryUpdates = cart.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) {
          return Promise.resolve();
        }

        const updatedStock = (product.stock || 0) - item.qty;
        return api.put(`/products/${item.product_id}`, {
          ...product,
          stock: updatedStock
        });
      });

      await Promise.all(inventoryUpdates);
      await loadData();

      setCart([]);
      setOpen(false);
      setPaymentMethod("cash");
      setAmountGiven("");
      setChangeDue(0);

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
          AfriCore POS Sales System
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

     

      
      

      {/* ================= SUPERMARKET POS INTERFACE ================= */}
      {open && (
        <Card sx={{ borderRadius: 3, boxShadow: 4, mb: 3, bgcolor: "#fff" }}>
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              bgcolor: "linear-gradient(135deg, #1976d2, #42a5f5)",
              color: "white",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Point of Sale - POS System
            </Typography>
            <Button
              onClick={() => setOpen(false)}
              sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
            >
              Close
            </Button>
          </Box>

          <Grid container sx={{ height: "auto", minHeight: "600px" }}>
            {/* LEFT PANEL - PRODUCT INPUT */}
            <Grid item xs={12} md={6} sx={{ p: 1, borderRight: "1px solid #e0e0e0", overflowY: "auto", maxHeight: "600px" }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    label="Barcode / SKU"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        findProductByBarcode();
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "12px",
                        py: 0.5
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={findProductByBarcode}
                    sx={{ whiteSpace: "nowrap", py: 1.75, px: 2.5 }}
                  >
                    Scan
                  </Button>
                </Box>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="bold">
                  Product Search
                </Typography>

                {/* SEARCH INPUT */}
                <TextField
                  label="Search Product"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedProduct(null);
                  }}
                  fullWidth
                  variant="outlined"
                  autoFocus
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "16px",
                      py: 1.5
                    }
                  }}
                />

                

                {/* PRODUCT SUGGESTIONS */}
                {search && !selectedProduct && (
                  <Card sx={{ maxHeight: 300, overflowY: "auto", boxShadow: 1 }}>
                    {filteredProducts.map((p, i) => (
                      <Box
                        key={i}
                        onClick={() => {
                          setSelectedProduct(p);
                          setSearch(p.name);
                        }}
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: "#e3f2fd",
                            transform: "translateX(4px)"
                          }
                        }}
                      >
                        <Typography fontWeight="600" fontSize="16px">
                          {p.name}
                        </Typography>
                        <Typography color="primary" fontWeight="bold" fontSize="18px">
                          K{p.price}
                        </Typography>
                      </Box>
                    ))}
                  </Card>
                )}

                {/* SELECTED PRODUCT DETAILS */}
                <Slide in={Boolean(selectedProduct)} direction="up" mountOnEnter unmountOnExit timeout={350}>
                  <Box>
                    {selectedProduct && (
                      <Card sx={{ p: 2.5, bgcolor: "#f5f5f5" }}>
                        <Typography fontWeight="bold" fontSize="18px" mb={1}>
                          {selectedProduct.name}
                        </Typography>
                        <Typography fontSize="24px" fontWeight="bold" color="primary" mb={2}>
                          K{selectedProduct.price}
                        </Typography>

                        {/* QUANTITY CONTROLS */}
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Quantity
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={() => setQty(Math.max(1, Number(qty) - 1))}
                            sx={{ minWidth: "50px", fontSize: "18px" }}
                          >
                            −
                          </Button>
                          <TextField
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            sx={{ flex: 1, "& input": { textAlign: "center", fontSize: "18px" } }}
                          />
                          <Button
                            variant="outlined"
                            onClick={() => setQty(Number(qty) + 1)}
                            sx={{ minWidth: "50px", fontSize: "18px" }}
                          >
                            +
                          </Button>
                        </Box>

                        <Button
                          variant="contained"
                          size="large"
                          onClick={addToCart}
                          fullWidth
                          sx={{ py: 2, fontSize: "16px", fontWeight: "bold" }}
                        >
                          Add to Cart
                        </Button>
                      </Card>
                    )}
                  </Box>
                </Slide>
              </Stack>
            </Grid>

            {/* RIGHT PANEL - CART & PAYMENT */}
            <Grid item xs={12} md={6} sx={{ p: 3, display: "flex", flexDirection: "column" }}>
              <Stack spacing={2} sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Shopping Cart
                </Typography>

                {/* CART ITEMS */}
                <Card sx={{ flex: 1, overflowY: "auto", maxHeight: "350px", p: 2 }}>
                  {cart.length === 0 ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <Typography color="text.secondary" fontSize="18px">
                        No items yet
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1}>
                      {cart.map((item, i) => (
                        <Box
                          key={i}
                          sx={{
                            p: 1.5,
                            bgcolor: "#f9f9f9",
                            borderRadius: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderLeft: "4px solid #1976d2"
                          }}
                        >
                          <Box flex={1}>
                            <Typography fontWeight="600" fontSize="14px">
                              {item.name}
                            </Typography>
                            <Typography fontSize="12px" color="text.secondary">
                              {item.qty}x @ K{item.price}
                            </Typography>
                          </Box>
                          <Typography fontWeight="bold" fontSize="16px" color="primary">
                            K{item.total.toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Card>

                {/* TOTALS SECTION */}
                <Card sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Subtotal:</Typography>
                      <Typography fontWeight="bold">K{cartTotal.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>VAT (16%):</Typography>
                      <Typography fontWeight="bold">K{cartVat.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ pt: 1, borderTop: "2px solid #ddd" }}>
                      <Typography variant="h6" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        K{totalWithVat.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                {/* PAYMENT SECTION */}
                <Typography variant="h6" fontWeight="bold">
                  Payment
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Mode of Payment</InputLabel>
                      <Select
                        label="Mode of Payment"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        sx={{ fontSize: "16px" }}
                      >
                        <MenuItem value="cash">💵 Cash</MenuItem>
                        <MenuItem value="card">💳 Card</MenuItem>
                        <MenuItem value="mobile_money">📱 Mobile Money</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Amount Given"
                      type="number"
                      value={amountGiven}
                      onChange={(e) => handleAmountGivenChange(e.target.value)}
                      fullWidth
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{ "& .MuiOutlinedInput-root": { fontSize: "16px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Change Due"
                      value={`K${changeDue.toFixed(2)}`}
                      fullWidth
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": { fontSize: "16px", bgcolor: "#e8f5e9" },
                        "& .MuiOutlinedInput-input": { fontWeight: "bold", color: "#2e7d32" }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* ACTION BUTTONS */}
                <Box sx={{ display: "flex", gap: 1.5, pt: 2 }}>
                  <Button
                    onClick={() => setOpen(false)}
                    variant="outlined"
                    fullWidth
                    sx={{ py: 1.5, fontSize: "16px", fontWeight: "bold" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={completeSale}
                    sx={{
                      py: 1.5,
                      fontSize: "16px",
                      fontWeight: "bold",
                      bgcolor: "#43a047",
                      "&:hover": { bgcolor: "#388e3c" }
                    }}
                  >
                    Complete Sale
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      )}

    </Box>
  );
};

export default Sales;
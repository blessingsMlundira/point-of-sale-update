
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box
} from "@mui/material";

import api from "../../services/api";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/sales");
        const sales = response.data || [];

        const sortedSales = sales
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.date || b.sale_date || "").getTime() -
              new Date(a.createdAt || a.date || a.sale_date || "").getTime()
          )
          .slice(0, 5)
          .map((sale) => ({
            id: sale.id ?? sale.invoice,
            invoice: sale.invoice || `INV${sale.id}`,
            status: sale.status || "Unknown",
            amount: Number(sale.total || 0)
          }));

        const totalAll = sales.reduce((acc, s) => acc + Number(s.total || 0), 0);
        setGrandTotal(totalAll);
        setTransactions(sortedSales);
      } catch (error) {
        console.error("Failed to load recent transactions:", error);
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, []);

  const totalAmount = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

  return (
    <Card>
      <CardContent>
        

        <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
    p: 2,
    borderRadius: 3,
    bgcolor: "#f8fafc",
    border: "1px solid #eef2f7",
  }}
>
  {/* Left side */}
  <Box>
    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        fontWeight: 500,
      }}
    >
      Showing latest 5 transactions
    </Typography>

    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        display: "block",
        mt: 0.5,
      }}
    >
      Total (all):{" "}
      <Box component="span" sx={{ fontWeight: 700, color: "#111827" }}>
        k{grandTotal.toLocaleString()}
      </Box>
    </Typography>
  </Box>

  {/* Right side (highlighted total) */}
  <Box
    sx={{
      textAlign: "right",
      px: 2,
      py: 1,
      borderRadius: 2,
      bgcolor: "#e8f5e9",
      border: "1px solid #c8e6c9",
      minWidth: 140,
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "#2e7d32",
        fontWeight: 600,
        display: "block",
      }}
    >
      Total (shown)
    </Typography>

    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 800,
        color: "#1b5e20",
        lineHeight: 1.2,
      }}
    >
      k{totalAmount.toLocaleString()}
    </Typography>
  </Box>
</Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.invoice}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell align="right">k{tx.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;

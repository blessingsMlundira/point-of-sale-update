import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";

import StatCard from "../common/StatCard";
import api from "../../services/api";

const KPISection = () => {
  const [salesToday, setSalesToday] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [inventoryItems, setInventoryItems] = useState(0);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const [salesRes, customersRes, productsRes] = await Promise.all([
          api.get("/sales"),
          api.get("/customers"),
          api.get("/products")
        ]);

        const sales = salesRes.data || [];
        const today = new Date();
        const totalToday = sales.reduce((acc, sale) => {
          const saleDate = new Date(sale.createdAt || sale.date || sale.sale_date || "");
          if (Number.isNaN(saleDate.getTime())) return acc;
          return saleDate.toDateString() === today.toDateString()
            ? acc + Number(sale.total || 0)
            : acc;
        }, 0);

        setSalesToday(totalToday);
        setCustomers((customersRes.data || []).length);
        setInventoryItems((productsRes.data || []).length);
      } catch (error) {
        console.error("Failed to load KPI data:", error);
      }
    };

    fetchKpis();
  }, []);

  const formatCurrency = (value) => `k${Number(value).toLocaleString()}`;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StatCard
          title="Sales Today"
          value={formatCurrency(salesToday)}
          icon={<AttachMoneyIcon />}
        />
      </Grid>

      

      <Grid item xs={12} md={4}>
        <StatCard
          title="Inventory Items"
          value={inventoryItems.toLocaleString()}
          icon={<InventoryIcon />}
        />
      </Grid>
    </Grid>
  );
};

export default KPISection;

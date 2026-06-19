import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Payroll from "./pages/Payroll";
import SalesHistory from "./pages/SalesHistory";
import SalesReports from "./pages/SalesReports";
import InventoryReports from "./pages/InventoryReports";
import InventoryList from "./pages/InventoryList";
import Users from "./pages/Users";


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Sales Module */}
          <Route path="/sales" element={<Sales />} />

          {/* Inventory Module */}
          <Route path="/inventory" element={<Inventory />} />

          {/* CRM / Customers */}
          <Route path="/customers" element={<Customers />} />

          {/* HR / Payroll */}
          <Route path="/payroll" element={<Payroll />} />

          {/* Sales History */}
          <Route path="/sales-history" element={<SalesHistory />} />

          {/* Sales Reports */}
          <Route path="/sales-reports" element={<SalesReports />} />

          {/* Inventory Reports */}
          <Route path="/inventory-reports" element={<InventoryReports />} />  

          {/* Inventory List */}
          <Route path="/inventory-list" element={<InventoryList />} /> 

          {/* Users */}
          <Route path="/users" element={<Users />} /> 

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
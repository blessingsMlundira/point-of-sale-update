import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Dashboard,
  PointOfSale,
  Inventory,
  MenuOpen,
  Menu,
  ReceiptLong,
  Assessment,
  Logout
} from "@mui/icons-material";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";

const drawerWidth = 250;
const collapsedWidth = 72;

const Sidebar = ({ open = true, onToggle }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("posUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = user?.role === "Admin";

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Sales", icon: <PointOfSale />, path: "/sales" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Inventory Reports", icon: <Assessment />, path: "/inventory-reports" },
    { text: "Sales History", icon: <ReceiptLong />, path: "/sales-history"},
    { text: "Sales Reports", icon: <Assessment />, path: "/sales-reports"},
    { text: "Inventory List", icon: <Inventory />, path: "/inventory-list" },
    ...(isAdmin ? [{ text: "Users", icon: <Dashboard />, path: "/users" }] : []),
  ];

  const toggleDrawer = () => {
    if (onToggle) onToggle();
  };

  const handleLogout = () => {
    localStorage.removeItem("posUser");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          transition: "width 0.3s ease"
        }
      }}
    >
      {/* Header / Toggle Section */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "space-between" : "center",
          alignItems: "center",
          px: 1
        }}
      >
        {open && (
          <Typography variant="subtitle1" fontWeight="bold">
            POS System
          </Typography>
        )}

        <IconButton onClick={toggleDrawer}>
          {open ? <MenuOpen /> : <Menu />}
        </IconButton>
      </Toolbar>

      <Divider />

      {/* Menu Items */}
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              component={NavLink}
              to={item.path}
              end={item.path === "/"}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: 2,
                py: 1.5,
                '&.active': {
                  bgcolor: 'action.selected'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  justifyContent: "center"
                }}
              >
                {item.icon}
              </ListItemIcon>

              {open && (
                <ListItemText primary={item.text} />
              )}
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              justifyContent: open ? "initial" : "center",
              px: 2,
              py: 1.5
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 0,
                justifyContent: "center"
              }}
            >
              <Logout />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CloudDoneIcon from "@mui/icons-material/CloudDone";
import LogoutIcon from "@mui/icons-material/Logout";

const Topbar = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("posUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("posUser");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CloudDoneIcon color="success" />
          <Typography>Connected</Typography>
          <Typography sx={{ fontWeight: 600 }}>{username}</Typography>
          <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
          <IconButton onClick={handleLogout} color="inherit" size="large">
            <LogoutIcon />
          </IconButton>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
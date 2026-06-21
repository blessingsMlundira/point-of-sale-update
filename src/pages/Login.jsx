import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert
} from "@mui/material";

import { PointOfSale } from "@mui/icons-material";

const Login = () => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!employeeCode.trim() || !username.trim()) {
      setError("Employee code and username are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        employee_code: employeeCode.trim(),
        username: username.trim()
      });

      const user = response.data?.user;

      if (!user) {
        throw new Error("Invalid login response from server.");
      }

      localStorage.setItem("posUser", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >
      {/* CURVED GRADIENT HEADER */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50vh",
          background:
            "linear-gradient(135deg, #1976d2 0%, #00c6ff 50%, #42a5f5 100%)",
          borderBottomLeftRadius: "50% 15%",
          borderBottomRightRadius: "50% 15%",
          zIndex: 0
        }}
      />

      {/* DECORATIVE CIRCLES */}
      <Box
        sx={{
          position: "absolute",
          top: 60,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.12)",
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 140,
          right: -50,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.12)",
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(25,118,210,.08), rgba(0,198,255,.08))",
          zIndex: 0
        }}
      />

      {/* LOGIN CARD */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 6,
          overflow: "hidden",
          zIndex: 2,
          backdropFilter: "blur(18px)",
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* LOGO SECTION */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#1976d2,#00c6ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 10px 25px rgba(25,118,210,0.35)"
              }}
            >
              <PointOfSale
                sx={{
                  fontSize: 46,
                  color: "#fff"
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background:
                  "linear-gradient(135deg,#1976d2,#00c6ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Smart POS
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 2, mb: 4 }}
            >
              Retail & Inventory Management System
            </Typography>
          </Box>

          {/* LOGIN FORM */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <TextField
                label="Employee Code"
                value={employeeCode}
                onChange={(e) =>
                  setEmployeeCode(e.target.value)
                }
                fullWidth
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3
                  }
                }}
              />

              <TextField
                label="Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3
                  }
                }}
              />

              <Button
                type="submit"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.7,
                  mt: 1,
                  borderRadius: 3,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg,#1976d2,#00c6ff)",
                  boxShadow:
                    "0 10px 25px rgba(25,118,210,0.35)",
                  transition: "all .3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 15px 35px rgba(25,118,210,0.45)"
                  }
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;


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
      {/* BACKGROUND HEADER */}
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

      {/* DECORATIVE ELEMENTS */}
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

      {/* LOGIN CARD */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 6,
          overflow: "visible",
          position: "relative",
          zIndex: 2,
          backdropFilter: "blur(18px)",
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
        }}
      >
        {/* FLOATING LOGO */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 95,
            height: 95,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            border: "4px solid white",
            zIndex: 3,
            overflow: "hidden"
          }}
        >
          <Box
            component="img"
            src="/logo.jpeg"
            alt="Logo"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </Box>

        <CardContent  sx={{
            p: 5,
            pt: 7,
            display: "flex",
            flexDirection: "column",
            minHeight: 280 // gives room for true centering
          }}>
          {/* TITLE */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            <Box>
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Powered by AfriCore ERP
              </Typography>
            </Box>
            </Box>

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Employee Code"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                fullWidth
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 3 }
                }}
              />

              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 3 }
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
import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

import {
  ManageAccounts,
  Group,
  AdminPanelSettings,
  PersonAdd,
  Add
} from "@mui/icons-material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

/* -----------------------------
   USER DATA
------------------------------ */

const userSummary = {
  totalUsers: 84,
  activeUsers: 68,
  administrators: 8,
  newUsers: 12
};

const userActivity = [
  { month: "Jan", users: 52 },
  { month: "Feb", users: 58 },
  { month: "Mar", users: 63 },
  { month: "Apr", users: 69 },
  { month: "May", users: 74 },
  { month: "Jun", users: 84 }
];

const roleOptions = [
  "Administrator",
  "Cashier",
  "Inventory Officer",
  "Manager",
  "HR",
  "Other"
];

const statusOptions = ["Active", "Inactive"];

/* -----------------------------
   KPI CARD
------------------------------ */

const InfoTile = ({ icon, title, value, color }) => (
  <Card
    sx={{
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}22, #ffffff)`,
      boxShadow: "0px 3px 10px rgba(0,0,0,0.08)"
    }}
  >
    <CardContent>
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ color }}>{icon}</Box>

        <Box>
          <Typography fontSize={13} color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/* -----------------------------
   USER MANAGEMENT PAGE
------------------------------ */

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formUser, setFormUser] = useState({
    employee_code: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "Cashier",
    status: "Active"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/users");
      const payload = response.data?.data || response.data || [];
      setUsers(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFormUser = () => {
    setSelectedUser(null);
    setFormUser({
      employee_code: "",
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "Cashier",
      status: "Active"
    });
  };

  const openAddDialog = () => {
    resetFormUser();
    setAddOpen(true);
  };

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormUser({
      employee_code: user.employee_code || "",
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Cashier",
      status: user.status || "Active"
    });
    setEditOpen(true);
  };

  const closeDialog = () => {
    setAddOpen(false);
    setEditOpen(false);
    resetFormUser();
  };

  const handleFormChange = (field) => (event) => {
    setFormUser((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const createUser = async () => {
    try {
      await api.post("/users", formUser);
      closeDialog();
      loadUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user.");
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/users/${selectedUser.id}`, formUser);
      closeDialog();
      loadUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/users/${userId}`);
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const administrators = users.filter((user) => /admin/i.test(user.role)).length;
  const newUsers = users.filter((user) => {
    const createdAt = user.created_at || user.createdAt;
    if (!createdAt) return false;
    const created = new Date(createdAt).getTime();
    return created >= Date.now() - 30 * 24 * 60 * 60 * 1000;
  }).length;

  const roleDistribution = Object.entries(
    users.reduce((acc, user) => {
      const name = user.role || "Other";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>

      {/* HERO BANNER */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          color: "white",
          background:
            "linear-gradient(135deg, #6a11cb, #2575fc)"
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              User Management
            </Typography>

            <Typography sx={{ opacity: 0.9 }}>
              Microsoft Dynamics POS Security & Access Control
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
            sx={{
              bgcolor: "white",
              color: "#2575fc",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#f5f5f5"
              }
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* KPI SECTION */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={3}>
          <InfoTile
            icon={<Group fontSize="large" />}
            title="Total Users"
            value={totalUsers}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <InfoTile
            icon={<ManageAccounts fontSize="large" />}
            title="Active Users"
            value={activeUsers}
            color="#4caf50"
          />
        </Grid>

        <Grid item>
          <InfoTile
            icon={<AdminPanelSettings fontSize="large" />}
            title="Administrators"
            value={administrators}
            color="#ff9800"
          />
        </Grid>

        <Grid item>
          <InfoTile
            icon={<PersonAdd fontSize="large" />}
            title="New Users"
            value={newUsers}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* ANALYTICS */}
      <Grid container spacing={3} mb={4}>

        {/* USER GROWTH */}
        <Grid item >
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                User Growth Trend
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <BarChart data={userActivity}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="users"
                    fill="#1976d2"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

        {/* ROLE DISTRIBUTION */}
        <Grid item >
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                User Roles
              </Typography>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    <Cell fill="#1976d2" />
                    <Cell fill="#4caf50" />
                    <Cell fill="#ff9800" />
                    <Cell fill="#9c27b0" />
                    <Cell fill="#e91e63" />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* USERS TABLE */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            System Users
          </Typography>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Employee Code</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.employee_code}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{`${user.first_name || ""} ${user.last_name || ""}`.trim()}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === "Active" ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openEditDialog(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>

        </CardContent>
      </Card>

      <Dialog open={addOpen || editOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Employee Code"
              value={formUser.employee_code}
              onChange={handleFormChange("employee_code")}
              fullWidth
            />
            <TextField
              label="Username"
              value={formUser.username}
              onChange={handleFormChange("username")}
              fullWidth
            />
            <TextField
              label="First Name"
              value={formUser.first_name}
              onChange={handleFormChange("first_name")}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={formUser.last_name}
              onChange={handleFormChange("last_name")}
              fullWidth
            />
            <TextField
              label="Email"
              value={formUser.email}
              onChange={handleFormChange("email")}
              fullWidth
            />
            <TextField
              label="Phone"
              value={formUser.phone}
              onChange={handleFormChange("phone")}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                value={formUser.role}
                onChange={handleFormChange("role")}
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={formUser.status}
                onChange={handleFormChange("status")}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={selectedUser ? updateUser : createUser}
          >
            {selectedUser ? "Save Changes" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Users;
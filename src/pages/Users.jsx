import React from "react";

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
  TableRow
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

const roleDistribution = [
  { name: "Cashiers", value: 35 },
  { name: "Managers", value: 18 },
  { name: "Inventory", value: 15 },
  { name: "Admins", value: 8 },
  { name: "HR", value: 8 }
];

const userActivity = [
  { month: "Jan", users: 52 },
  { month: "Feb", users: 58 },
  { month: "Mar", users: 63 },
  { month: "Apr", users: 69 },
  { month: "May", users: 74 },
  { month: "Jun", users: 84 }
];

const users = [
  {
    id: "USR-001",
    name: "John Banda",
    role: "Administrator",
    department: "IT",
    status: "Active"
  },
  {
    id: "USR-002",
    name: "Mary Phiri",
    role: "Cashier",
    department: "Sales",
    status: "Active"
  },
  {
    id: "USR-003",
    name: "Peter Chirwa",
    role: "Inventory Officer",
    department: "Warehouse",
    status: "Inactive"
  },
  {
    id: "USR-004",
    name: "Agnes Mwale",
    role: "Manager",
    department: "Operations",
    status: "Active"
  }
];

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
            value={userSummary.totalUsers}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <InfoTile
            icon={<ManageAccounts fontSize="large" />}
            title="Active Users"
            value={userSummary.activeUsers}
            color="#4caf50"
          />
        </Grid>

        <Grid item >
          <InfoTile
            icon={<AdminPanelSettings fontSize="large" />}
            title="Administrators"
            value={userSummary.administrators}
            color="#ff9800"
          />
        </Grid>

        <Grid item >
          <InfoTile
            icon={<PersonAdd fontSize="large" />}
            title="New Users"
            value={userSummary.newUsers}
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
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {users.map((user) => (
                <TableRow key={user.id}>

                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={
                        user.status === "Active"
                          ? "success"
                          : "error"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                    >
                      Edit
                    </Button>
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </Box>
  );
};

export default Users;
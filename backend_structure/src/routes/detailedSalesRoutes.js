const express = require("express");
const router = express.Router();
const {
  getDetailedSales,
  createDetailedSale
} = require("../controllers/detailedSalesController");

router.get("/", getDetailedSales);
router.post("/", createDetailedSale);

module.exports = router;

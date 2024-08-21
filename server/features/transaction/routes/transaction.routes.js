// transaction.routes.js

import express from "express";
const router = express.Router();
import {
  getTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} from "../controller/transaction.controller.js";

router.get("/transactions", getTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChart);
router.get("/pie-chart", getPieChart);
router.get("/combined-data", getCombinedData);

export default router;

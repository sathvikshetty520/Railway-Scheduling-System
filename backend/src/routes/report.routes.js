const express = require('express');
const router = express.Router();
const {
  trainsPerStation,
  ticketsPerTrain,
  stationsBySchedule,
  trainsByDelayCount,
  longestDelays,
  totalRevenue,
  revenuePerTrain,
  dashboardSummary,
} = require('../controllers/report.controller');

router.get('/dashboard-summary', dashboardSummary);
router.get('/trains-per-station', trainsPerStation);
router.get('/tickets-per-train', ticketsPerTrain);
router.get('/stations-by-schedule', stationsBySchedule);
router.get('/trains-by-delay-count', trainsByDelayCount);
router.get('/longest-delays', longestDelays);
router.get('/total-revenue', totalRevenue);
router.get('/revenue-per-train', revenuePerTrain);

module.exports = router;
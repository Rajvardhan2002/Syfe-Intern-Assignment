const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");
const reportsController = require("../controllers/reports.controller");

// Route to render the reports page
router.get("/", isAuth, reportsController.getReportsPage);

// Route to get monthly report
router.get("/monthly/:month/:year", isAuth, reportsController.getMonthlyReport);

// Route to get yearly report
router.get("/yearly/:year", isAuth, reportsController.getYearlyReport);

module.exports = router;

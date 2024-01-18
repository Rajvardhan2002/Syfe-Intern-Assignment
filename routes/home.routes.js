const express = require("express");
const homeController = require("../controllers/home.controller");

const router = express.Router();

//shows account description of users
router.get("/details", homeController.getDetails);

///////renders complete transaction history
router.get("/all-transactions-history", homeController.getViewTransactions);

/////renders search filter and chart
router.post("/show-charts", homeController.getChartData);

module.exports = router;

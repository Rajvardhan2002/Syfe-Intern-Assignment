const express = require("express");
const homeController = require("../controllers/home.controller");

const router = express.Router();

//shows account description of users
router.get("/details", homeController.getDetails); 

///shows prediction form
router.get("/predictTransactions",homeController.getPrediction);

//////past transactions of user
router.get("/detail-transactions" , homeController.getTransactions);


module.exports = router;
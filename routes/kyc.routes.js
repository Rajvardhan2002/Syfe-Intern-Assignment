const express = require("express");
const kycController = require("../controllers/kyc.controller");

const router = express.Router();

//shows all account with same phone number
router.get("/all-accounts", kycController.getAccountWithSameNumber);

module.exports = router;

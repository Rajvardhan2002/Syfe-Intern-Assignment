const express = require("express");
const mlModelController = require("../controllers/ml_model.controllers");

const router = express.Router();

router.get("/detect-fraud-sms", mlModelController.getNLP);

router.post("/detect-fraud-sms", mlModelController.submitNLP);

module.exports = router;

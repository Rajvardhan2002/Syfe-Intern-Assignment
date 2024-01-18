const express = require("express");
const mlModelController = require("../controllers/ml_model.controllers");

const router = express.Router();

router.get("/detect-fraud-sms", mlModelController.getNLP);

router.post("/detect-fraud-sms", mlModelController.submitNLP);

//////shows prediction form
router.get("/predict-fraud", mlModelController.getPredictionForm);

/////handle prediction form submission
router.post("/predict-fraud", mlModelController.submitPredictForm);

module.exports = router;

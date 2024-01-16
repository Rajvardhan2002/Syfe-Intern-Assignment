const express = require("express");
const apiController = require("../controllers/api.controller");


const router = express.Router();

router.post("/fraud",apiController.fraudSMSDectection);

module.exports = router;
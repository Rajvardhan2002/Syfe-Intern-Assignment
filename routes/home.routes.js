const express = require("express");
const homeController = require("../controllers/home.controller");

const router = express.Router();

//shows account description of users
router.get("/details", homeController.getDetails);

module.exports = router;

const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");
const incomeController = require("../controllers/income.controller");

router.get("/", isAuth, incomeController.getIncomePage);
router.post("/", isAuth, incomeController.addOrUpdateIncome);
router.post("/:id/delete", isAuth, incomeController.deleteIncome);

module.exports = router;

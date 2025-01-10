const express = require("express");
const router = express.Router();
const savingGoalsController = require("../controllers/savingsGoals.controller");
const isAuth = require("../middlewares/is-auth");

router.get("/", isAuth, savingGoalsController.getSavingsGoals);
router.get("/add", isAuth, savingGoalsController.renderAddSavingsGoalPage);
router.post("/add", isAuth, savingGoalsController.createSavingsGoal);
router.get(
  "/edit/:id",
  isAuth,
  savingGoalsController.renderEditSavingsGoalPage
);
router.post("/edit/:id", isAuth, savingGoalsController.updateSavingsGoal);
router.post("/:id/delete", isAuth, savingGoalsController.deleteSavingsGoal);
router.get(
  "/goals-for-month",
  isAuth,
  savingGoalsController.renderGoalsForSelectedMonth
);

module.exports = router;

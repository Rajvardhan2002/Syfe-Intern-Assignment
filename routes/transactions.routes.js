const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactions.controller");
const isAuth = require("../middlewares/is-auth");

// Get all transactions categorized by user
router.get("/", isAuth, transactionController.getTransactions);

// Render add new transaction page
router.get("/add", isAuth, transactionController.renderAddTransactionPage);

// Add a new transaction
router.post("/add", isAuth, transactionController.addTransaction);

// Render transaction detail view
router.get("/:id", isAuth, transactionController.renderTransactionDetail);

// Update a transaction
router.post("/:id/update", isAuth, transactionController.updateTransaction);

// Delete a transaction
router.post("/:id/delete", isAuth, transactionController.deleteTransaction);

// Render the edit transaction page
router.get(
  "/:id/edit",
  isAuth,
  transactionController.renderEditTransactionPage
);

module.exports = router;

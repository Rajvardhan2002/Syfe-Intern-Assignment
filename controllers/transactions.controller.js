const Transaction = require("../models/transactions.model");
const Category = require("../models/category.model");
const { ObjectId } = require("mongodb");

// Get all transactions
async function getTransactions(req, res, next) {
  const userId = req.session.uid;

  try {
    const categories = await Category.getAllByUser(userId);
    const categorizedTransactions = {};

    for (const category of categories) {
      const transactions = await Transaction.getAllByUser(userId, category._id);
      categorizedTransactions[category.name] = transactions;
    }

    res.render("transactions/home", {
      categories,
      categorizedTransactions,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
}

// Render the page to add a new transaction
function renderAddTransactionPage(req, res, next) {
  const userId = req.session.uid;

  Category.getAllByUser(userId)
    .then((categories) => {
      res.render("transactions/add-new-transaction", {
        categories,
        csrfToken: req.csrfToken(),
      });
    })
    .catch(next);
}

// Add a new transaction
async function addTransaction(req, res, next) {
  const { amount, date, categoryId, description } = req.body;
  const userId = req.session.uid;

  if (!amount || !date || !categoryId) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    const transaction = new Transaction(
      parseFloat(amount),
      date,
      categoryId,
      description,
      userId
    );

    await transaction.save();
    res.redirect("/transactions");
  } catch (error) {
    next(error);
  }
}

// Render the detailed view of a specific transaction
async function renderTransactionDetail(req, res, next) {
  const { id } = req.params;
  const userId = req.session.uid;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .render("shared/404", { message: "Invalid transaction ID." });
  }

  try {
    const transaction = await Transaction.getById(id);

    if (!transaction || transaction.user_id.toString() !== userId) {
      return res
        .status(404)
        .render("shared/404", { message: "Transaction not found." });
    }

    const category = await Category.getById(transaction.category_id);

    res.render("transactions/transaction-detail", {
      transaction,
      category_name: category ? category.name : "Uncategorized",
    });
  } catch (error) {
    next(error);
  }
}

// Update a transaction
async function updateTransaction(req, res, next) {
  const { id } = req.params;
  const { amount, date, categoryId, description } = req.body;

  if (!amount || !date || !categoryId) {
    return res.status(400).render("transactions/edit-transaction", {
      error: "Required fields are missing.",
      transaction: req.body,
      categories: await Category.getAllByUser(req.session.uid),
      csrfToken: req.csrfToken(),
    });
  }

  try {
    const updated = await Transaction.updateById(id, {
      amount: parseFloat(amount),
      date: new Date(date),
      category_id: new ObjectId(categoryId),
      description,
    });

    if (!updated) {
      return res
        .status(404)
        .render("shared/404", { message: "Transaction not found." });
    }

    res.redirect("/transactions");
  } catch (error) {
    next(error);
  }
}

// Render the page to edit an existing transaction
async function renderEditTransactionPage(req, res, next) {
  const { id } = req.params;
  const userId = req.session.uid;

  if (!ObjectId.isValid(id)) {
    return res
      .status(400)
      .render("shared/404", { message: "Invalid transaction ID." });
  }

  try {
    const transaction = await Transaction.getById(id);

    if (!transaction || transaction.user_id.toString() !== userId) {
      return res
        .status(404)
        .render("shared/404", { message: "Transaction not found." });
    }

    const categories = await Category.getAllByUser(userId);

    res.render("transactions/edit-transaction", {
      transaction,
      categories,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
}

// Delete a transaction
async function deleteTransaction(req, res, next) {
  const { id } = req.params;

  try {
    const success = await Transaction.deleteById(id);

    if (!success) {
      return res
        .status(404)
        .render("shared/404", { message: "Transaction not found." });
    }

    res.redirect("/transactions");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTransactions,
  renderAddTransactionPage,
  addTransaction,
  renderTransactionDetail,
  updateTransaction,
  deleteTransaction,
  renderEditTransactionPage,
};

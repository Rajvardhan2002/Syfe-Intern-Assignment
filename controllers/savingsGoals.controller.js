const SavingsGoal = require("../models/savingsGoal.model");
const Transaction = require("../models/transactions.model");
const Income = require("../models/income.model");

async function getSavingsGoals(req, res, next) {
  const userId = req.session.uid;
  let { month, year } = req.query;

  // Default values for month and year if not provided
  month = month || 1; // Default to January
  year = year || 2025; // Default year

  try {
    // Calculate start and end date for the selected month and year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const goals = await SavingsGoal.getAllByUser(userId);

    // Fetch monthly income
    let monthlyIncomeRecord = await Income.getIncomeByMonthAndYear(
      userId,
      parseInt(month),
      year
    );

    // Default income if not available
    monthlyIncomeRecord = monthlyIncomeRecord || { amount: 1000 };
    const monthlyIncome = monthlyIncomeRecord.amount;

    // Fetch all transactions for the user within the selected month and year
    const transactions = await Transaction.getAllByUser(userId);
    const filteredTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });

    const totalExpenses = filteredTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    let netSavings = monthlyIncome - totalExpenses;

    // Filter goals for the given month and sort by target date (earliest first)
    const filteredGoals = goals
      .filter((goal) => {
        const targetDate = new Date(goal.targetDate);
        return targetDate >= startDate && targetDate <= endDate;
      })
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

    // Allocate savings to goals based on priority
    for (const goal of filteredGoals) {
      if (netSavings <= 0) {
        goal.progress = 0; // No funds left for this goal
      } else if (netSavings >= goal.targetAmount) {
        goal.progress = 100; // Fully funded
        netSavings -= goal.targetAmount; // Deduct full goal amount from savings
      } else {
        goal.progress = ((netSavings / goal.targetAmount) * 100).toFixed(2); // Partially funded
        netSavings = 0; // All savings allocated
      }

      await SavingsGoal.updateProgress(goal._id, goal.progress);
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[month - 1];

    res.render("savingGoals/goals-dashboard", {
      goals: filteredGoals,
      month,
      year,
      monthlyIncome,
      monthName,
    });
  } catch (error) {
    next(error);
  }
}

function renderAddSavingsGoalPage(req, res, next) {
  res.render("savingGoals/add-goal", { error: null });
}

async function createSavingsGoal(req, res, next) {
  const { name, targetAmount, targetDate } = req.body;
  const userId = req.session.uid;

  if (!name || !targetAmount || !targetDate) {
    return res
      .status(400)
      .render("savingGoals/add-goal", { error: "All fields are required." });
  }

  try {
    const goal = new SavingsGoal(
      name,
      parseFloat(targetAmount),
      new Date(targetDate),
      userId
    );
    await goal.save();
    res.redirect("/savingGoals");
  } catch (error) {
    next(error);
  }
}

async function renderEditSavingsGoalPage(req, res, next) {
  const { id } = req.params;
  try {
    const goal = await SavingsGoal.getById(id);
    if (!goal) {
      return res
        .status(404)
        .render("shared/404", { message: "Goal not found." });
    }
    res.render("savingGoals/edit-goal", { goal });
  } catch (error) {
    next(error);
  }
}

async function updateSavingsGoal(req, res, next) {
  const { id } = req.params;
  const { name, targetAmount, targetDate } = req.body;

  try {
    const existingGoal = await SavingsGoal.getById(id);

    if (!existingGoal) {
      return res
        .status(404)
        .render("shared/404", { message: "Goal not found." });
    }

    const updatedData = {
      name,
      targetAmount: parseFloat(targetAmount),
      targetDate,
    };

    const isIdentical =
      existingGoal.name === updatedData.name &&
      existingGoal.targetAmount === updatedData.targetAmount &&
      new Date(existingGoal.targetDate).toISOString() ===
        new Date(updatedData.targetDate).toISOString();

    if (isIdentical) {
      return res.redirect("/savingGoals");
    }

    const success = await SavingsGoal.updateById(id, updatedData);
    if (!success) {
      return res
        .status(404)
        .render("shared/404", { message: "Goal not found." });
    }

    res.redirect("/savingGoals");
  } catch (error) {
    next(error);
  }
}

async function deleteSavingsGoal(req, res, next) {
  const { id } = req.params;
  try {
    const success = await SavingsGoal.deleteById(id);
    if (!success) {
      return res
        .status(404)
        .render("shared/404", { message: "Goal not found." });
    }
    res.redirect("/savingGoals");
  } catch (error) {
    next(error);
  }
}

async function renderGoalsForSelectedMonth(req, res, next) {
  const userId = req.session.uid;
  let { month, year } = req.query;

  month = month || 1;
  year = year || 2025;

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const goals = await SavingsGoal.getAllByUser(userId);
    const filteredGoals = goals.filter((goal) => {
      const targetDate = new Date(goal.targetDate);
      return targetDate >= startDate && targetDate <= endDate;
    });

    let monthlyIncomeRecord = await Income.getIncomeByMonthAndYear(
      userId,
      parseInt(month),
      year
    );
    monthlyIncomeRecord = monthlyIncomeRecord || { amount: 1000 };
    const monthlyIncome = monthlyIncomeRecord.amount;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[month - 1];

    res.render("savingGoals/goals-for-month", {
      goals: filteredGoals,
      month,
      year,
      monthlyIncome,
      monthName,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSavingsGoals,
  renderAddSavingsGoalPage,
  createSavingsGoal,
  renderEditSavingsGoalPage,
  updateSavingsGoal,
  deleteSavingsGoal,
  renderGoalsForSelectedMonth,
};

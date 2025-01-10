const Transaction = require("../models/transactions.model");
const Income = require("../models/income.model");

async function getTransactionsTotal(userId, month, year) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await Transaction.getAllByMonthAndYear(
      userId,
      month,
      year
    );

    if (!transactions || transactions.length === 0) {
      return 0;
    }

    const total = transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    return total;
  } catch (error) {
    throw new Error("Error fetching transactions for report");
  }
}

async function getIncomeTotal(userId, month, year) {
  try {
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

    const monthString =
      typeof month === "number" ? monthNames[month - 1] : month;

    const income = await Income.getIncomeByMonthAndYear(
      userId,
      monthString,
      year
    );

    if (!income || !income.amount) {
      return 1000;
    }

    return income.amount;
  } catch (error) {
    throw new Error("Error fetching income for report");
  }
}

async function getReportsPage(req, res, next) {
  res.render("report/reports", {
    csrfToken: req.csrfToken(),
  });
}

async function getMonthlyReport(req, res, next) {
  const userId = req.session.uid;
  const { month, year } = req.params;

  const normalizedMonth = parseInt(month);
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
  const monthString = monthNames[normalizedMonth - 1];

  try {
    const incomeTotal = await getIncomeTotal(userId, normalizedMonth, year);
    const transactionsTotal = await getTransactionsTotal(
      userId,
      normalizedMonth,
      year
    );

    const report = {
      income: incomeTotal,
      transactions: transactionsTotal,
      balance: incomeTotal - transactionsTotal,
    };

    res.render("report/monthly-report", {
      report,
      month: monthString,
      year,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
}

async function getYearlyReport(req, res, next) {
  const userId = req.session.uid;
  const { year } = req.params;

  try {
    const months = [
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

    const incomeData = [];
    const expensesData = [];
    const balanceData = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const incomeTotal = await getIncomeTotal(userId, monthIndex + 1, year);
      const transactionsTotal = await getTransactionsTotal(
        userId,
        monthIndex + 1,
        year
      );

      incomeData.push(incomeTotal);
      expensesData.push(transactionsTotal);
      balanceData.push(incomeTotal - transactionsTotal);
    }

    res.render("report/yearly-report", {
      months,
      incomeData,
      expensesData,
      balanceData,
      year,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReportsPage,
  getMonthlyReport,
  getYearlyReport,
};

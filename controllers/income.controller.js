const Income = require("../models/income.model");

async function getIncomePage(req, res, next) {
  const userId = req.session.uid;

  try {
    const allIncomes = await Income.getAllByUser(userId);

    const monthsOrder = [
      "December",
      "November",
      "October",
      "September",
      "August",
      "July",
      "June",
      "May",
      "April",
      "March",
      "February",
      "January",
    ];

    const groupedByYear = allIncomes.reduce((acc, income) => {
      acc[income.year] = acc[income.year] || [];
      acc[income.year].push(income);
      return acc;
    }, {});

    const sortedIncomes = Object.entries(groupedByYear)
      .sort(([yearA], [yearB]) => yearB - yearA)
      .flatMap(([year, yearIncomes]) =>
        yearIncomes.sort(
          (a, b) => monthsOrder.indexOf(b.month) - monthsOrder.indexOf(a.month)
        )
      );

    res.render("income/income-page", {
      allIncomes: sortedIncomes,
      error: null,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrUpdateIncome(req, res, next) {
  const userId = req.session.uid;
  const { month, year, amount } = req.body;

  if (!month || !year || !amount) {
    return res.status(400).render("income/income-page", {
      allIncomes: [],
      error: "All fields are required.",
    });
  }

  try {
    const income = new Income(userId, month, year, parseFloat(amount));
    await income.save();
    res.redirect("/income");
  } catch (error) {
    next(error);
  }
}

async function deleteIncome(req, res, next) {
  const { id } = req.params;

  try {
    const success = await Income.deleteById(id);

    if (!success) {
      return res
        .status(404)
        .render("shared/404", { message: "Income record not found." });
    }

    res.redirect("/income");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getIncomePage,
  addOrUpdateIncome,
  deleteIncome,
};

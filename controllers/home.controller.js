const Transactions = require("../models/transactions.model");

///renders home page of the user
async function getDetails(req, res, next) {
  const transactions = new Transactions(req.session.uid);
  try {
    const receivedData = await transactions.getUser();
    const tableArray = await transactions.arrayOfPrevTransactions();
    // console.log(tableArray);
    res.render("index/details", { user: receivedData, tableArray: tableArray });
  } catch (error) {
    next(error);
    return;
  }
}

////renders complete transaction history
async function getViewTransactions(req, res, next) {
  const transactions = new Transactions(req.session.uid);
  try {
    const tableArray = await transactions.arrayOfPrevTransactions();

    // const labelcategory = tableArray.map();

    const lineChartData = {
      labels: ["January", "Feburary", "March", "April", "May"],
      datasets: [
        {
          label: "Amount",
          data: [10500, 12130, 6895, 10000, 8500],
          borderColor: "rgb(54, 162, 235)",
          fill: false,
        },
      ],
    };
    const pieChartData = {
      labels: [
        "Clothing",
        "Food",
        "Others",
        "Entertainment",
        "Utilities",
        "Groceroies",
        "dining",
      ],
      datasets: [
        {
          data: [2500, 2000, 1000, 800, 1200, 1500, 2500],
          backgroundColor: [
            "rgb(218,247,166)",
            "rgb(255, 195, 0)",
            "rgb(255, 87, 51 )",
            "rgb(199, 0, 57)",
            "rgb(144, 12, 63 )",
            "rgb(76, 139, 245)",
            "rgb(169,125,245)",
          ],
          hoverOffset: 7,
        },
      ],
    };
    res.render("index/transactions", {
      tableArray: tableArray,
      lineChartData: lineChartData,
      pieChartData: pieChartData,
    });
  } catch (error) {
    return next(error);
  }
}

async function getChartData(req, res, next) {
  const transactions = new Transactions(req.session.uid);
  const tableArray = await transactions.arrayOfPrevTransactions();
  const lineChartData = {
    labels: ["January", "Feburary", "March", "April", "May"],
    datasets: [
      {
        label: "Amount",
        data: [10500, 12130, 6895, 10000, 8500],
        borderColor: "rgb(54, 162, 235)",
        fill: false,
      },
    ],
  };
  const pieChartData = {
    labels: ["Clothes", "Food", "Others"],
    datasets: [
      {
        data: [2500, 2000, 1000],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  res.render("index/transactions", {
    lineChartData: lineChartData,
    pieChartData: pieChartData,
    tableArray: tableArray,
  });
}

module.exports = {
  getDetails: getDetails,
  getViewTransactions: getViewTransactions,
  getChartData: getChartData,
};

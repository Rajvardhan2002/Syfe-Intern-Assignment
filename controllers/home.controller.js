async function getDetails(req, res) {
  const receivedData = req.query;
  // console.log("Received data:", receivedData);
  res.render("index/details", { user: receivedData });
}

/////shows prediction form
function getPrediction(req, res) {
  res.render("index/predictForm");
}

function getTransactions(req, res) {
  res.render("index/transaction");
}
module.exports = {
  getPrediction: getPrediction,
  getDetails: getDetails,
  getTransactions: getTransactions,
};

const mongodb = require("mongodb");
const db = require("../data/database");
const ObjectId = mongodb.ObjectId;

async function getDetails(req, res) {
  const receivedData = await db
    .getDb()
    .collection("users")
    .findOne({ _id: new ObjectId(req.session.uid) });
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

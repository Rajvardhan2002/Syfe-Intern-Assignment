const mongodb = require("mongodb");
const db = require("../data/database");
const ObjectId = mongodb.ObjectId;

async function getDetails(req, res, next) {
  try {
    const receivedData = await db
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(req.session.uid) });
    const tableArray = await db
      .getDb()
      .collection("userTransactions")
      .find({ userID: req.session.uid })
      .sort({ dateSort: -1 })
      .toArray();

    console.log(tableArray);
    res.render("index/details", { user: receivedData, tableArray: tableArray });
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  getDetails: getDetails,
};

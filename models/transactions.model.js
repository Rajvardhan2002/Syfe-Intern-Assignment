const mongodb = require("mongodb");
const db = require("../data/database");
const ObjectId = mongodb.ObjectId;

class Transactions {
  constructor(userId) {
    this.userId = userId;
  }
  async getUser() {
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(this.userId) });
    return user;
  }
  async arrayOfPrevTransactions() {
    const tableArray = await db
      .getDb()
      .collection("userTransactions")
      .find({ userID: this.userId })
      .sort({ dateSort: -1 })
      .toArray();
    return tableArray;
  }
}

module.exports = Transactions;

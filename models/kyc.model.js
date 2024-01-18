const mongodb = require("mongodb");
const db = require("../data/database");
const ObjectId = mongodb.ObjectId;

class KYC {
  constructor(userID) {
    this.userID = userID;
  }
  async getUserID() {
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(this.userID) });
    return user;
  }
  async getAccountWithPhoneNumber(phoneNum) {
    const accounts = await db
      .getDb()
      .collection("kyc")
      .find({ MobileNumber: phoneNum })
      .toArray();
    return accounts;
  }
}
module.exports = KYC;

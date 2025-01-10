const { ObjectId } = require("mongodb");
const db = require("../data/database");

class SavingsGoal {
  constructor(name, targetAmount, targetDate, userId) {
    this.name = name;
    this.targetAmount = targetAmount;
    this.targetDate = new Date(targetDate);
    this.userId = new ObjectId(userId);
    this.progress = 0;
  }

  async save() {
    const result = await db.getDb().collection("savingsGoals").insertOne({
      name: this.name,
      targetAmount: this.targetAmount,
      targetDate: this.targetDate,
      userId: this.userId,
      progress: this.progress,
    });
    return result.insertedId;
  }

  static async getAllByUser(userId) {
    return db
      .getDb()
      .collection("savingsGoals")
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  static async getById(goalId) {
    return db
      .getDb()
      .collection("savingsGoals")
      .findOne({ _id: new ObjectId(goalId) });
  }

  static async updateById(goalId, updatedData) {
    const result = await db
      .getDb()
      .collection("savingsGoals")
      .updateOne({ _id: new ObjectId(goalId) }, { $set: updatedData });
    return result.modifiedCount > 0;
  }

  static async deleteById(goalId) {
    const result = await db
      .getDb()
      .collection("savingsGoals")
      .deleteOne({ _id: new ObjectId(goalId) });
    return result.deletedCount > 0;
  }

  static async updateProgress(goalId, progress) {
    return db
      .getDb()
      .collection("savingsGoals")
      .updateOne({ _id: new ObjectId(goalId) }, { $set: { progress } });
  }

  static async getGoalsForMonth(userId, month, year) {
    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0); // End of the month (last day of the month)

    return db
      .getDb()
      .collection("savingsGoals")
      .find({
        userId: new ObjectId(userId),
        targetDate: { $gte: startDate, $lte: endDate },
      })
      .toArray();
  }
}

module.exports = SavingsGoal;

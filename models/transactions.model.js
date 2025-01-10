const db = require("../data/database");
const { ObjectId } = require("mongodb");

class Transaction {
  constructor(amount, date, categoryId, description, userId) {
    this.amount = amount;
    this.date = new Date(date);
    // Ensure categoryId is an ObjectId
    this.categoryId =
      categoryId instanceof ObjectId ? categoryId : new ObjectId(categoryId);
    this.description = description || "";
    this.userId = userId;
  }

  // Save a new transaction to the database
  async save() {
    try {
      const result = await db.getDb().collection("transactions").insertOne({
        amount: this.amount,
        date: this.date,
        category_id: this.categoryId,
        description: this.description,
        user_id: this.userId,
      });
      return result;
    } catch (error) {
      throw new Error("Error saving transaction to the database");
    }
  }

  // Get all transactions for a specific user, optionally filtered by category
  static async getAllByUser(userId, categoryId = null) {
    const filter = { user_id: userId };

    if (categoryId) {
      // Ensure categoryId is treated as an ObjectId
      filter.category_id =
        categoryId instanceof ObjectId ? categoryId : new ObjectId(categoryId);
    }

    try {
      return await db
        .getDb()
        .collection("transactions")
        .find(filter)
        .sort({ date: -1 }) // Sort by date in descending order
        .toArray();
    } catch (error) {
      throw new Error("Error retrieving transactions");
    }
  }

  // Get a specific transaction by ID
  static async getById(transactionId) {
    try {
      return await db
        .getDb()
        .collection("transactions")
        .findOne({ _id: new ObjectId(transactionId) });
    } catch (error) {
      throw new Error("Error retrieving transaction");
    }
  }

  // Update a transaction
  static async updateById(transactionId, updatedData) {
    try {
      const result = await db
        .getDb()
        .collection("transactions")
        .updateOne({ _id: new ObjectId(transactionId) }, { $set: updatedData });

      return result.modifiedCount > 0;
    } catch (error) {
      throw new Error("Error updating transaction");
    }
  }

  // Get all transactions for a specific user, filtered by category and date range (month and year)
  static async getAllByMonthAndYear(userId, month, year) {
    try {
      const startDate = new Date(year, month - 1, 1); // First day of the month
      const endDate = new Date(year, month, 1); // First day of the next month

      return await db
        .getDb()
        .collection("transactions")
        .find({
          user_id: userId,
          date: { $gte: startDate, $lt: endDate }, // Date comparison for the specific month and year
        })
        .sort({ date: -1 }) // Sort by date in descending order
        .toArray();
    } catch (error) {
      throw new Error("Error retrieving transactions for the specified period");
    }
  }

  // Delete a transaction by ID
  static async deleteById(transactionId) {
    try {
      const result = await db
        .getDb()
        .collection("transactions")
        .deleteOne({ _id: new ObjectId(transactionId) });

      return result.deletedCount > 0;
    } catch (error) {
      throw new Error("Error deleting transaction");
    }
  }
}

module.exports = Transaction;

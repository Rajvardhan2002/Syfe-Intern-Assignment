const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Income {
  constructor(userId, month, year, amount, id = null) {
    this.userId = new ObjectId(userId);
    this.month = month;
    this.year = parseInt(year);
    this.amount = parseFloat(amount);
    this._id = id ? new ObjectId(id) : null;
  }

  async save() {
    if (this._id) {
      // Update income if _id exists
      return db
        .getDb()
        .collection("incomes")
        .updateOne(
          { _id: this._id }, // Ensure the update is for the correct income entry
          {
            $set: {
              month: this.month,
              year: this.year,
              amount: this.amount,
            },
          }
        );
    } else {
      // Check if an income already exists for the same month and year
      const existingIncome = await db
        .getDb()
        .collection("incomes")
        .findOne({ userId: this.userId, month: this.month, year: this.year });

      if (existingIncome) {
        // If it exists, update it
        return db
          .getDb()
          .collection("incomes")
          .updateOne(
            { _id: existingIncome._id },
            {
              $set: {
                amount: this.amount, // Update only the amount for the existing entry
              },
            }
          );
      } else {
        // Insert a new income record if it doesn't exist
        return db.getDb().collection("incomes").insertOne({
          userId: this.userId,
          month: this.month,
          year: this.year,
          amount: this.amount,
        });
      }
    }
  }

  static async getAllByUser(userId) {
    return db
      .getDb()
      .collection("incomes")
      .find({ userId: new ObjectId(userId) })
      .sort({ year: -1, month: 1 }) // Descending by year, descending by month
      .toArray();
  }

  static async deleteById(incomeId) {
    const result = await db
      .getDb()
      .collection("incomes")
      .deleteOne({ _id: new ObjectId(incomeId) });

    return result.deletedCount > 0;
  }

  static async getIncomeByMonthAndYear(userId, month, year) {
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

    // If the month is a number, convert it to the correct string (indexing starts at 0)
    const monthString =
      typeof month === "number" ? monthNames[month - 1] : month;

    // Fetch income data based on month (as string) and year
    const income = await db
      .getDb()
      .collection("incomes")
      .findOne({
        userId: new ObjectId(userId),
        month: monthString, // Ensure month is passed as a string
        year: parseInt(year),
      });

    // Return income or fallback to default if not found
    return income || { month: monthString, year: parseInt(year), amount: 1000 };
  }
}

module.exports = Income;

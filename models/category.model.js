const db = require("../data/database");

class Category {
  constructor(name, description, userId) {
    this.name = name;
    this.description = description;
    this.userId = userId; // Link category to a specific user
  }

  // Save the category to the database
  async save() {
    return await db.getDb().collection("categories").insertOne({
      name: this.name,
      description: this.description,
      user_id: this.userId,
    });
  }

  // Get all categories for a specific user
  static async getAllByUser(userId) {
    return await db
      .getDb()
      .collection("categories")
      .find({ user_id: userId })
      .toArray();
  }

  // Get a specific category by ID
  static async getById(categoryId) {
    const { ObjectId } = require("mongodb");
    return await db
      .getDb()
      .collection("categories")
      .findOne({ _id: new ObjectId(categoryId) });
  }

  // Update a category
  static async updateById(categoryId, updatedData) {
    const { ObjectId } = require("mongodb");
    const result = await db
      .getDb()
      .collection("categories")
      .updateOne({ _id: new ObjectId(categoryId) }, { $set: updatedData });
    return result.modifiedCount > 0;
  }

  // Delete a category by ID
  static async deleteById(categoryId) {
    const { ObjectId } = require("mongodb");
    const result = await db
      .getDb()
      .collection("categories")
      .deleteOne({ _id: new ObjectId(categoryId) });
    return result.deletedCount > 0;
  }
}

module.exports = Category;

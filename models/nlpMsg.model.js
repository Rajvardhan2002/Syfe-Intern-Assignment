const db = require("../data/database");
class NLP {
  constructor(userID, subject, message, predicition) {
    this.userID = userID;
    this.subject = subject;
    this.message = message;
    this.predicition = predicition;
  }
  userAlreadyExists() {
    return db.getDb().collection("nlp").findOne({ userID: this.userID });
  }
  async addNewMessage() {
    const user = await this.userAlreadyExists();
    const newMsg = {
      subject: this.subject,
      message: this.message,
      predicition: this.predicition,
      date: new Date().toLocaleDateString(),
    };
    if (user) {
      await db
        .getDb()
        .collection("nlp")
        .updateOne(
          { userID: this.userID },
          { $push: { messagesHistory: newMsg } }
        );
    } else {
      const result = await db
        .getDb()
        .collection("nlp")
        .insertOne({
          userID: this.userID,
          messagesHistory: [newMsg],
        });
      console.log(result);
    }
  }
}

module.exports = NLP;

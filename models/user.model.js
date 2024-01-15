const bcrypt = require("bcryptjs");

const db = require("../data/database");

class User {
  constructor(email, password, fullname, account, address, phone) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.account = account;
    this.phone = phone;
    this.address = address;
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    // let result = db.collection('users');
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      fullname: this.fullname,
      accountNumber: this.account,
      phone: this.phone,
      address: this.address,
    });
  }
}

module.exports = User;

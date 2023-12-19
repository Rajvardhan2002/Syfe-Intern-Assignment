const bcrypt = require('bcryptjs');

const db = require('../data/database');

class User {
    constructor (email,password,fullname,account,ifsc){
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.account = account;
        this.ifsc = ifsc;
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        // let result = db.collection('users');
        await db.getDb().collection('users').insertOne({
          email: this.email,
          password: hashedPassword,
          fullname: this.fullname,
          accountNumber : this.account,
          IFSC : this.ifsc,
        });
      }

}

module.exports = User;


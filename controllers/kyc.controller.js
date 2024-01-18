const KYC = require("../models/kyc.model");

async function getAccountWithSameNumber(req, res, next) {
  const userObj = new KYC(req.session.uid);
  const user = await userObj.getUserID();
  const phoneNum = user.phone;
  const accountArray = await userObj.getAccountWithPhoneNumber(+phoneNum);
  res.render("index/kyc", { accountArray: accountArray });
}

module.exports = {
  getAccountWithSameNumber: getAccountWithSameNumber,
};

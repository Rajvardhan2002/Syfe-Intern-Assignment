const User = require("../models/user.model");

function getSignup(req, res) {
  res.render("auth/signup");
}

////form submission
async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.account,
    req.body.ifsc
  );
  await user.signup();
  res.redirect("/login");
}


////shows login page
function getLogin(req, res) {
  res.render("auth/login");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
};

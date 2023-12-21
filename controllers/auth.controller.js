const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");

function getSignup(req, res) {
  res.render("auth/signup");
}

////form submission
async function signup(req, res, next) {
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.name,
      req.body.address,
      req.body.account,
      req.body.phone
    ) ||
    !validation.passwordMatches(req.body.password, req.body.confirm)
  ) {
    res.redirect("/signup");
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.account,
    req.body.phone,
    req.body.address
  );

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      res.redirect("/signup");
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}

////shows login page
function getLogin(req, res) {
  res.render("auth/login");
}

///////////////////////////////////////////handling login form post req
async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }
  if (!existingUser) {
    res.redirect("/login");
    return;
  }
  const passwordMatches = await user.hasMatchingPassword(existingUser.password);
  if (!passwordMatches) {
    res.redirect("/login");
    return;
  }
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/details");
  });
}

////////handling logout post req
function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout,
};

const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session_flashData");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
      confirm: "",
      name: "",
      address: "",
      account: "",
      phone: "",
    };
  }
  // console.log(sessionData);
  res.render("auth/signup", { inputData: sessionData });
}

////form submission
async function signup(req, res, next) {
  const enteredDataByUser = {
    email: req.body.email,
    password: req.body.password,
    confirm: req.body.confirm,
    name: req.body.name,
    address: req.body.address,
    account: req.body.account,
    phone: req.body.phone,
  };
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
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please re-check your input data.",
        ...enteredDataByUser,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.name,
    req.body.account,
    req.body.address,
    req.body.phone
  );

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User already exists! Try logging-in instead.",
          ...enteredDataByUser,
        },
        function () {
          res.redirect("/signup");
        }
      );
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
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: " ",
      password: "",
    };
  }
  res.render("auth/login", { inputData: sessionData });
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
  const sessionErrorData = {
    errorMessage: "Invalid credentials! Please check again.",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }
  const passwordMatches = await user.hasMatchingPassword(existingUser.password);
  if (!passwordMatches) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
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

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
    };
  }
  res.render("auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredDataByUser = {
    email: req.body.email,
    password: req.body.password,
    confirm: req.body.confirm,
    name: req.body.name,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.name
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

  const user = new User(req.body.email, req.body.password, req.body.name);

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
    res.redirect("/transactions");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
};

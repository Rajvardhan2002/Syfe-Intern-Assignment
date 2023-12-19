const User = require("../models/user.model");
const authUtil = require("../util/authentication");

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
    req.body.ifsc,
  );
  await user.signup();
  res.redirect("/login");
}


////shows login page
function getLogin(req, res) {
  res.render("auth/login");
}

///////////////////////////////////////////handling login form post req
async function login(req,res){
  const user = new User(req.body.email,req.body.password);
  const existingUser = await user.getUserWithSameEmail();
  if(!existingUser){
    res.redirect("/login");
    return;
  }
  const passwordMatches = await user.hasMatchingPassword(existingUser.password);
  if(!passwordMatches){
    res.redirect("/login");
    return;
  }
  authUtil.createUserSession(req,existingUser,function(){
    res.redirect("/details");
  })
}

////////handling logout post req
function logout(req,res){
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login:login,
  logout:logout,
};

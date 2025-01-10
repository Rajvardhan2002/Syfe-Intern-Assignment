function isAuth(req, res, next) {
  if (!req.session.uid) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }
  next(); // Proceed to the next middleware/route handler if authenticated
}

module.exports = isAuth;

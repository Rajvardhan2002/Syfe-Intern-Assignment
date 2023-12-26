const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.get('/', authController.getSignup);

router.get('/signup', authController.getSignup);

router.post("/signup", authController.signup);

router.get('/login', authController.getLogin);

router.post("/login",authController.login);

router.post("/logout",authController.logout);

router.get("/401",function(req,res){
    res.status(401).render("shared/401");
})

module.exports = router;


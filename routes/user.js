const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const { signup, renderSignupForm, renderLoginForm, login, logout } = require("../controllers/users.js");


router.route("/signup")
.get(renderSignupForm)
.post(WrapAsync(signup));

router.route("/login")
.get(renderLoginForm)
.post(savedRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), login);   


// logout get request

router.get("/logout", logout);






//router.get("/signup", renderSignupForm);

// signup post route
//router.post("/signup", WrapAsync(signup));

// login route
//router.get("/login", renderLoginForm);

// login post request
//Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
//router.post("/login", savedRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), login);   


module.exports = router;
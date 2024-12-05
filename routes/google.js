const express = require("express");
const passport = require("../controllers/google.js");
const router = express.Router();

// Route for Google authentication
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);                                              

// Callback route after Google login
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login", successRedirect: "/listings"}),
  /* (req, res) => {
    // Successful authentication
    res.redirect("/");
  } */
);

// Route for logout
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/listings");
  });
});

module.exports = router;

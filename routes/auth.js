const router = require("express").Router();
const passport = require("passport");

// authorize with local strategy
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/"
  })(req, res, next);
})

// authorize with github
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile"]
  })
);

// callback route for github-oauth
// hand control to passport to use code to grab profile info
router.get(
  "/github/redirect",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// authorize with azure
router.get("/azure", passport.authenticate("azure_ad_oauth2"));

// callback route for azure-oauth
// hand control to passport to use code to grab profile info
router.get(
  "/azure/redirect",
  passport.authenticate("azure_ad_oauth2", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

module.exports = router;

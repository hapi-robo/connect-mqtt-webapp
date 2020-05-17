const router = require("express").Router();

// redirect index page to login
router.get("/", (req, res) => res.redirect("/dashboard"));

// login page
router.get("/login", (req, res) => res.render("login", { layout: "./layouts/index" }));

// logout page
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

const router = require("express").Router();

const setLocale = require("../modules/locale");

// redirect index page to login
router.get("/", (req, res) => res.redirect("/devices"));

// login page
router.get("/login", setLocale, (req, res) =>
  res.render("login", {
    title: `| ${req.polyglot.t("login.title")}`,
    layout: "./layouts/index",
    polyglot: req.polyglot,
    route: "/login"
  })
);

// logout page
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// test page
router.get("/test", (req, res) => {
    res.send("Test")
    console.log(req.user);
  }
);

module.exports = router;

const router = require("express").Router();

// redirect index page to login
router.get("/", (req, res) => res.redirect("/devices"));

// login page
router.get("/login", (req, res) =>
  res.render("login", {
    title: "| Login",
    layout: "./layouts/index",
  })
);

// logout page
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// test page
router.get("/test", (req, res) =>
  res.render("test", {
    title: "| Test",
    layout: "./layouts/index",
  })
);

module.exports = router;

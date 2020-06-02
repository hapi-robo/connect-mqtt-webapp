const router = require("express").Router();
const Polyglot = require('node-polyglot');

const localeEn = require("../locale/en");
const localeJp = require("../locale/jp");

let polyglot = new Polyglot(localeEn);

// redirect index page to login
router.get("/", (req, res) => res.redirect("/devices"));

// login page
router.get("/login", (req, res) =>
  res.render("login", {
    title: `| ${polyglot.t("login.title")}`,
    layout: "./layouts/index",
    polyglot: polyglot 
  })
);

// logout page
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// change language
router.get("/locale/:lang", (req, res) => {
  const lang = req.params.lang;

  switch(lang) {
    case "en":
      console.log("English");
      polyglot = new Polyglot(localeEn);
      break;
    case "jp":
      console.log("日本語");
      polyglot = new Polyglot(localeJp);
      break;
    default:
      break;
  }

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

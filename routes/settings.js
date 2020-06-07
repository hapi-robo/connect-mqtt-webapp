const router = require("express").Router();

const User = require('../models/User');
const checkAuth = require("../modules/auth");
const setLocale = require("../modules/locale");

// register page
router.get('/', checkAuth, setLocale, (req, res) => 
  res.render('settings', { 
    title: `| ${req.polyglot.t("settings.title")}`,
    layout: "./layouts/dashboard",
    user: req.user,
    polyglot: req.polyglot
  })
);

// register handle
router.post('/save', checkAuth, (req, res) => {
  const { language } = req.body;
  let errors = [];

  let locale;
  switch (language) {
    case "English":
      locale = "en";
      break;

    case "日本語":
      locale = "jp";
      break;

    default:
      locale = "en";
      break;
  }

  // validation passed 
  User.findOne({ _id: req.user._id })
    .then(user => {
      if (user) {
        user.locale = locale;
        user.save()
          .then(user => res.redirect('/settings'))
          .catch(err => console.log(err));
      } else {
        errors.push({ msg: "Database error" })
        console.log("User not found");
      }
    });
});

module.exports = router;

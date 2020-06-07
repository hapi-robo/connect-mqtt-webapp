const Polyglot = require('node-polyglot');

const localeEn = require("../locale/en");
const localeJp = require("../locale/jp");

// middleware to check if user is already logged in
const setLocale = (req, res, next) => {

  var locale;

  if (typeof req.user !== "undefined") {
    locale = req.user.locale;
  } else if (typeof req.query !== "undefined") {
    locale = req.query.locale;
  }

  switch(locale) {
    case "en":
      req.polyglot = new Polyglot(localeEn);
      break;

    case "jp":
      req.polyglot = new Polyglot(localeJp);
      break;

    default:
      req.polyglot = new Polyglot(localeEn);
      break;
  }

  next();
};

module.exports = setLocale;

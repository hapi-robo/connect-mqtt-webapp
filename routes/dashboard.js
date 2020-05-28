const router = require("express").Router();
const Polyglot = require('node-polyglot');

const checkAuth = require("../modules/auth");
const deviceListAll = require("../modules/mqtt-message-parser");

const localeEn = require("../locale/en");
const localeJp = require("../locale/jp");

var polyglot = new Polyglot(localeEn);

// @route   GET dashboard/
// @desc    Render console page
// @access  OAuth
router.get("/:serial", checkAuth, (req, res) => {
  const serial = req.params.serial;

  // get device real-time information
  const device = deviceListAll.find(dev => dev.serial === serial);
  if (typeof device === "undefined") {
    console.log(`Robot is not online: ${serial}`)
    res.redirect("/devices");
  } else {
    res.render("dashboard", { 
      title: `| ${polyglot.t("dashboard.title")}`,
      layout: "./layouts/dashboard",
      user: req.user,
      serial: serial,
      device: device,
      polyglot: polyglot 
    });
  }
});

module.exports = router;

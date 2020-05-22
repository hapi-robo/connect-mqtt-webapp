const router = require("express").Router();

const checkAuth = require("../modules/auth");
const deviceListAll = require("../modules/mqtt-message-parser");

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
      title: "| Dashboard",
      layout: "./layouts/dashboard",
      user: req.user,
      serial: serial,
      device: device
    });
  }
});

module.exports = router;

const router = require("express").Router();

const authCheck = require("../modules/auth");

// @route   GET dashboard/
// @desc    Render console page
// @access  OAuth
router.get("/", authCheck, (req, res) => {
  res.render("dashboard", { 
  	layout: "./layouts/dashboard",
  	user: req.user 
  });
});

module.exports = router;

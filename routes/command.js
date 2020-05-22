const router = require("express").Router();

const checkAuth = require("../modules/auth");
const Temi = require("../modules/temi");
const mqttClient = require("../modules/mqtt-client");

const temi = new Temi(mqttClient);


// @route   POST command/
// @desc    Command line operations
// @access  OAuth
router.post("/", checkAuth, (req, res) => {
  console.log(req.body.command);
  res.json({ success: true, command: req.body.command });
  
})
// @route   POST command/goto
// @desc    Send device to location
// @access  OAuth
router.post("/goto", checkAuth, (req, res) => {
  temi.goto(req.body.serial, req.body.waypoint);
  res.json({ success: true, waypoint: req.body.waypoint });
});

module.exports = router;

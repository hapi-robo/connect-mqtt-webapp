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

  // parse command
  const separatorIndex = req.body.command.search(" ");
  if (separatorIndex !== -1) {
    cmd = req.body.command.slice(0, separatorIndex);
    val = req.body.command.slice(separatorIndex + 1);
  } else {
    cmd = req.body.command;
    val = null;
  }

  switch(cmd) {
    case 'stop':
      temi.stop(req.body.serial);
      break;

    case 'follow':
      temi.follow(req.body.serial);
      break;
    
    case 'goto':
      temi.goto(req.body.serial, val);
      break;
    
    case 'say':
    case 'tts':
      temi.tts(req.body.serial, val);
      break;
    
    case 'video':
      temi.video(req.body.serial, val);
      break;

    case 'youtube':
      temi.youtube(req.body.serial, val);
      break;

    case 'webview':
      temi.webview(req.body.serial, val);
      break;

    default:
      console.log(`[CMD] Unknown: ${cmd}`);
      break;
  }

  res.json({ success: true, cmd: cmd, val: val });
});


// @route   POST command/goto
// @desc    Send device to location
// @access  OAuth
router.post("/goto", checkAuth, (req, res) => {
  temi.goto(req.body.serial, req.body.waypoint);

  res.json({ success: true, waypoint: req.body.waypoint });
});


// @route   POST command/pan_tilt
// @desc    Pan and tilt the device
// @access  OAuth
router.post("/pan_tilt", checkAuth, (req, res) => {
  const narrowHfov = 60; // [deg]
  const narrowVfov = 48; // [deg]
  const wideHfov = 95; // [deg]
  const wideVfov = 60; // [deg]

  temi.rotate(req.body.serial, req.body.pan * wideHfov / 2);
  temi.tilt(req.body.serial, req.body.tilt * wideVfov / 2);

  res.json({ success: true, pan: req.body.pan, tilt: req.body.tilt })
})
module.exports = router;

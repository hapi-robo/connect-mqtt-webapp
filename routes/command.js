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

module.exports = router;

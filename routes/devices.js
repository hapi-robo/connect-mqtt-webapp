const router = require("express").Router();

const User = require("../models/User");
const checkAuth = require("../modules/auth");
const deviceListAll = require("../modules/mqtt-message-parser");

// constants
const SERIAL_LENGTH = 11; // temi's serial number is 11-digits long

// @route   GET console/
// @desc    Render device page
// @access  OAuth
router.get("/", checkAuth, (req, res) => {
  res.render("devices", { 
    title: "| Devices",
    layout: "./layouts/dashboard",
    user: req.user,
    name: '',
    serial: ''
  });
});

//-------------------------------------------------------
// Device Routes

// @route   GET devices/get
// @desc    Get all devices
// @access  OAuth
router.get("/get", checkAuth, (req, res) => {
  User.findById(req.user.id)
    .then(user => res.json(user.devices))
    .catch(err => res.status(404).json({ err }));
});

// @route   POST devices/add
// @desc    Add device
// @access  OAuth
router.post("/add", checkAuth, (req, res) => {
  const userId = req.user.id;
  const { name, serial } = req.body;
  let errors = [];

  // check required fields
  if (!name || !serial) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // serial number length
  if (!(serial.length === 11)) {
    errors.push({ msg: "Serial number should be 11-digits long"});
  }

  // show errors
  if (errors.length > 0) {
    res.render('devices', {
      title: "| Devices",
      layout: "./layouts/dashboard",
      user: req.user,
      errors: errors,
      name: name,
      serial: serial
    });
  } else {
    // find and add new device
    User.find({ _id: req.user.id, "devices.serial": serial })
      .then(devices => {
        console.log(devices);
        if (typeof devices === 'undefined' || devices.length === 0) {
          const newDevice = { name, serial };
          console.log(`Adding device: `, newDevice);
          User.updateOne({ _id: userId }, { $push: { devices: newDevice } })
            .then(() => {
              User.findById(userId)
                .then(user => {
                  res.render('devices', {
                    title: "| Devices",
                    layout: "./layouts/dashboard",
                    user: req.user,
                    name: '',
                    serial: ''
                  });
                })
                .catch(err => res.status(404).json({ err }));
            })
            .catch(err => res.status(404).json({ err }));
        } else {
          console.log(`Device already exists...`);
          res.render('devices', {
            title: "| Devices",
            layout: "./layouts/dashboard",
            user: req.user,
            errors: errors,
            name: name,
            serial: serial
          });
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
});

// @route   DELETE devices/delete
// @desc    Delete device
// @access  OAuth
router.delete("/delete", checkAuth, (req, res) => {
  // check parameters
  if (req.query.serial.length !== SERIAL_LENGTH) {
    res.status(404).json({ err: "Invalid serial number" });
  }

  // find and remove device
  User.find({
    _id: req.user.id,
    "devices.serial": req.query.serial
  })
    .then(user => {
      if (user === undefined || user.length === 0) {
        console.log("Device does not exist...");
        res.json({ exists: false });
      } else {
        console.log(`Deleting device: ${req.query.serial}`);
        User.findByIdAndUpdate(req.user.id, {
          $pull: { devices: { serial: req.query.serial } }
        })
          .then(() => {
            User.findById(req.user.id)
              .then(updatedUser => res.json(updatedUser.devices))
              .catch(err => res.status(404).json({ err }));
          })
          .catch(err => res.status(404).json(err));
      }
    })
    .catch(err => res.status(404).json({ err }));
});

//-------------------------------------------------------

// @route   GET devices/update
// @desc    Get device information
// @access  OAuth
router.get("/update", checkAuth, (req, res) => {
  User.findById(req.user.id)
    .then(user => {  
      const data = [];
      user.devices.forEach(userDev => {
        const device = deviceListAll.find(dev => dev.serial === userDev.serial);
        
        // device is online
        if (typeof device !== "undefined") {
          data.push(device);
        }
      });

      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ err })
    });
});

// @route   GET devices/info?serial=<value>
// @desc    Get device information
// @access  OAuth
router.get("/info", checkAuth, (req, res) => {
  const device = deviceListAll.find(dev => dev.serial === req.query.serial);
  console.log("hello")
  if (typeof device === "undefined") {
    res.json({ success: false });
  } else {
    res.json(device);
  }
});

module.exports = router;

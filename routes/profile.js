const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require('../models/User');

// register page
router.get('/', (req, res) => res.render('profile', { 
  title: "| Profile",
  layout: "./layouts/dashboard",
  user: req.user
}));

// register handle
router.post('/', (req, res) => {
  const { firstName, lastName, email, password1, password2 } = req.body;
  let errors = [];

  // check required fields
  if (!firstName || !lastName || !email || !password1 || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // check passwords match
  if (password1 !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // check password length
  if (password1.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  // show errors
  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      password1,
      password2
    });
  } else {
    // validation passed 
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: "Email is already registered"})
          // user exists
          res.render('register', {
            errors,
            firstName,
            lastName,
            email,
            password1,
            password2
          });
        } else {
          const newUser = new User({
            firstName,
            lastName,
            email,
            password1
          });

          // hash password
          bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // set password to hashed password
              newUser.password1 = hash;
              newUser.save()
                .then(user => res.end())
                .catch(err => console.log(err));
          }));
        }
      });
  }
});

module.exports = router;

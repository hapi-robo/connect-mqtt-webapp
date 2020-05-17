// middleware to check if user is already logged in
const authCheck = (req, res, next) => {
  if (!req.user) {
  	// if user is not logged in, redirect to login page
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = authCheck;

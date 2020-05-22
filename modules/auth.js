// middleware to check if user is already logged in
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
  	return next();
  } else {
  	// if user is not logged in, redirect to login page
    res.redirect("/login");
  }
};

module.exports = checkAuth;

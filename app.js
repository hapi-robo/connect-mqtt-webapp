if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const http = require('http');
// const https = require('https');
const fs = require('fs');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');

const socketio = require('./modules/socketio');

// configurations
const keys = require('./config/keys');
const passportSetup = require('./config/passport-setup');


// constants
const port = process.env.PORT || 5000;

// CA certificates
// note: this isn't needed with heroku because TLS provided by default
// const ssl_options = {
//   key: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.key')),
//   cert: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.crt')),
// };

// instantiate webapp
const app = express();

// setup template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body-parser middleware
// https://stackoverflow.com/a/51844327
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set content security policy
// ref: https://www.html5rocks.com/en/tutorials/security/content-security-policy/
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
//   return next;
// });

// serve static files
app.use(express.static(path.join(__dirname, './public')));

// set up session cookies
app.use(cookieSession({
    // maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// passport middlware
app.use(passport.initialize());
app.use(passport.session());


// connect to mongodb
mongoose
  .connect(keys.mongodb.dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => console.log(`[${new Date().toLocaleString()}] Connected to MongoDB...`))
  .catch(err => console.log(err));

// set up routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/command', require('./routes/command'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/devices', require('./routes/devices'));
app.use('/profile', require('./routes/profile'));
app.use('/register', require('./routes/register'));

// create server and websocket connection
const server = http.createServer(app);
// const server = https.createServer(ssl_options, app);
socketio(server);

// start server
server.listen(port, () => console.log(`Server is listening on port ${port}`));

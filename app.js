var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var logger = require('morgan');
var route = require("./routes");
const connectDB = require('./config/db');
const passport = require('passport');
require('./config/auth');
var app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

  // Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).send('Đã xảy ra lỗi trên server.');
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
connectDB();
route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

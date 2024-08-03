const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Connect DB
mongoose.connect('mongodb://localhost:27017/Login_DB', {
  useNewURLParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const app = express();
const PORT = process.env.PORT || 5000;

require('./config/passport')(passport);

// EJS middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Express session
app.use(session({
  secret: 'juice',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`Server running on ${PORT}`));

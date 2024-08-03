const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

router.get("/login", (req, res) => res.render("login"));

router.get("/register", (req, res) => res.render("register"));

// Register a new user
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in required fields" });
  }

  // Password validation
  if (password !== password2) {
    errors.push({ msg: "Entered passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Enter more than 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Check if user already exists
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash the password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Set password to hashed
            newUser.password = hash;

            // Save the user
            newUser
              .save()
              .then((user) => {
                req.flash('success_msg', 'Registered Successfully, please log in');
                res.redirect("/users/login");
              })
              .catch((err) => console.error(err));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req,res)=>{
  req.logout(err=>{
    if (err) console.error(err);
  });
  req.flash('success_msg', "Logged out");
  res.redirect('/users/login')
})

module.exports = router;

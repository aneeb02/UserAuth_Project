const express = require("express");
const router = express.Router();
const { ensureAuth } = require('../config/auth');

router.get('/', (req, res)=> res.render('welcome'));
router.get('/dashboard', ensureAuth, (req, res)=> res.render('dashboard', {
  name: req.user.name
}));


module.exports = router;


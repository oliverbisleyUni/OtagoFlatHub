// routes/flatRoutes.js

const express = require('express');
const router = express.Router();

// GET route for /flats
const { User } = require('../database');

router.get('/', async (req, res) => {
  const user = await User.findOne();
  res.render('index', { email: user ? user.email : 'No users found' });
});

module.exports = router;

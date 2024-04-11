// routes/flatRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// GET route for /flats
const { User } = require('../database');

router.get('/', async (req, res) => {
  res.render('login');
});

router.get('/index', async (req, res) => {
  const user = await User.findOne();
  res.render('index', { email: user ? user.email : 'No users found' });
});




router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user && password === user.password) { // Replace with hashed password check
      // Create token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // Replace 'your_secret_key' with a real key

      // Send token to client
      res.cookie('token', token, { httpOnly: true }); // Or send in another way you prefer
      res.redirect('/index');
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    res.render('login', { error: 'An error occurred' });
  }
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.render('register', { error: 'Please provide all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      email: email
    });

    // Redirect to login or other page after successful registration
    res.redirect('/login');
  } catch (error) {
    res.render('register', { error: 'An error occurred during registration.' });
  }
});

module.exports = router;

module.exports = router;

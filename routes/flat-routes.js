// routes/flatRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// GET route for /flats
const { User } = require('../database');

// Middleware to validate JWT
function validateJwt(req, res, next) {
  const token = req.cookies.token; // Assuming the JWT is stored in a cookie
  if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
              // JWT is invalid
              res.redirect('/login');
          } else {
              // JWT is valid
              req.user = decoded; // Add the decoded user data to the request object
              next();
          }
      });
  } else {
      // No token found, redirect to login
      res.redirect('/login');
  }
}


router.get('/login', async (req, res) => {
  res.render('login');
});

router.get('/', validateJwt, async (req, res) => {
  res.render('index');
});




router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        // Create token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        
        // Send token to client
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
      } else {
        res.render('login', { error: 'Invalid email or password' });
      }
    } else {
      res.render('login', { error: 'Invalid email or password' });
    }
  } catch (error) {
    res.render('login', { error: 'An error occurred' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token'); // If you're storing the token in a cookie
  res.redirect('/');
});



router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const {email, password } = req.body;

    // Basic validation
    if (!password || !email) {
      return res.render('register', { error: 'Please provide all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.render('register', { error: 'Username already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      password: hashedPassword,
      email: email
    });

    // Redirect to login or other page after successful registration
    res.redirect('/');
  } catch (error) {
    res.render('register', { error: 'An error occurred during registration.' });
  }
});

module.exports = router;

module.exports = router;

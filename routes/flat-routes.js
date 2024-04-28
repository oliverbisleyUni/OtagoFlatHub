// routes/flatRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// GET route for /flats
const {sequelize, User, Flat, FlatRecord } = require('../database');



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
  res.render('login2');
});

router.get('/', validateJwt, async (req, res) => {
  try {
    // Fetch all flats with their most recent flat records
    const flats = await Flat.findAll({
      include: [{
        model: FlatRecord,
        //order: [['updatedAt', 'DESC']], // Order flat records by updatedAt timestamp in descending order we dont have this coloum in our tables we might want to add it so we can always get the most uptodate to display on the home screen
        limit: 1 // Limit the result to only the latest record for each flat
      }]
    });

    res.render('index', { flats: flats });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/upload-flat', validateJwt, async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user.user_id);
    // Get user ID from the authenticated user
    const userId = req.user.user_id;

    // Extract data from the request body
    const { flatId, flatName, flatAddress, price, review } = req.body;

    let flat;

    // If the selected flat is "New Flat", create a new flat
    if (flatId === 'new') {
      // Check if both name and address are provided
      if (!flatName || !flatAddress) {
        return res.status(400).send('Name and address are required for new flat');
      }

      // Create a new flat
      flat = await Flat.create({ name: flatName, address: flatAddress });
    } else {
      // Find the existing flat by ID
      flat = await Flat.findByPk(flatId);

      // If the flat is not found, return an error
      if (!flat) {
        return res.status(404).send('Flat not found');
      }
    }

    // Create a new flat record
    const newFlatRecord = await FlatRecord.create({
      user_id: userId,
      flat_id: flat.flat_id,
      price,
      review: review.toString() // Ensure review is a string
    });

    // Redirect to the home page after successful upload
    res.redirect('/');
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



// GET method to fetch all flats for dropdown menu
router.get('/upload-flat', validateJwt, async (req, res) => {
  try {
    // Fetch all flats
    const flats = await Flat.findAll();

    // Pass flats and user ID to the upload-flat.pug file
    res.render('MakeFlat', { flats, userId: req.user.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
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
        res.render('login2', { error: 'Invalid email or password' });
      }
    } else {
      res.render('login2', { error: 'Invalid email or password' });
    }
  } catch (error) {
    res.render('login2', { error: 'An error occurred' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token'); // If you're storing the token in a cookie
  res.redirect('/');
});


router.get('/logintest', (req, res) => {
  
})


router.get('/register', (req, res) => {
  res.render('register2');
});

router.post('/register', async (req, res) => {
  try {
    const {email, password } = req.body;

    // Basic validation
    if (!password || !email) {
      return res.render('register2', { error: 'Please provide all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.render('register2', { error: 'Username already exists.' });
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
    res.render('register2', { error: error });
  }
});


module.exports = router;

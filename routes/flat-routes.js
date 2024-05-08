// routes/flatRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

// GET route for /flats
const {sequelize, User, Flat, FlatRecord } = require('../database');

const sdk = require('@api/locationiq');



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

router.get('/api/flats', async(req,res) => {
  try {
    // Fetch all flats with their most recent flat records
    const flats = await Flat.findAll({});
    res.send(flats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/login', async (req, res) => {
  res.render('login2');
});

async function getCoordinates(address) {
  sdk.auth(process.env.GEOCODING_KEY);
  let encodedAddress = encodeURIComponent(address);
  try {
    const response = await sdk.search({q: encodedAddress, format: 'json'});
    const { data } = response;
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      console.log(lat, lon);
      return { lat, lon };
    } else {
      throw new Error('No data found');
    }
  } catch (err) {
    console.error(err);
    throw err;  // Re-throw the error if you need to handle it later as well
  }
}


router.get('/', validateJwt, async (req, res) => {
  try {
    // Fetch all flats with their most recent flat records
    const flats = await Flat.findAll({
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
    // Get user ID from the authenticated user
    const userId = req.cookies.user_id;

    const { flatId, flatName, flatAddress, priceNew, reviewNew, priceExisting, reviewExisting } = req.body;

    let flat;
    let price;
    let review;

    if (flatId === 'new') {
      // Check if both name and address are provided
      if (!flatName || !flatAddress) {
        return res.status(400).send('Name and address are required for new flat');
      }

      // Check if a flat already exists with the provided address
      const existingFlat = await Flat.findOne({ where: { address: flatAddress } });

      if (existingFlat) {
        // Use the existing flat
        flat = existingFlat;
      } else {
        // Create a new flat
        const {lat, lon} = await getCoordinates(flatAddress);
        console.log(lat, lon);
        flat = await Flat.create({ name: flatName, address: flatAddress, latitude: lat, longitude: lon });
      }

      price = priceNew;
      review = reviewNew;
    } else {
      // Find the existing flat by ID
      flat = await Flat.findByPk(flatId);

      // If the flat is not found, return an error
      if (!flat) {
        return res.status(404).send('Flat not found');
      }

      price = priceExisting;
      review = reviewExisting;
    }

    // Create a new flat record
    const newFlatRecord = await FlatRecord.create({
      user_id: userId,
      flat_id: flat.flat_id,
      price: price,
      review: review // Ensure review is a string
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
    console.log(user);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        // Create token
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        
        // Send token to client
        res.cookie('token', token, { httpOnly: true });
        res.cookie('user_id', user.user_id, { httpOnly: true });
        res.redirect('/');
      } else {
        res.render('login2', { error: 'Invalid email or password' });
      }
    } else {
      res.render('login2', { error: 'Invalid email or password' });
    }
  } catch (error) {
    res.render('login2', { error: error });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token'); // If you're storing the token in a cookie
  res.redirect('/');
});



router.get('/register', (req, res) => {
  res.render('register2');
});


router.get('/flat/:flat_id', validateJwt, async(req, res) => {
  const flatId = req.params.flat_id;
  console.log(flatId)
  try {
    const records = await FlatRecord.findAll({
      where: { flat_id: flatId}
   });
   console.log(records);
   console.log(typeof records.user_id, typeof req.cookies.user_id);

    res.render('view-records', { records: records, current_user: parseInt(req.cookies.user_id) });
} catch (err) {
    console.log(err);
    res.status(500).send('Error occurred while fetching data');
}});

router.get('/delete-record/:record_id', validateJwt, async(req, res) => {
  const { record_id } = req.params;

    try {
        const result = await FlatRecord.destroy({
            where: { record_id: record_id }
        });

        if (result === 0) {
            return res.status(404).send({ message: "No review found with the specified ID." });
        }

        res.redirect('/')
    } catch (err) {
        res.status(500).send({
            message: "Error deleting review with ID " + record_id,
            error: err.message
        });
    }
  
});

router.post('/register', async (req, res) => {
  try {
    const {email, password } = req.body;

    // Basic validation
    if (!password || !email) {
      return res.render('register2', { error: 'Please provide all required fields.' });
    }

    // Check if university email
    const emailRegex = /^[a-zA-Z]{5}\d{3}@student\.otago\.ac\.nz$/;
    if (!emailRegex.test(email)) {
      return res.render('register2', { error: 'Must be valid university email' });
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

// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const { sequelize } = require('./database');
require('dotenv').config();


// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Set Pug as the view engine
app.set('view engine', 'pug');

// Routes
const flatRoutes = require('./routes/flat-routes');
app.use('/flats', flatRoutes);

// Set up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

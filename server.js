// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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

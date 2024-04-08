// routes/flatRoutes.js

const express = require('express');
const router = express.Router();

// GET route for /flats
router.get('/', (req, res) => {
  res.render('index'); // Assuming you have an index.pug file in the views folder
});

module.exports = router;

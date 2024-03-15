// src/index.js

const express = require('express');
const path = require('path');

// Create a new Express app
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Set up the view engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Set up a route for the home page
app.get('/', (req, res) => {
  res.render('index',{ title: 'My IoT Project' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

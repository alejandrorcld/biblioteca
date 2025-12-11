require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Import Book model
const bookModel = require('./models/Book');
const Book = bookModel(sequelize);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Connected to SQLite database');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Database error:', error);
  });

// Make Book model available globally for routes
app.locals.Book = Book;

// Routes
app.use('/api', require('./routes/api'));

// Main page route
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint for FCC to get tests
app.get('/_api/get-tests', (req, res) => {
  res.json({ 
    tests: [
      'GET all books',
      'POST new book',
      'GET book by ID',
      'PUT update book',
      'DELETE book by ID',
      'DELETE all books'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;

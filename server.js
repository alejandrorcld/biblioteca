require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.DB || 'mongodb://localhost:27017/biblioteca')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', require('./routes/api'));

// Main page route
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint for FCC to get tests
app.get('/_api/get-tests', (req, res) => {
  res.json([
    'POST new book',
    'POST book without title',
    'GET book by ID',
    'GET book invalid ID',
    'POST comment to book',
    'POST comment without comment',
    'POST comment invalid ID',
    'DELETE book by ID',
    'DELETE book invalid ID',
    'DELETE all books'
  ]);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  server = app.listen(0, () => {
    console.log(`Server running on port ${server.address().port}`);
  });
}

module.exports = server;

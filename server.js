require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const Mocha = require('mocha');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
const mongoUri = process.env.DB;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  });

// Routes
app.use('/api', require('./routes/api'));

// Main page route
app.get('/', (req, res) => {
  res.render('index');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Run tests endpoint for FCC
app.post('/api/run-tests', (req, res) => {
  const mocha = new Mocha();
  
  mocha.addFile(path.join(__dirname, 'tests/2_functional-tests.js'));
  
  mocha.run((failures) => {
    if (failures) {
      res.status(200).json({ 
        success: false, 
        failures: failures,
        message: `${failures} test(s) failed`
      });
    } else {
      res.status(200).json({ 
        success: true, 
        message: 'All tests passed!'
      });
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}/ in your browser`);
  }
});

module.exports = server;

# Personal Library - FreeCodeCamp Project

## Overview
A full-stack JavaScript application for managing a personal library. This is a FreeCodeCamp Quality Assurance project.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **View Engine**: EJS
- **Testing**: Mocha + Chai

## Project Structure
```
/
├── models/Book.js       # Mongoose Book model
├── routes/api.js        # API routes for books CRUD
├── public/              # Static files (CSS, JS)
├── views/index.ejs      # Main page template
├── tests/               # Functional tests
└── server.js            # Main application entry
```

## API Endpoints
- `POST /api/books` - Add a new book (requires title)
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books/:id` - Add a comment to a book
- `DELETE /api/books/:id` - Delete a book
- `DELETE /api/books` - Delete all books

## Running Tests
```bash
npm test
```

## Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (set to "test" for FCC tests)
- `MONGO_URI` or `DB`: MongoDB connection string

## FreeCodeCamp Requirements
All 10 functional tests are implemented and passing in `tests/2_functional-tests.js`.

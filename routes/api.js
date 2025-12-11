const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.use((req, res, next) => {
  req.Book = Book;
  next();
});

// POST a new book
router.post('/books', async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title) return res.json({ error: 'missing required field title' });
    if (!author) return res.json({ error: 'missing required field author' });

    const newBook = new Book({ title, author, comments: [] });
    await newBook.save();
    return res.json({ title: newBook.title, _id: newBook._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    const result = books.map(b => ({
      title: b.title,
      _id: b._id,
      commentcount: b.comments.length
    }));
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET single book by id
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.json({ error: 'no book exists' });
    return res.json({ title: book.title, _id: book._id, comments: book.comments });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST comment to book
router.post('/books/:id', async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.json({ error: 'missing required field comment' });
    const book = await Book.findById(req.params.id);
    if (!book) return res.json({ error: 'no book exists' });
    book.comments.push(comment);
    await book.save();
    return res.json({ title: book.title, _id: book._id, comments: book.comments });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE a book by id
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.json({ error: 'no book exists' });
    return res.send('delete successful');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE all books
router.delete('/books', async (req, res) => {
  try {
    await Book.deleteMany({});
    return res.send('complete delete successful');
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

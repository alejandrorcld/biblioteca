const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET all books
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new book
router.post('/books', async (req, res) => {
  try {
    const { title, author, isbn, description, pages, publishedDate } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const newBook = new Book({
      title,
      author,
      isbn: isbn || '',
      description: description || '',
      pages: pages || 0,
      publishedDate: publishedDate || null
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update a book
router.put('/books/:id', async (req, res) => {
  try {
    const { title, author, isbn, description, pages, publishedDate } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (description !== undefined) updateData.description = description;
    if (pages !== undefined) updateData.pages = pages;
    if (publishedDate !== undefined) updateData.publishedDate = publishedDate;
    
    updateData.updatedAt = new Date();

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a book
router.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book: deletedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE all books
router.delete('/books', async (req, res) => {
  try {
    await Book.deleteMany({});
    res.json({ message: 'complete delete successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

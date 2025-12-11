const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  req.Book = req.app.locals.Book;
  next();
});

// GET all books
router.get('/books', async (req, res) => {
  try {
    const books = await req.Book.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET book by ID
router.get('/books/:id', async (req, res) => {
  try {
    const book = await req.Book.findByPk(req.params.id);
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

    const newBook = await req.Book.create({
      title,
      author,
      isbn: isbn || '',
      description: description || '',
      pages: pages || 0,
      publishedDate: publishedDate || null
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update a book
router.put('/books/:id', async (req, res) => {
  try {
    const book = await req.Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, isbn, description, pages, publishedDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (isbn !== undefined) updateData.isbn = isbn;
    if (description !== undefined) updateData.description = description;
    if (pages !== undefined) updateData.pages = pages;
    if (publishedDate !== undefined) updateData.publishedDate = publishedDate;

    await book.update(updateData);
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a book
router.delete('/books/:id', async (req, res) => {
  try {
    const book = await req.Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE all books
router.delete('/books', async (req, res) => {
  try {
    await req.Book.destroy({ where: {} });
    res.json({ message: 'complete delete successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

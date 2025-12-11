'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || process.env.DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String]
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        const books = await Book.find({});
        const result = books.map(b => ({
          _id: b._id,
          title: b.title,
          commentcount: b.comments.length
        }));
        res.json(result);
      } catch (err) {
        res.json([]);
      }
    })

    .post(async function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = new Book({ title, comments: [] });
        await newBook.save();
        res.json({ _id: newBook._id, title: newBook.title });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    })

    .delete(async function(req, res){
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('no book exists');
        }
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })

    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      if (!comment) {
        return res.send('missing required field comment');
      }
      
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('no book exists');
        }
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        await book.save();
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (err) {
        res.send('no book exists');
      }
    })

    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        if (!mongoose.Types.ObjectId.isValid(bookid)) {
          return res.send('no book exists');
        }
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });

};

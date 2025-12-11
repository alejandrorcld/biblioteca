const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/Book');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(10000);

  // Clear books before each test
  beforeEach(async function() {
    await Book.deleteMany({});
  });

  // Test GET all books when empty
  test('GET /api/books - Get all books (empty)', function(done) {
    chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body.length, 0);
        done();
      });
  });

  // Test POST a new book
  test('POST /api/books - Add a new book', function(done) {
    const newBook = {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      description: 'A classic American novel',
      pages: 180
    };

    chai.request(server)
      .post('/api/books')
      .send(newBook)
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.equal(res.body.title, 'The Great Gatsby');
        assert.equal(res.body.author, 'F. Scott Fitzgerald');
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        done();
      });
  });

  // Test POST book without required fields
  test('POST /api/books - Reject book without title or author', function(done) {
    const invalidBook = {
      isbn: '123-456'
    };

    chai.request(server)
      .post('/api/books')
      .send(invalidBook)
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.property(res.body, 'error');
        done();
      });
  });

  // Test GET all books (with data)
  test('GET /api/books - Get all books (with data)', function(done) {
    const book1 = new Book({
      title: '1984',
      author: 'George Orwell'
    });

    const book2 = new Book({
      title: 'Brave New World',
      author: 'Aldous Huxley'
    });

    Promise.all([book1.save(), book2.save()])
      .then(() => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length, 2);
            assert.equal(res.body[0].title, 'Brave New World'); // newest first
            done();
          });
      });
  });

  // Test GET book by ID
  test('GET /api/books/:id - Get a specific book', function(done) {
    const newBook = new Book({
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee'
    });

    newBook.save().then((book) => {
      chai.request(server)
        .get(`/api/books/${book._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'To Kill a Mockingbird');
          assert.equal(res.body._id.toString(), book._id.toString());
          done();
        });
    });
  });

  // Test GET book by invalid ID
  test('GET /api/books/:id - Get non-existent book', function(done) {
    chai.request(server)
      .get('/api/books/123456789012345678901234')
      .end((err, res) => {
        assert.equal(res.status, 404);
        assert.property(res.body, 'error');
        done();
      });
  });

  // Test PUT update a book
  test('PUT /api/books/:id - Update a book', function(done) {
    const newBook = new Book({
      title: 'Original Title',
      author: 'Original Author'
    });

    newBook.save().then((book) => {
      const updatedData = {
        title: 'Updated Title',
        pages: 350
      };

      chai.request(server)
        .put(`/api/books/${book._id}`)
        .send(updatedData)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, 'Updated Title');
          assert.equal(res.body.pages, 350);
          assert.equal(res.body.author, 'Original Author'); // unchanged field
          done();
        });
    });
  });

  // Test PUT update non-existent book
  test('PUT /api/books/:id - Update non-existent book', function(done) {
    chai.request(server)
      .put('/api/books/123456789012345678901234')
      .send({ title: 'Updated' })
      .end((err, res) => {
        assert.equal(res.status, 404);
        assert.property(res.body, 'error');
        done();
      });
  });

  // Test DELETE a book
  test('DELETE /api/books/:id - Delete a book', function(done) {
    const newBook = new Book({
      title: 'To Be Deleted',
      author: 'Some Author'
    });

    newBook.save().then((book) => {
      chai.request(server)
        .delete(`/api/books/${book._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'message');
          assert.equal(res.body.message, 'Book deleted successfully');

          // Verify book is actually deleted
          chai.request(server)
            .get(`/api/books/${book._id}`)
            .end((err2, res2) => {
              assert.equal(res2.status, 404);
              done();
            });
        });
    });
  });

  // Test DELETE non-existent book
  test('DELETE /api/books/:id - Delete non-existent book', function(done) {
    chai.request(server)
      .delete('/api/books/123456789012345678901234')
      .end((err, res) => {
        assert.equal(res.status, 404);
        assert.property(res.body, 'error');
        done();
      });
  });

  // Test DELETE all books
  test('DELETE /api/books - Delete all books', function(done) {
    const book1 = new Book({ title: 'Book 1', author: 'Author 1' });
    const book2 = new Book({ title: 'Book 2', author: 'Author 2' });

    Promise.all([book1.save(), book2.save()])
      .then(() => {
        chai.request(server)
          .delete('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'message');

            // Verify all books are deleted
            chai.request(server)
              .get('/api/books')
              .end((err2, res2) => {
                assert.equal(res2.body.length, 0);
                done();
              });
          });
      });
  });
});

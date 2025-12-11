const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/Book');

chai.use(chaiHttp);

let testBookId;

suite('Functional Tests', function() {
  this.timeout(10000);

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('#1 Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book Title' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body.title, 'Test Book Title');
            testBookId = res.body._id;
            done();
          });
      });
      
      test('#2 Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('#3 Test GET /api/books', function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            if (res.body.length > 0) {
              assert.property(res.body[0], 'title');
              assert.property(res.body[0], '_id');
              assert.property(res.body[0], 'commentcount');
            }
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('#4 Test GET /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .get('/api/books/507f1f77bcf86cd799439011')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('#5 Test GET /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .get('/api/books/' + testBookId)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('#6 Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({ comment: 'Test comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, 'Test comment');
            done();
          });
      });

      test('#7 Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('#8 Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/507f1f77bcf86cd799439011')
          .send({ comment: 'Test comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('#9 Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/' + testBookId)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('#10 Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .delete('/api/books/507f1f77bcf86cd799439011')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});

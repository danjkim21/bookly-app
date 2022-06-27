// ====== Modules ====== //
const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
require('dotenv').config();

// ====== Variables ====== //
const PORT = process.env.PORT || 8000;

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'booklyPlaylists',
  collection;

// ====== MiddleWare ====== //
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// ====== MongoDB connection ====== //
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db(dbName);
  collection = db.collection('books');
});

// ====== CRUD Framework ====== //
// == GET == index.ejs Homepage on '/'
app.get('/', async (request, response) => {
  db.collection('books')
    .find()
    .toArray()
    .then((data) => {
      response.render('index.ejs', { booksData: data });
      response.redirect('/');
    })
    .catch((error) => console.error(error));
});

// == GET == Return completed-books.ejs on '/completed'
app.get('/completed', async (request, response) => {
  db.collection('books')
    .find()
    .toArray()
    .then((data) => {
      response.render('completed-books.ejs', { booksData: data });
      response.redirect('/completed');
    })
    .catch((error) => console.error(error));
});

// == POST == Add new books to MongoDB on '/addBook' from inputbtn (see main.js)
app.post('/addBook', (req, res) => {
  db.collection('books')
    .insertOne({
      bookId: req.body.bookId,
      bookTitle: req.body.bookTitle,
      bookAuthors: req.body.bookAuthors,
      bookPageCount: req.body.bookPageCount,
      bookDescription: req.body.bookDescription,
      bookImage: req.body.bookImage,
    })
    .then((result) => {
      console.log('Book Added');
      response.redirect('/');
    })
    .catch((err) => {
      console.error(err);
    });
});

// == DELETE == Remove selected book from MongoDB on '/rmBook' from removeBookItemBtns (see main.js)
app.delete('/rmBook', (request, response) => {
  db.collection('books')
    .deleteOne({ bookId: request.body.bookId })
    .then((result) => {
      console.log('Book Deleted');
      response.json('Book Deleted');
    })
    .catch((error) => console.error(error));
});

// Listen on server PORT 
app.listen(PORT, () => {
  console.log(`Server is running on port`);
});

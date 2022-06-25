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

// ====== CRUD ====== //
// Return Homepage on '/'
app.get('/', async (request, response) => {
  try {
    response.render('index.ejs');
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// Add new books to MongoDB on '/addBook' from inputbtn (see main.js)
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

app.listen(PORT, () => {
  console.log(`Server is running on port`);
});

// ====== Modules ====== //
const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// ====== Variables ====== //
const PORT = process.env.PORT || 8000;

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'bookly',
  collection;

// ====== MiddleWare ====== //
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// ====== MongoDB connection ====== //
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
    collection = db.collection('books');
});

// ====== CRUD ====== //
app.get('/', async (request, response) => {
  try {
    response.render('index.ejs');
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port`);
});

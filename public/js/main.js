// ========= Fetch Google Books API JSON Data ========= //
// GOOGLE API Docs - https://developers.google.com/books/docs/v1/using

// ========= Auto Complete Functions ========= //
// On event 'input' enable autocomplete search input
async function enableBookSearchInput() {
  let searchInput = document.querySelector('.bookSearchInput');
  searchInput.addEventListener('input', () => {
    let searchInputResult = searchInput.value;
    // console.log(searchInputResult);

    fetchBooksData(searchInputResult);
  });
}
enableBookSearchInput();

// after autocomplete search input is enabled = get book results based on input event
async function fetchBooksData(searchInputResult) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchInputResult}&key=AIzaSyByYEeZn4taw9OfJDef1qCOgAgSDschcaE`
    );
    const data = await response.json();
    const bookSearchResults = data.items;
    // console.log(bookSearchResults);

    writeToSuggestions(bookSearchResults);
    suggestionsListListeners(bookSearchResults);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
}

// Write book autocomplete suggestions to DOM
async function writeToSuggestions(bookSearchResults) {
  let suggestions = document.querySelector('.suggestions');
  suggestions.innerHTML = '';

  // If there are matches in the book api ...
  if (bookSearchResults.length > 0) {
    // create the HTML list items (title & Authors)
    let html = bookSearchResults.map((elem) => {
      return `
        <li class="autocomplete-item" data-id="${elem.id}">
          <p class="itemTitle">${elem.volumeInfo.title}: ${elem.volumeInfo.subtitle}</p>
          <p class="itemAuthors">${elem.volumeInfo.authors}</p>
        </li>
              `;
    });
    // Add HTML list items to the DOM
    html.unshift(suggestions);
    suggestions.innerHTML = html.join('');
  } else {
    console.log('no results');
    res.sendStatus(404);
    return;
  }
}

// Add event listeners on book autocomplete suggestion list li's
async function suggestionsListListeners(bookSearchResults) {
  let listItems = document.querySelectorAll('.autocomplete-item');

  // Iterate through all suggestion items li's in the list ul
  for (let item of listItems) {
    item.addEventListener('click', (e) => {
      document.querySelector('.suggestions').innerHTML = '';
      document.querySelector('.bookSearchInput').value = '';
      // Get object data by the data-id attribute
      const clickedBookItem = bookSearchResults.filter(
        (item) => item.id === e.currentTarget.getAttribute('data-id')
      );
      console.log(clickedBookItem);

      // Send and run selected book item data to addbook() function
      addBook(clickedBookItem);
    });
  }
}

// ========= CRUD main.js <--> server.js connections ========= //

// == POST == Send new book data to MongoDB on POST (see server.js)
async function addBook(clickedBookItem) {
  const bookId = clickedBookItem[0].id;
  const bookTitle = clickedBookItem[0].volumeInfo.title;
  const bookAuthors = clickedBookItem[0].volumeInfo.authors;
  const bookPageCount = clickedBookItem[0].volumeInfo.pageCount;
  const bookDescription = clickedBookItem[0].volumeInfo.description;
  const bookImage = clickedBookItem[0].volumeInfo.imageLinks.smallThumbnail;

  try {
    const response = await fetch('addBook', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: bookId,
        bookTitle: bookTitle,
        bookAuthors: bookAuthors,
        bookPageCount: bookPageCount,
        bookDescription: bookDescription,
        bookImage: bookImage,
        userRating: null,
        isFavorited: false,
        isCompleted: false,
      }),
    });
    const data = await response.json();
    console.log(data);
    window.location.replace('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
}

// == UPDATE == Adds/removes a book to favorites on '/addFavorite' or '/rmFavorite' (see server.js)
const favoriteBookBtn = document.querySelectorAll('.likeBookItemBtns');
Array.from(favoriteBookBtn).forEach((elem) => {
  elem.addEventListener('click', toggleFavoriteBookItem);
});

async function toggleFavoriteBookItem() {
  const bookId = this.parentNode.getAttribute('data-id');

  // If the button is invisible (book not favorited) -> favorite book and add heart button
  if (this.classList.contains('invisible')) {
    try {
      const response = await fetch('addFavorite', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookId,
        }),
      });
      const data = await response.json();
      console.log(data);

      this.classList.add('visible');
      this.classList.remove('invisible');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  // If the button is visible (book favorited) -> unfavorite book and add remove heart button
  } else if (this.classList.contains('visible')) {
    try {
      const response = await fetch('rmFavorite', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookId,
        }),
      });
      const data = await response.json();
      console.log(data);

      this.classList.add('invisible');
      this.classList.remove('visible');
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
  }
}

// == DELETE ==  Remove selected book from MongoDB on '/rmBook' on DELETE (see server.js)
// Add event listeners on all rbBookItemBtns
const rmBookBtn = document.querySelectorAll('.removeBookItemBtns');
Array.from(rmBookBtn).forEach((elem) => {
  elem.addEventListener('click', rmBookItem);
});

// Get data-id attributes from rmBookBtns and remove from mongoDB database by bookId
async function rmBookItem() {
  const bookId = this.parentNode.getAttribute('data-id');

  try {
    const response = await fetch('rmBook', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: bookId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
}

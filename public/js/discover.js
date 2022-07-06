// ========= On Mobile - Hamburger button Open & Close ========= //
const hamburgerBtn = document.querySelector('.hamburgerBtn');
hamburgerBtn.addEventListener('click', toggleSideBar);

async function toggleSideBar() {
  let sideBar = document.querySelector('.sideBar');
  let profileArea = document.querySelector('.profileArea');
  let navContent = document.querySelector('.navContent');

  sideBar.classList.toggle('open');
  profileArea.classList.toggle('visible');
  navContent.classList.toggle('visible');
}

// ========= Fetch NYTimes Books API JSON Data ========= //
// NYTimes API Docs - https://developer.nytimes.com/docs/books-product/1/overview

// ---(IIFE)--- Fetch all Latest bestsellers books from each category of books
(async function fetchNytBestSellers() {
  try {
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=fMS1dkIc0WhACTkyYfl7RxhqN6XnJcDn`
    );
    const data = await response.json();
    const bookCategories = data.results.lists;
    console.log(bookCategories);

    // When book data is fetched, run these two functions next
    displayBestSellersFiction(bookCategories);
    displayBestSellersNonfiction(bookCategories);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
})();

// Display all fiction best seller books in the "Most Popular in Fiction" discovery section
async function displayBestSellersFiction(bookCategories) {
  const bookResultsFiction = bookCategories[0].books;
  console.log(bookResultsFiction);

  try {
    bookResultsFiction.forEach((elem) => {
      let bookItem = document.createElement('section');
      bookItem.setAttribute('class', 'bookResult');
      bookItem.setAttribute('data-isbn', `${elem.primary_isbn13}`);
      bookItem.innerHTML = `<a class="bookCoverImage" href="#${elem.primary_isbn13}"> <img src="${elem.book_image}" alt="book cover image" /></a>
        <section id="${elem.primary_isbn13}" class="modal">
          <section class="modal__content">
            <section class="editBookSummaryMain flexBox">
              <img
                src="${elem.book_image}"
                alt="book cover image"
                class="bookCoverImage"
              />
              <section class="editBookInfo">
                <p class="bookTitle">${elem.title}</p>
                <p class="bookAuthor">${elem.author}</p>
              </section>
            </section>
            <p class="bookDescription">${elem.description}</p>
            <a href="#" class="modal__close">&times;</a>
          </section>
        </section>
      `;
      document.querySelector('.bookResultsFiction').appendChild(bookItem);
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
}

// Display all nonfiction best seller books in the "Most Popular in Nonfiction" discovery section
async function displayBestSellersNonfiction(bookCategories) {
  const bookResultsNonfiction = bookCategories[1].books;
  console.log(bookResultsNonfiction);

  try {
    bookResultsNonfiction.forEach((elem) => {
      let bookItem = document.createElement('section');
      bookItem.setAttribute('class', 'bookResult');
      bookItem.setAttribute('data-isbn', `${elem.primary_isbn13}`);
      bookItem.innerHTML = `<a class="bookCoverImage" href="#${elem.primary_isbn13}"> <img src="${elem.book_image}" alt="book cover image" /></a>
        <section id="${elem.primary_isbn13}" class="modal">
          <section class="modal__content">
            <section class="editBookSummaryMain flexBox">
              <img
                src="${elem.book_image}"
                alt="book cover image"
                class="bookCoverImage"
              />
              <section class="editBookInfo">
                <p class="bookTitle">${elem.title}</p>
                <p class="bookAuthor">${elem.author}</p>
              </section>
            </section>
            <p class="bookDescription">${elem.description}</p>
            <a href="#" class="modal__close">&times;</a>
          </section>
        </section>
      `;
      document.querySelector('.bookResultsNonfiction').appendChild(bookItem);
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }
}

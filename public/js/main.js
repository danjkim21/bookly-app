// ========= Fetch Google Books API JSON Data ========= //

// ========= Auto Complete Functions ========= //
// On event 'input' enable autocomplete search input
async function enableBookSearchInput() {
  let searchInput = document.querySelector('.bookSearchInput');
  searchInput.addEventListener('input', () => {
    let searchInputResult = searchInput.value;
    console.log(searchInputResult);

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
    console.log(bookSearchResults);

    writeToSuggestions(bookSearchResults);
    suggestionsListListeners(bookSearchResults)
  } catch (err) {
    console.error(err);
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
      const clickedBookItem = bookSearchResults.filter((item) => item.id === e.currentTarget.getAttribute('data-id'))
      console.log(clickedBookItem);
    })
  }
}

// INPUT AUTOCOMPLETE ON PAGE LOAD - IIFE ----------------
// (function () {
//   'use strict';
//   let reactorNameInput = document.querySelector('.bookSearchInput');
//   let ulField = document.querySelector('#suggestions');

//   reactorNameInput.addEventListener('input', changeAutoComplete);
//   reactorNameInput.addEventListener('focusin', removeHidden);
//   ulField.addEventListener('click', selectItem);

//   // Fetch Adv. Reactor DB data for autocomplete list
//   let reactorSearchList = [];
//   fetch(`https://adv-nuclear-api.herokuapp.com/api/`)
//     .then((response) => response.json())
//     .then((dataResults) => {
//       dataResults.forEach((elem) => reactorSearchList.push(elem.name));
//     });
//   // console.log(reactorSearchList)

//   function removeHidden() {
//     ulField.classList.remove('hidden');
//   }
//   function changeAutoComplete({ target }) {
//     let data = target.value;
//     ulField.innerHTML = ``;
//     if (data.length) {
//       let autoCompleteValues = autoComplete(data);
//       autoCompleteValues.forEach((elem) => {
//         addItem(elem);
//       });
//     }
//   }
//   function autoComplete(inputValue) {
//     return reactorSearchList.filter((elem) =>
//       elem.toLowerCase().includes(inputValue.toLowerCase())
//     );
//   }
//   function addItem(value) {
//     ulField.innerHTML = ulField.innerHTML + `<li>${value}</li>`;
//   }
//   function selectItem({ target }) {
//     if (target.tagName === 'LI') {
//       reactorNameInput.value = target.textContent;
//       ulField.innerHTML = ``;
//     }
//   }
// })();

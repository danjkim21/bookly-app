// Fetch Google Books API JSON Data

async function enableBookSearchInput() {
  let searchInput = document.querySelector('.bookSearchInput');
  searchInput.addEventListener('input', () => {
    let searchInputResult = searchInput.value;
    console.log(searchInputResult);

    fetchBooksData(searchInputResult);
  });
}
enableBookSearchInput();

async function fetchBooksData(searchInputResult) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchInputResult}&key=AIzaSyByYEeZn4taw9OfJDef1qCOgAgSDschcaE`
    );
    const data = await response.json();
    const bookSearchResults = data.items;
    console.log(bookSearchResults);

    writeToSuggestions(bookSearchResults);
  } catch (err) {
    console.error(err);
  }
}

async function writeToSuggestions(bookSearchResults) {
  let suggestions = document.querySelector('.suggestions');
  suggestions.innerHTML = '';

  if (bookSearchResults.length > 0) {
    let html = bookSearchResults.map((elem) => {
      return `
        <li class="autocomplete-item" data-id="${elem.id}">
          <p class="itemTitle">${elem.volumeInfo.title}: ${elem.volumeInfo.subtitle}</p>
          <p class="itemAuthors">${elem.volumeInfo.authors}</p>
        </li>
              `;
    });
    html.unshift(suggestions);
    suggestions.innerHTML = html.join('');
  } else {
    console.log('no results');
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

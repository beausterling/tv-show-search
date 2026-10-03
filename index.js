// TVmaze search API: https://api.tvmaze.com/search/shows?q=<search term>
const API_URL = "https://api.tvmaze.com/search/shows?q=";

const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#search-input");
const resultsTitle = document.querySelector(".results__title");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchShows(searchInput.value.trim());
});

async function searchShows(searchTerm) {
  resultsTitle.textContent = `Search results for "${searchTerm}"`;
  const response = await fetch(API_URL + encodeURIComponent(searchTerm));
  const data = await response.json();
  console.log(data);
}

// TVmaze search API: https://api.tvmaze.com/search/shows?q=<search term>
const API_URL = "https://api.tvmaze.com/search/shows?q=";
const MAX_RESULTS = 6;
const PLACEHOLDER_IMG = "assets/no-poster.svg";

const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#search-input");
const resultsTitle = document.querySelector(".results__title");
const resultsStatus = document.querySelector(".results__status");
const showsEl = document.querySelector(".shows");
const sortSelect = document.querySelector("#sort");
const genreSelect = document.querySelector("#genre-filter");

// the first 6 shows from the latest search
let shows = [];

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchShows(searchInput.value.trim());
});

sortSelect.addEventListener("change", renderShows);
genreSelect.addEventListener("change", renderShows);

async function searchShows(searchTerm) {
  resultsTitle.textContent = `Search results for "${searchTerm}"`;
  const response = await fetch(API_URL + encodeURIComponent(searchTerm));
  const data = await response.json();
  shows = data.slice(0, MAX_RESULTS).map((result) => simplifyShow(result.show));
  updateGenreOptions();
  renderShows();
}

// only keep the parts of the show we need, and fill in missing posters and years
function simplifyShow(show) {
  return {
    title: show.name,
    premiered: show.premiered, // "2005-03-24", or null if TVmaze doesn't know
    year: show.premiered ? show.premiered.slice(0, 4) : "Year unknown",
    poster: show.image ? show.image.medium : PLACEHOLDER_IMG,
    hasPoster: Boolean(show.image),
    genres: show.genres,
    url: show.url,
  };
}

// fill the genre dropdown with the genres of the current results
function updateGenreOptions() {
  const genres = [];
  shows.forEach((show) => {
    show.genres.forEach((genre) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });
  genres.sort();
  genreSelect.innerHTML =
    `<option value="all">All genres</option>` +
    genres.map((genre) => `<option value="${escapeHTML(genre)}">${escapeHTML(genre)}</option>`).join("");
}

function renderShows() {
  const genre = genreSelect.value;
  // filter() returns a new array, so "Best match" can always go back to the API's order
  const filteredShows = shows.filter((show) => genre === "all" || show.genres.includes(genre));
  const showsToRender = sortShows(filteredShows);
  showsEl.innerHTML = showsToRender.map((show) => showHTML(show)).join("");

  const count = showsToRender.length;
  const label = genre === "all" ? "" : `${genre} `;
  resultsStatus.textContent = `Showing ${count} ${label}${count === 1 ? "show" : "shows"}`;
}

function sortShows(list) {
  const sortBy = sortSelect.value;
  if (sortBy === "az") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "za") {
    list.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortBy === "newest") {
    list.sort((a, b) => compareDates(a, b, "newest"));
  } else if (sortBy === "oldest") {
    list.sort((a, b) => compareDates(a, b, "oldest"));
  }
  return list;
}

function compareDates(a, b, order) {
  // shows without a premiere date always go to the end of the list
  if (!a.premiered && !b.premiered) return 0;
  if (!a.premiered) return 1;
  if (!b.premiered) return -1;
  // dates are "YYYY-MM-DD" strings, so comparing them as text sorts them by date
  const result = a.premiered.localeCompare(b.premiered);
  return order === "newest" ? -result : result;
}

function showHTML(show) {
  const altText = show.hasPoster ? `${show.title} poster` : `No poster available for ${show.title}`;
  const genres = show.genres.length ? show.genres.join(", ") : "No genre listed";
  return `<article class="show">
    <a href="${escapeHTML(show.url)}" class="show__link" target="_blank" rel="noopener">
      <figure class="show__img-wrapper">
        <img src="${escapeHTML(show.poster)}" class="show__img" alt="${escapeHTML(altText)}">
      </figure>
      <div class="show__info">
        <h3 class="show__title">${escapeHTML(show.title)}</h3>
        <p class="show__year">${show.year}</p>
        <p class="show__genres">${escapeHTML(genres)}</p>
      </div>
    </a>
  </article>`;
}

// show titles come from the API, so escape them before putting them into HTML
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// https://api.tvmaze.com/search/shows?q=office
const API_URL = "https://api.tvmaze.com/search/shows?q=";

const searchForm = document.querySelector(".search");
const searchInput = document.querySelector("#search-input");
const resultsTitle = document.querySelector(".results__title");
const resultsMessage = document.querySelector(".results__message");
const showsEl = document.querySelector(".shows");
const sortSelect = document.querySelector("#sort");
const genreSelect = document.querySelector("#genre");

let shows = [];

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchShows(searchInput.value.trim());
});

sortSelect.addEventListener("change", renderShows);
genreSelect.addEventListener("change", renderShows);

async function searchShows(searchTerm) {
  if (!searchTerm) {
    shows = [];
    updateGenres();
    resultsTitle.textContent = "Search results";
    showsEl.innerHTML = "";
    resultsMessage.textContent = "Please type the name of a show.";
    return;
  }

  resultsTitle.textContent = `Search results for "${searchTerm}"`;
  resultsMessage.textContent = "";
  showSkeleton();

  try {
    const response = await fetch(API_URL + searchTerm);
    const data = await response.json();

    // only keep the first 6 shows
    shows = data.slice(0, 6).map((result) => result.show);

    updateGenres();

    if (shows.length === 0) {
      showsEl.innerHTML = "";
      resultsMessage.textContent = "No shows found. Try another title.";
      return;
    }

    renderShows();
  } catch (error) {
    showsEl.innerHTML = "";
    resultsMessage.textContent = "Something went wrong. Please try again.";
  }
}

function renderShows() {
  let list = shows.slice();

  if (genreSelect.value !== "ALL") {
    list = list.filter((show) => show.genres.includes(genreSelect.value));
  }

  if (sortSelect.value === "A_TO_Z") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "Z_TO_A") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortSelect.value === "NEWEST") {
    list.sort((a, b) => getYear(b) - getYear(a));
  } else if (sortSelect.value === "OLDEST") {
    list.sort((a, b) => getYear(a) - getYear(b));
  }

  showsEl.innerHTML = list.map((show) => showHTML(show)).join("");
}

// some shows don't have a premiere date, so treat them as year 0
function getYear(show) {
  return show.premiered ? Number(show.premiered.slice(0, 4)) : 0;
}

function updateGenres() {
  const genres = [];
  shows.forEach((show) => {
    show.genres.forEach((genre) => {
      if (!genres.includes(genre)) genres.push(genre);
    });
  });
  genreSelect.innerHTML =
    `<option value="ALL">All genres</option>` +
    genres.map((genre) => `<option value="${genre}">${genre}</option>`).join("");
}

function showSkeleton() {
  showsEl.innerHTML = new Array(6)
    .fill(`<div class="show">
      <div class="show__img skeleton"></div>
      <div class="skeleton skeleton__title"></div>
      <div class="skeleton skeleton__year"></div>
    </div>`)
    .join("");
}

function showHTML(show) {
  const poster = show.image ? show.image.medium : "assets/no-poster.svg";
  const year = show.premiered ? show.premiered.slice(0, 4) : "Unknown year";
  return `<div class="show">
    <img src="${poster}" class="show__img" alt="${show.name} poster">
    <h3 class="show__title">${show.name}</h3>
    <p class="show__year">${year}</p>
  </div>`;
}

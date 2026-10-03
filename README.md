# ShowFinder: TV Show Search

A one-page app for searching TV shows, built with HTML, CSS and vanilla JavaScript for the JavaScript final project of my web dev course. Type a show name, press Enter (or click the search button), and the first six matches from the TVmaze API show up as cards with their poster, title and the year they first aired.

Live site: https://beausterling.github.io/tv-show-search/

## Features

- Search bar that calls the TVmaze search API with `fetch` and `async`/`await`
- Shows the first 6 results as cards (fewer if fewer come back), each linking to the show's page on TVmaze
- Sort the results: best match, title A to Z, title Z to A, newest to oldest, oldest to newest
- Filter the results by genre (the dropdown is filled with the genres of the current results)
- Skeleton loading cards while the request is running
- Friendly messages for an empty search, a search with no results, and network or API errors
- Placeholder poster for shows with no image, and "Year unknown" for shows with no premiere date (those go to the end when sorting by date)
- Responsive layout: 6 cards per row on desktop, 3 on tablets and 2 on phones
- Keyboard friendly: a label on the search input, visible focus styles, and native form controls

## How it works

1. Submitting the search form calls `searchShows()`, which shows six skeleton cards and fetches `https://api.tvmaze.com/search/shows?q=<search term>`.
2. If `response.ok` is false, or the request fails, a `try`/`catch` shows an error message instead.
3. The first six results are simplified into objects (title, premiere date, year, poster, genres, link) and saved in a `shows` array.
4. `renderShows()` filters that array by the selected genre, sorts it with the selected option, and turns it into HTML with `map()` and `join("")`. Changing the sort or genre re-renders from the saved array without calling the API again.

## Run it locally

Clone the repo and open `index.html` with the Live Server extension in VS Code (or any local server, e.g. `python3 -m http.server`). There's no build step and no API key needed.

## Built with

- HTML, CSS and JavaScript
- [TVmaze API](https://www.tvmaze.com/api) (free, no key needed)
- [Font Awesome](https://fontawesome.com/) icons

Data from the TVmaze API, licensed under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).

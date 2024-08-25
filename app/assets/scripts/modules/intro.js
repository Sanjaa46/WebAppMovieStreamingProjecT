import Movie from './Movies.js';
import BookmarkedComponent from "../component/bookmark.js";

export default class Intro {
  constructor(movie) {
    this.poster = movie.poster;
    this.cover = movie.cover;
    this.studio = movie.studio;
    this.director = movie.director;
    this.actor = movie.actors[1];
    this.name = movie.name;
    this.age = movie.age;
    this.rating = movie.rating;
    this.since = movie.since;
    this.country = movie.country;
    this.duration = movie.duration;
    this.genre = movie.genre;
    this.trailer = movie.trailer;
    this.seasons = movie.seasons;
  }

  renderSeasons() {
    if (!this.seasons || this.seasons.length === 0) return '';
  
    let seasonsOptions = '';
    let episodesOptions = '';
  
    this.seasons.forEach(season => {
      seasonsOptions += `<option value="${season.season_number}">Season ${season.season_number}</option>`;
  
      if (season.season_number === 1) {
        season.episodes.forEach(episode => {
          episodesOptions += `<option value="${episode.episode_number}">Episode ${episode.episode_number}: ${episode.title}</option>`;
        });
      }
    });
  
    return `
      <form id="filterForm">
        <ul>
          <li class="filter-dropdown">
            <select id="season" name="season">
              ${seasonsOptions}
            </select>
          </li>
          <li class="filter-dropdown">
            <select id="episode" name="episode">
              ${episodesOptions}
            </select>
          </li>
        </ul>
      </form>`;
  }
  
  addSeasonChangeListener() {
    const seasonDropdown = document.getElementById('season');
    const episodeDropdown = document.getElementById('episode');

    seasonDropdown.addEventListener('change', (event) => {
      const selectedSeasonNumber = parseInt(event.target.value, 10);
      const selectedSeason = this.seasons.find(season => season.season_number === selectedSeasonNumber);
      
      if (selectedSeason) {
        let episodesOptions = '';
        selectedSeason.episodes.forEach(episode => {
          episodesOptions += `<option value="${episode.episode_number}">Episode ${episode.episode_number}: ${episode.title}</option>`;
        });
        episodeDropdown.innerHTML = episodesOptions;
      }
    });
  }

  render() {
    const genres = this.genre.join('/');
    const seasonsHtml = this.renderSeasons();
  
    return `
        <img src="${this.cover}" class="cover-image" />
        <div class="poster">
          <img src="${this.poster}" alt="movie-small-sized-poster" />
          <p class="procuder-actor-name">${this.director} | ${this.actor}</p>
        </div>
  
        <div class="intro-details">
          <h2>${this.name}</h2>
          <div class="movie-rating">
            <p class="age">${this.age}</p>
            <p class="rating">IMDB ${this.rating}</p>
            <p class="since">${this.since}</p>
            <p class="origin">${this.country}</p>
            <p class="movie-duration">${this.duration} Мин</p>
          </div>
          <div>
            <p class="movie-genre">${genres}</p>
            <p class="introduction">
              Street-smart Nathan Drake (Tom Holland) is recruited by seasoned
              treasure hunter Victor "Sully" Sullivan (Mark Wahlberg) to recover
              a fortune amassed by Ferdinand Magellan and lost 500 years ago by
              the House of Moncada. What starts as a heist job for the duo
              becomes a globe-trotting, white-knuckle race to reach the prize
              before the ruthless Santiago Moncada (Antonio Banderas), who
              believes he and his family are the rightful heirs.
            </p>
          </div>
          ${seasonsHtml}
          <div class="buttons">
            <button class="show-button">
              <span class="glyphicon glyphicon-play"></span> Үзэх
            </button>
            <div class="other-icons">
              <a><span class="glyphicon glyphicon-bookmark" id="bookmark"></span></a>
              <a><span class="glyphicon glyphicon-comment" id="comment"></span></a>
              <a><span class="glyphicon glyphicon-film" id="trailer"></span></a>
            </div>
          </div>
        </div>
        <div>
          <button class="report">report</button>
        </div>`;
  }
}

async function renderMovie() {
  let moviesData = '';
  const movie = await searchMovies();

  const mov = new Intro(movie);
  moviesData = mov.render();
  const movieContainer = document.querySelector(".intro-movie");
  movieContainer.innerHTML = moviesData;

  // Attach the event listener for season change
  mov.addSeasonChangeListener();

  const recommendations = await filterMoviesByGenres();
  recommendations.sort((a, b) => b.since - a.since);

  let recommendationsData = '';
  let i = 0;
  while (i < 12) {
    const rec = new Movie(recommendations[i]);
    recommendationsData += rec.render();
    i++;
  }
  document.querySelector(".movies-container-12").insertAdjacentHTML("beforeend", recommendationsData);
}

async function fetchMovies() {
  try {
    const response = await fetch('https://api.jsonbin.io/v3/b/6645bc42e41b4d34e4f48a87');
    const jsonResponse = await response.json();
    const data = jsonResponse.record;

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function searchMovies() {
  const movies = await fetchMovies();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const searchedMovie = movies.find(movie => movie.name.toLowerCase() === name.toLowerCase());
  return searchedMovie;
}

document.addEventListener('DOMContentLoaded', renderMovie);


async function filterMoviesByGenres() {
  const movies = await fetchMovies();
  const urlParams = new URLSearchParams(window.location.search);
  const genreParam = urlParams.get('genre');
  const genres = genreParam ? genreParam.split(',') : [];
  const filteredMovies = movies.filter(movie => {
    return genres.some(genre => movie.genre.includes(genre.trim()));
  });
  return filteredMovies;
}



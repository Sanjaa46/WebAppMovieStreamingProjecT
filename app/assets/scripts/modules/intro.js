import Movie from './Movies.js';
import BookmarkedComponent from "../component/bookmark.js";
import { fetchAllMovies, fetchMovieById } from '../webapi/api.js';

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
  const urlParams = new URLSearchParams(window.location.search);
  const movieName = urlParams.get('name');

  const movies = await fetchAllMovies();
  const movie = movies.find(m => m.name.toLowerCase() === movieName.toLowerCase());

  if (movie) {
    const mov = new Intro(movie);
    document.querySelector(".intro-movie").innerHTML = mov.render();
    mov.addSeasonChangeListener();
  }

  // Example of filtering by genres
  const genreParam = urlParams.get('genre');
  if (genreParam) {
    const recommendations = movies.filter(movie => movie.genre.includes(genreParam.trim()));
    recommendations.sort((a, b) => b.since - a.since);

    let recommendationsData = '';
    let i = 0;
    while (i < 12 && i < recommendations.length) {
      const rec = new Movie(recommendations[i]);
      recommendationsData += rec.render();
      i++;
    }
    document.querySelector(".movies-container-12").insertAdjacentHTML("beforeend", recommendationsData);
  }
}

document.addEventListener('DOMContentLoaded', renderMovie);

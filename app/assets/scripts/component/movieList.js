import Movie from '../modules/Movies.js'

export default class MovieListComponent extends HTMLElement {
  static get observedAttributes() {
    return ['movies'];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    this.movies = [];

    shadowRoot.innerHTML = `
        <style>
        :root {
            --color-background: #0a0a0a;
            --color-button: #ff770b;
            --color-gray-button: #1c1c1c;
            --color-gray: #6c6c6c;
            --height-header: 64px;
            --color-gray-font: #808080;
            --color-white-font: #ffffff;
            --color-filter-gray: #3333338d;
            --color-footer: ;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            color: rgba(255, 255, 255);
          }
          
          body {
            justify-content: center;
            align-items: center;
            background-color: var(--color-background);
          }
        .header-of-movies {
            width: 70%;
            height: 100px;
            margin: 0 auto;
            display: flex;
            align-items: center;
          }
          
          .header-of-movies h2 {
            margin-right: auto;
          }
          
          .header-of-movies .links {
            display: flex;
            align-items: center;
            margin-left: auto;
          }
          
          .header-of-movies .links a {
            margin-right: 10px;
          }
          
          .movies-container-12 {
            width: 70%;
            align-items: center;
            margin: 0 auto 50px auto;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            grid-auto-rows: auto;
            gap: 20px;
          }
          
          .movies-poster-12 {
            width: 70%;
            height: auto;
            margin: 0 auto;
          }
          
          .movie-small-sized {
            position: relative;
            width: 210px;
            height: 300px;
            border-radius: 10px;
            box-shadow: 0 15px 35px rgba(255, 255, 255, 0.25);
            overflow: hidden;
          }
          
          .movie-small-sized .poster img {
            width: 100%;
            transition: 0.5s;
          }
          
          .movie-small-sized .poster {
            position: relative;
            overflow: hidden;
          }
          
          .movie-small-sized .poster::before {
            content: "";
            position: absolute;
            bottom: -180px;
            width: 100%;
            height: 100%;
            background: linear-gradient(0deg, #0e0d0d, 80%, transparent);
            transition: 0.5s;
            z-index: 1;
          }
          
          .movie-small-sized:hover .poster::before {
            bottom: 0px;
          }
          
          .movie-small-sized:hover .poster {
            transition: 0.5s;
            transform: translateY(-50px);
            filter: blur(5px);
          }
          
          .movie-small-sized .details {
            position: absolute;
            align-items: center;
            bottom: -40px;
            left: 0;
            padding: 20px;
            width: 100%;
            z-index: 2;
            transition: 0.5s;
            background: transparent;
          }
          
          .movie-small-sized .rank {
            font-size: 20px;
            font-weight: bold;
            font-style: italic;
            position: absolute;
            z-index: 2;
            top: 0;
            left: 10px;
          }
          
          .movie-small-sized:hover .details {
            bottom: 40px;
          }
          
          .movie-small-sized .details img {
            height: 15px;
            width: 15px;
          }
          
          .movie-small-sized .details h3 {
            font-size: 19px;
            background: transparent;
          }
          
          .movie-small-sized .details p {
            font-size: 14px;
            background: transparent;
          }
          
          .movie-small-sized .details .info {
            font-size: 12px;
            margin-top: 10px;
            background: transparent;
          }
          
          @media (max-width: 1730px) {
            .movies-container-12 {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
            }
            .movie-small-sized {
              width: 200px;
              height: 270px;
            }
          }
          
          @media (max-width: 1358px) {
            .movies-container-12 {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
            }
            .movie-small-sized {
              width: 170px;
              height: 250px;
            }
            .movie-big-sized-poster {
              width: 100%;
              height: 100%;
            }
            .movie-big-sized .slider-item-details {
              display: none;
            }
            .slider-nav {
              display: none;
            }
          }
          
          @media (max-width: 891px) {
            .menu {
              display: none;
            }
            .hamburger-header {
              display: flex;
            }
            .movies-container-12 {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
            }
            .movie-small-sized {
              width: 150px;
              height: 220px;
            }
          }
          
          @media (max-width: 448px) {
            .menu {
              display: none;
            }
            .hamburger-header {
              display: flex;
            }
            .movies-container-12 {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
            }
          
            .movies-poster-12 {
              margin: 0 auto;
              width: 90%;
            }
          
            .header-of-movies h2 {
              font-size: 15px;
            }
          
            .movie-small-sized {
              width: 130px;
              height: 220px;
            }
          
            .movie-small-sized .info {
              display: none;
            }
          
            .movie-small-sized .details {
              bottom: -20px;
            }
            .movie-small-sized .details .year-and-duration {
              font-size: 12px;
            }
            .movie-small-sized .details .movie-icon {
              width: 10px;
              height: 10px;
            }
          }
        </style>
        <div id="movie-list" class="movies-container-12">
          <slot></slot>
        </div>
      `;
  }

  connectedCallback() {
    this.renderMovies();
    this.addEventListener('bookmarked', this.handleBookmark.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('bookmarked', this.handleBookmark.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'movies' && oldValue !== newValue) {
      this.movies = JSON.parse(newValue);
      this.renderMovies();
    }
  }

  renderMovies() {
    const movieContainer = this.shadowRoot.getElementById('movie-list');
    let moviesData = '';

    this.movies.forEach(movie => {
      const mov = new Movie(movie);
      moviesData += mov.render();
    });

    movieContainer.innerHTML = moviesData;
  }

  set movies(value) {
    this.setAttribute('movies', JSON.stringify(value));
  }

  get movies() {
    return JSON.parse(this.getAttribute('movies')) || [];
  }
  // TODO: bookmark fucntion ajildag bolgoh
  handleBookmark(event) {
    const bookmarkedMovieNames = event.detail.movies;
    const bookmarkedMovies = this.movies.filter(movie => bookmarkedMovieNames.includes(movie.name));
    this.renderMovies(bookmarkedMovies);
  }
  // FIXME: Bookmark function-g ajildag bolgoh
}

customElements.define('movie-list', MovieListComponent);

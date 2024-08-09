export default class FilterComponent extends HTMLElement {
  movies = [];
  filteredMovies = [];

  constructor() {
    super();
    this.fetchMovies();
  }

  connectedCallback() {
    this.render();
    const form = this.querySelector('#filterForm');
    if (form) {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    this.fetchMovies().then(() => {
      this.applyUrlFilters();
    });
  }

  applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'all';
    const country = urlParams.get('country') || 'all';
    const age = urlParams.get('age') || 'all';
    const genre = urlParams.get('genre') || 'all';
    const rating = urlParams.get('rating') || 'all';
    const name = urlParams.get('name') || '';

    console.log(type);

    this.filteredMovies = this.filterMovies(type, country, age, genre, rating, name);
    this.renderMovies();
    this.updateTitle();
  }

  async fetchMovies() {
    try {
      const response = await fetch('https://api.jsonbin.io/v3/b/6645bc42e41b4d34e4f48a87');
      this.movies = await response.json();
      this.movies = this.movies.record;
      this.filteredMovies = [...this.movies];
    } catch (error) {
      console.error('Error fetching data:', error);
      this.movies = [];
      this.filteredMovies = [];
    }
  }

  renderMovies() {
    const movieList = document.querySelector('movie-list');
    if (!movieList) return;
    movieList.movies = this.filteredMovies;
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const type = this.querySelector('#type').value;
    const country = this.querySelector('#country').value;
    const age = this.querySelector('#age').value;
    const genre = this.querySelector('#genre').value;
    const rating = this.querySelector('#rating').value;
    const name = this.querySelector('#name').value;

    this.filteredMovies = this.filterMovies(type, country, age, genre, rating, name);
    this.renderMovies();
    this.updateUrlParams({ type, country, age, genre, rating, name });
    this.updateTitle();
  }

  filterMovies(type, country, age, genre, rating, name) {
    return this.movies.filter(movie => {
      if (type !== 'all' && movie.type !== type) return false;
      if (country !== 'all' && movie.country !== country) return false;
      if (age !== 'all' && movie.age !== age) return false;
      if (genre !== 'all' && !movie.genre.includes(genre)) return false;
      if (rating !== 'all') {
        const [minRating, maxRating] = rating.split('-');
        if (movie.rating < parseInt(minRating) || movie.rating > parseInt(maxRating)) return false;
      }
      if (name && !movie.name.toLowerCase().includes(name.toLowerCase())) return false;
      return true;
    });
  }

  updateUrlParams(params) {
    const urlParams = new URLSearchParams(window.location.search);
    for (const key in params) {
      if (params[key] === 'all') {
        urlParams.delete(key);
      } else {
        urlParams.set(key, params[key]);
      }
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  updateTitle() {
    const titleOfMovies = this.querySelector('.filter .title');
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'all';

    this.querySelector('#number-of-movies').textContent = `${this.filteredMovies.length} кинонууд`;

    switch (type) {
      case 'movie':
        titleOfMovies.textContent = 'Кино';
        break;
      case 'series':
        titleOfMovies.textContent = 'Цуврал';
        break;
      case 'tv_show':
        titleOfMovies.textContent = 'ТВ шоу';
        break;
      default:
        titleOfMovies.textContent = 'Үр дүн';
        break;
    }
  }

  render() {
    this.innerHTML = `<style>
    .filter {
      width: 80%;
      margin: 0 auto;
    }
    
    .filter ul {
      list-style: none;
      display: flex;
      gap: 30px;
      padding: 20px 70px 5px;
      font-size: 18px;
      align-items: center;
    }
    
    .filter > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 60px;
      border-bottom: 1px solid white;
      width: 100%;
      max-width: 1350px;
      margin: 0 auto;
    }
    
    .filter .title {
      font-size: 20px;
    }
    .search-middle {
      display: flex;
      width: 300px;
      height: 33px;
      padding: 5px 10px;
      align-items: center;
      background-color: var(--color-gray);
      border-radius: 20px;
    }
    
    .filter-dropdown option {
      background-color: rgba(108, 108, 108);
      font-size: 20px;
    }
    
    .filter-dropdown select {
      background-color: transparent;
      width: 200px;
      height: 40px;
      border-radius: 10px;
      border: none;
    }
    
    .filter ul button {
      color: var(--color-button);
    }
    
    .filter li > button.filter-button {
      background-color: var(--color-button);
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px 15px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      width: 105px;
      height: 35px;
    }
    
    .filter li > button.filter-button:hover {
      background-color: white;
      color: #595959;
    }
    
    .filter #name {
      background-color: transparent;
      border: none;
    }
    
    /* Pagination */
    .pagination {
      padding-top: 20px;
      text-align: center;
    }
    
    .pagination a {
      color: white;
      text-decoration: none;
      padding: 10px;
      display: inline-block;
    }
    
    .pagination a.active {
      background-color: grey;
      font-weight: bold;
      border-radius: 5px;
    }
    
    .pagination a:hover:not(.active) {
      background-color: #555;
      border-radius: 5px;
    }
    @media (max-width: 1024px) {
        .filter ul {
            gap: 10px;
            display: grid;
            grid-template-columns: 200px 200px 200px;
            grid-template-rows: auto auto auto;
            grid-template-areas:
                "search-middle filter-dropdown-1 filter-dropdown-2"
                "filter-dropdown-3 filter-dropdown-4 filter-dropdown-5"
                "filter-button filter-button filter-button";
            justify-items: stretch;
            padding: 5px;
        }

        .filter > div {
            padding: 10px 30px;
        }

        .search-middle {
            width: 200px;
        }

        .filter-dropdown select {
            width: 180px;
            font-size: 18px;
        }

        .filter li > button.filter-button {
            width: 95px;
            height: 30px;
            font-size: 14px;
        }
    }

    @media (max-width: 767px) {
      .filter ul {
          gap: 10px;
          display: grid;
          grid-template-columns: 200px 200px;
          grid-template-rows: auto;
          grid-template-areas:
              "search-middle filter-dropdown-1"
              "filter-dropdown-2 filter-dropdown-3"
              "filter-dropdown-4 filter-dropdown-5"
              "filter-button filter-button";
          justify-items: stretch;
          padding: 5px;
      }

        .filter > div {
            padding: 10px 20px;
        }

        .search-middle {
            width: 200px;
        }

        .filter-dropdown select {
            width: 160px;
            font-size: 16px;
        }

        .filter li > button.filter-button {
            width: 90px;
            height: 28px;
            font-size: 13px;
        }
    }
    @media (max-width: 480px) {
      .filter ul {
          gap: 5px;
          display: grid;
          grid-template-columns: 160px 160px;
          grid-template-rows: auto;
          grid-template-areas:
              "search-middle filter-dropdown-1"
              "filter-dropdown-2 filter-dropdown-3"
              "filter-dropdown-4 filter-dropdown-5"
              "filter-button filter-button";
          justify-items: stretch;
          padding: 5px;
      }
      
      .filter > div {
          padding: 10px 10px;
      }

      .search-middle {
          width: 160px;
          padding: 5px 10px;
          border-radius: 5px;
      }

      .filter-dropdown select {
          width: 150px;
          font-size: 14px;
      }

      .filter li > button.filter-button {
          width: 80px;
          height: 25px;
          font-size: 12px;
      }

      .pagination a {
          padding: 5px;
          font-size: 14px;
      }
    }



    </style>
    
    <section class="filter">
      <div>
        <p><strong class="title"></strong></p>
        <p id="number-of-movies">7600 кинонууд</p>
      </div>
      <form id="filterForm">
        <ul>
          <li class="search-middle">
            <img src="assets/images/search.png" alt="search-icon" class="search-icon" />
            <input type="text" name="name" id="name" class="search-input" placeholder="Хайх..." />
          </li>
          <li class="filter-dropdown">
            <select id="type" name="type">
              <option value="all">Сонголт</option>
              <option value="movie">Кино</option>
              <option value="tv_show">ТВ шоу</option>
              <option value="series">Цуврал</option>
            </select>
          </li>
          <li class="filter-dropdown">
            <select id="country" name="country">
              <option value="all">Улс</option>
              <option value="Mongolia">Монгол</option>
              <option value="United States">Америк</option>
              <option value="Japan">Япон</option>
              <option value="Korea">Солонгос</option>
              <option value="Poland">Польш</option>
              <option value="United Kingdom">Их Британи</option>
            </select>
          </li>
          <li class="filter-dropdown">
            <select id="age" name="age">
              <option value="all">Насны ангилал</option>
              <option value="13+">13+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
              <option value="R">R</option>
              <option value="PG-13">PG-13</option>
              <option value="PG">PG</option>
              <option value="E10+">E10+</option>
              <option value="G">G</option>
            </select>
          </li>
          <li class="filter-dropdown">
            <select id="genre" name="genre">
              <option value="all">Төрөл</option>
              <option value="Adventure">Адал явдалт</option>
              <option value="Horror">Аймшгийн</option>
              <option value="Thriller">Аллага</option>
              <option value="Western">Вестерн</option>
              <option value="Crime">Гэмт хэрэгт</option>
              <option value="Family">Гэр бүлийн</option>
              <option value="War">Дайны</option>
              <option value="Drama">Драм</option>
              <option value="Comedy">Инээдмийн</option>
              <option value="Music">Мюзикл</option>
              <option value="Action">Тулаант</option>
              <option value="History">Түүхэн</option>
              <option value="Fairy">Үлгэрийн</option>
              <option value="Fantasy">Зөгнөлт</option>
              <option value="Animation">Хүүхэлдэйн кино</option>
              <option value="Sci-Fi">Ш/У уран зөгнөлт</option>
            </select>
          </li>
          <li class="filter-dropdown">
            <select id="rating" name="rating">
              <option value="all">Үнэлгээ</option>
              <option value="8-10">8-10</option>
              <option value="6-8">6-8</option>
              <option value="4-6">4-6</option>
              <option value="2-4">2-4</option>
              <option value="0-2">0-2</option>
            </select>
          </li>
          <li>
            <button type="submit" class="filter-button">Хайх</button>
          </li>
        </ul>
      </form>
    </section>`;
  }
}

customElements.define("filter-component", FilterComponent);

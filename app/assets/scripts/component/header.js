import BookmarkedComponent from "./bookmark.js";
window.customElements.define('bookmarked-component', BookmarkedComponent);

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.isLoggedIn = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const hamMenu = this.querySelector('.ham-menu');
    const offScreenMenu = this.querySelector('.off-screen-menu');

    hamMenu.addEventListener('click', () => {
      hamMenu.classList.toggle('active');
      offScreenMenu.classList.toggle('active');
    });

    const loginButton = this.querySelector('.login-button');
    const closeButton = this.querySelector('.close-btn');
    const profileButton = this.querySelector('.profile');
    const profilePopup = this.querySelector('.profile-popup');

    loginButton.addEventListener('click', () => {
      this.querySelector('.popup').style.display = "flex";
    });

    closeButton.addEventListener('click', () => {
      this.querySelector('.popup').style.display = "none";
    });

    profileButton.addEventListener('click', () => {
      profilePopup.style.display = "flex";
    });

    document.addEventListener('click', (event) => {
      if (!profilePopup.contains(event.target) && !profileButton.contains(event.target)) {
        profilePopup.style.display = "none";
      }
    });

    if (this.isLoggedIn) {
      this.querySelector('.login-button').style.display = "none";
      this.querySelector('.profile').style.display = "flex";
    } else {
      this.querySelector('.login-button').style.display = "flex";
      this.querySelector('.profile').style.display = "none";
    }

    this.querySelector('.search-container').addEventListener('submit', (event) => {
      event.preventDefault();
      const searchInput = this.querySelector('.search-container input[name="name"]');
      const searchQuery = searchInput.value.trim();

      if (searchQuery) {
        window.location.href = `movies.html?name=${encodeURIComponent(searchQuery)}`;
      } else {
        window.location.href = 'movies.html';
      }
    });

    document.getElementById('toggle-signup').addEventListener('click', function () {
      document.querySelector('.login-popup').style.display = 'none';
      document.querySelector('.signup-popup').style.display = 'block';
    });

    document.getElementById('toggle-login').addEventListener('click', function () {
      document.querySelector('.signup-popup').style.display = 'none';
      document.querySelector('.login-popup').style.display = 'block';
    });

    document.querySelectorAll('.close-btn img').forEach(function (element) {
      element.addEventListener('click', function () {
        document.querySelector('.popup').style.display = 'none';
      });
    });

  }

  render() {
    this.innerHTML = `
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
        header {
            margin-top: 20px;
          }
          
          .menu {
            height: 64px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: center;
            padding: 10px 50px 10px 50px;
          }
          
          .hamburger-header {
            display: flex;
            height: 40px;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            padding: 10px;
          }
          
          .hamburger-header {
            display: none;
          }
          
          .hamburger-header .login-button {
            color: rgba(255, 255, 255);
            background-color: var(--color-gray);
            align-items: center;
            justify-content: center;
            display: flex;
            height: 45px;
            width: 100px;
            border-radius: 15px;
            text-decoration: none;
          }
          
          .hamburger-header .login-button .login-image {
            display: none;
          }
          .logged-in {
            background-color: none;
          }

          .off-screen-menu {
            background-color: rgba(117, 117, 117, 0.7);
            width: fit-content;
            height: fit-content;
            position: fixed;
            top: 0;
            left: -450px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 16px;
            transition: 0.3s ease;
            border-radius: 10px;
            z-index: 1;
          }
          
          .nav-container-burger {
            list-style: none;
          }
          
          .nav-container-burger li a {
            text-decoration: none;
          }
          
          .off-screen-menu.active {
            position: absolute;
            left: 10px;
            top: 64px;
          }
          
          .hamburger-header .nav {
            padding: 5px;
            display: flex;
          }
          
          .ham-menu {
            width: 100%;
            height: 40px;
            margin-left: auto;
            position: relative;
          }
          
          .hamburger-header nav {
            padding: 3px;
            display: flex;
          }
          
          .ham-menu {
            width: 50px;
            height: 50px;
            margin-left: auto;
            position: relative;
          }
          
          .ham-menu span {
            height: 5px;
            width: 100%;
            background-color: white;
            border-radius: 25px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: 0.3s ease;
          }
          
          .ham-menu span:nth-child(1) {
            top: 25%;
          }
          
          .ham-menu span:nth-child(3) {
            top: 75%;
          }
          
          .ham-menu.active span:nth-child(1) {
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
          
          .ham-menu.active span:nth-child(2) {
            opacity: 0;
          }
          
          .ham-menu.active span:nth-child(3) {
            top: 50%;
            transform: translate(-50%, 50%) rotate(-45deg);
          }
          
          .dropdown-menu-burger ul {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            list-style: none;
            padding: 10px;
            gap: 5px;
            border-radius: 5px;
            background-color: rgba(0, 0, 0, 0.4);
          }
          
          .dropdown-menu-burger {
            display: none;
          }
          
          .nav-list-burger:hover .dropdown-menu-burger {
            display: block;
          }
          
          .nav-list-burger {
            margin: 10px;
          }
          
          #search-mobile {
            height: 25px;
            width: 25px;
          }
          
          #search-mobile img {
            height: 100%;
            width: 100%;
          }
          
          #logo {
            text-decoration: none;
            font-size: 30px;
            color: orange;
          }
          
          .nav-container {
            list-style: none;
            display: flex;
          }
          
          .nav-list {
            padding: 10px 30px;
            cursor: pointer;
          }
          
          .nav-list a {
            color: var(--color-gray-font);
            text-decoration: none;
            font-size: 20px;
            transition: all 0.3s;
          }
          
          .nav-list a:hover {
            color: rgba(255, 255, 255);
            text-decoration: none;
            font-size: 20;
          }
          
          .dropdown-menu {
            display: none;
            position: absolute;
            background-color: var(--color-gray);
            z-index: 3;
            columns: 2;
            border-radius: 10px;
          }
          
          .dropdown-menu a {
            color: rgba(255, 255, 255, 0.5);
            padding: 12px 16px;
          }
          
          .nav-list:hover .dropdown-menu {
            display: block;
            position: absolute;
            left: 700;
            color: rgba(255, 255, 255, 0.5);
            background-color: var(--color-gray);
            margin-top: 5px;
            border-radius: 10px;
            z-index: 2;
          }
          
          .dropdown-menu ul {
            list-style: none;
            display: block;
            margin: 10px;
          }
          
          .dropdown-menu ul li a:hover {
            color: rgba(255, 255, 255);
          }
          
          .dropdown-menu ul li {
            background-color: var(--color-gray);
          }
          
          .dropdown-menu ul li a {
            display: block;
            width: 125px;
            font-size: 17px;
          }
          
          .search-container {
            display: flex;
            width: 315px;
            height: 33px;
            padding: 5px 10px;
            align-items: center;
            background-color: var(--color-gray);
            border-radius: 20px;
          }
          
          .search-input {
            outline: none;
            border: none;
            font-weight: 500;
            background-color: transparent;
          }
          
          .search-icon {
            height: 20px;
            width: 20px;
            margin-right: 5px;
          }
          
          ::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.25);
          }
          
          .login-button {
            color: rgba(255, 255, 255);
            background-color: var(--color-gray);
            align-items: center;
            justify-content: center;
            display: flex;
            height: 46px;
            width: 137px;
            border-radius: 15px;
            cursor: pointer;
            text-decoration: none;
          }
          
          .login-image {
            background-color: transparent;
          }
          
          @media (max-width: 891px) {
            .menu {
              display: none;
            }
            .hamburger-header {
              display: flex;
            }
          }
          
          @media (max-width: 448px) {
            .menu {
              display: none;
            }
            .hamburger-header {
              display: flex;
            }
          }
        </style>
        <header class="menu">
        <a href="index.html" id="logo">Logo Movie</a>
        <nav>
            <ul class="nav-container">
                <li class="nav-list">
                    <a href="#">Төрөл</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="movies.html?genre=Adventure">Адал явдалт</a></li>
                            <li><a href="movies.html?genre=Horror">Аймшгийн</a></li>
                            <li><a href="movies.html?genre=Thriller">Аллага</a></li>
                            <li><a href="movies.html?genre=Western">Вестерн</a></li>
                            <li><a href="movies.html?genre=Crime">Гэмт хэрэгт</a></li>
                            <li><a href="movies.html?genre=Family">Гэр бүлийн</a></li>
                            <li><a href="movies.html?genre=War">Дайны</a></li>
                            <li><a href="movies.html?genre=Drama">Драм</a></li>
                            <li><a href="movies.html?genre=Comedy">Инээдмийн</a></li>
                            <li><a href="movies.html?genre=Music">Мюзикл</a></li>
                            <li><a href="movies.html?genre=Action">Тулаант</a></li>
                            <li><a href="movies.html?genre=History">Түүхэн</a></li>
                            <li><a href="movies.html?genre=Fairy">Үлгэрийн</a></li>
                            <li><a href="movies.html?genre=Fantasy">Зөгнөлт</a></li>
                            <li>
                                <a href="movies.html?genre=Animation">Хүүхэлдэйн кино</a>
                            </li>
                            <li><a href="movies.html?genre=Sci-Fi">Ш/У уран зөгнөлт</a></li>
                        </ul>
                    </div>
                </li>
                <li class="nav-list"><a id="movies-option" href="movies.html?type=movie" data-type="movie">Кино</a></li>
                <li class="nav-list"><a id="series-option" href="movies.html?type=series" data-type="series">Цуврал</a></li>
                <li class="nav-list"><a id="tv-shows-option" href="movies.html?type="tv_show" data-type="tv_show">ТВ шоу</a></li>
            </ul>
        </nav>
        <form class="search-container">
            <img
              src="assets/images/search.png"
              alt="search-icon"
              class="search-icon"
            />
            <input
              type="text"
              name="name"
              id=""
              class="search-input"
              placeholder="Хайх..."
            />
          </form>
        <a href="#" class="login-button">Нэвтрэх
            <img src="assets/images/login-image.png" alt="login" class="login-image" height="30" width="30" />
        </a>
        <img src="assets/images/user.png" alt="login" class="profile" height="30" width="30" />
    </header>

    <header class="hamburger-header">
        <div class="off-screen-menu">
            <ul class="nav-container-burger">
                <li class="nav-list-burger">
                    <a href="#">Төрөл</a>
                    <div class="dropdown-menu-burger">
                        <ul>
                            <li><a href="movies.html?genre=Adventure">Адал явдалт</a></li>
                            <li><a href="movies.html?genre=Horror">Аймшгийн</a></li>
                            <li><a href="movies.html?genre=Thriller">Аллага</a></li>
                            <li><a href="movies.html?genre=Western">Вестерн</a></li>
                            <li><a href="movies.html?genre=Crime">Гэмт хэрэгт</a></li>
                            <li><a href="movies.html?genre=Family">Гэр бүлийн</a></li>
                            <li><a href="movies.html?genre=War">Дайны</a></li>
                            <li><a href="movies.html?genre=Drama">Драм</a></li>
                            <li><a href="movies.html?genre=Comedy">Инээдмийн</a></li>
                            <li><a href="movies.html?genre=Music">Мюзикл</a></li>
                            <li><a href="movies.html?genre=Action">Тулаант</a></li>
                            <li><a href="movies.html?genre=History">Түүхэн</a></li>
                            <li><a href="movies.html?genre=Fairy">Үлгэрийн</a></li>
                            <li><a href="movies.html?genre=Fantasy">Зөгнөлт</a></li>
                            <li>
                                <a href="movies.html?genre=Animation">Хүүхэлдэйн кино</a>
                            </li>
                            <li><a href="movies.html?genre=Sci-Fi">Ш/У уран зөгнөлт</a></li>
                        </ul>
                    </div>
                </li>
                <li class="nav-list"><a id="movies-option" href="movies.html" data-type="movie">Кино</a></li>
                <li class="nav-list"><a id="series-option" href="movies.html" data-type="series">Цуврал</a></li>
                <li class="nav-list"><a id="tv-shows-option" href="movies.html" data-type="tv_show">ТВ шоу</a></li>
            </ul>
        </div>

        <nav>
            <div class="ham-menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>

        <a href="index.html" id="logo">Logo Movie</a>
        <a id="search-mobile"><img src="assets/images/search.png" alt="search-icon" class="search-icon"></a>
        <a href="#" class="login-button">Нэвтрэх
            <img src="assets/images/login-image.png" alt="login" class="login-image" height="30" width="30" />
        </a>
        <a href="#" class="profile">
          <img src="assets/images/user.png" alt="login" height="30" width="30" />
        </a>
    </header>
    <div class="popup">
      <section class="login-popup">
          <div class="close-btn">
              <img src="assets/images/Cancel.png" alt="close-btn">
          </div>
          <article class="form">
              <h2>Нэвтрэх</h2>
              <div class="form-element">
                  <input type="text" id="email" placeholder="Email-ээ оруулна уу">
              </div>
              <div class="form-element">
                  <input type="password" id="password" placeholder="Нууц үгээ оруулна уу">
              </div>
              <div class="form-element">
                  <a href="#">Нууц үгээ мартсан уу?</a>
              </div>
              <div class="form-element">
                  <button>Нэвтрэх</button>
              </div>
              <div class="form-element">
                  <a href="#" id="toggle-signup">Бүртгүүлэх</a>
              </div>
          </article>
      </section>

      <section class="signup-popup" style="display: none;">
          <div class="close-btn">
              <img src="assets/images/Cancel.png" alt="close-btn">
          </div>
          <article class="form">
              <h2>Бүртгүүлэх</h2>
              <div class="form-element">
                  <input type="text" id="signup-email" placeholder="Email-ээ оруулна уу">
              </div>
              <div class="form-element">
                  <input type="password" id="signup-password" placeholder="Нууц үгээ оруулна уу">
              </div>
              <div class="form-element">
                  <input type="password" id="confirm-password" placeholder="Нууц үгээ дахин оруулна уу">
              </div>
              <div class="form-element">
                  <button>Бүртгүүлэх</button>
              </div>
              <div class="form-element">
                  <a href="#" id="toggle-login">Нэвтрэх</a>
              </div>
          </article>
      </section>
  </div>

    <div class="profile-popup">
        <ul>
            <li class="profile-option"><a href="intro.html"><img src="assets/images/continue.png" alt="continue">Үргэлжлүүлэн үзэх</a></li>
            <bookmarked-component></bookmarked-component>
            <li class="profile-option"><a href="movies.html"><img src="assets/images/History.png" alt="History">Үзсэн</a></li>
            <li class="profile-option"><a href="#"><img src="assets/images/logout.png" alt="logout">Гарах</a></li>
        </ul>
    </div>`;
  };

}

customElements.define("header-component", HeaderComponent);


// Event listener for the search form on index.html
document.querySelector('.search-container').addEventListener('submit', async function (event) {
  event.preventDefault();
  const searchInput = document.querySelector('.search-container input[name="name"]');
  const searchQuery = searchInput.value.trim();

  if (searchQuery) {
    window.location.href = `movies.html?name=${encodeURIComponent(searchQuery)}`;
  } else {
    // If the search query is empty, redirect to movies.html without any parameters
    window.location.href = 'movies.html';
  }
});
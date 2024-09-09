import BookmarkedComponent from "./bookmark.js";
window.customElements.define('bookmarked-component', BookmarkedComponent);

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.isLoggedIn = false;
  }

  async connectedCallback() {
    await this.checkLoginStatus();
    this.render();
    this.setupEventListeners();
  }

  async checkLoginStatus() {
    try {
      const response = await fetch('/api/user/status');
      if (response.ok) {
        const data = await response.json();
        this.isLoggedIn = data.isLoggedIn;
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }

  setupEventListeners() {
    const hamMenu = this.querySelector('.ham-menu');
    const offScreenMenu = this.querySelector('.off-screen-menu');
    const loginButton = this.querySelector('.login-button');
    const profileButton = this.querySelector('.profile');
    const profilePopup = this.querySelector('.profile-popup');
    const logoutButton = this.querySelector('.profile-popup .profile-option a[href="#"]');

    if (logoutButton) {
      logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('/api/user/logout', { method: 'POST' });
          if (response.ok) {
            window.location.reload();
          } else {
            alert('Logout failed');
          }
        } catch (error) {
          console.error('Error logging out:', error);
        }
      });
    }

    if (hamMenu && offScreenMenu) {
      hamMenu.addEventListener('click', () => {
        hamMenu.classList.toggle('active');
        offScreenMenu.classList.toggle('active');
      });
    }

    if (loginButton) {
      loginButton.addEventListener('click', () => {
        this.querySelector('.popup').style.display = "flex";
      });
    }

    this.querySelectorAll('.close-btn img').forEach((element) => {
      element.addEventListener('click', () => {
        this.querySelector('.popup').style.display = 'none';
      });
    });

    if (profileButton) {
      profileButton.addEventListener('click', () => {
        profilePopup.style.display = "flex";
      });
    }

    document.addEventListener('click', (event) => {
      if (profilePopup && !profilePopup.contains(event.target) && !profileButton.contains(event.target)) {
        profilePopup.style.display = "none";
      }
    });

    if (this.isLoggedIn) {
      if (loginButton) loginButton.style.display = "none";
      if (profileButton) profileButton.style.display = "flex";
    } else {
      if (loginButton) loginButton.style.display = "flex";
      if (profileButton) profileButton.style.display = "none";
    }

    const searchForm = this.querySelector('.search-container');
    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchInput = searchForm.querySelector('input[name="name"]');
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
          window.location.href = `movies.html?name=${encodeURIComponent(searchQuery)}`;
        } else {
          window.location.href = 'movies.html';
        }
      });
    }

    const loginFormButton = this.querySelector('.login-popup button');
    if (loginFormButton) {
      loginFormButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;

        try {
          const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              window.location.reload();
            } else {
              alert('Login failed: ' + data.message);
            }
          } else {
            const errorText = await response.text();
            console.error('Login failed:', errorText);
            alert('Login request failed');
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
      });
    }

    document.getElementById('toggle-signup').addEventListener('click', () => {
      document.querySelector('.login-popup').style.display = 'none';
      document.querySelector('.signup-popup').style.display = 'block';
    });

    document.getElementById('toggle-login').addEventListener('click', () => {
      document.querySelector('.login-popup').style.display = 'block';
      document.querySelector('.signup-popup').style.display = 'none';
    });

    const signupFormButton = this.querySelector('.signup-popup button');
    if (signupFormButton) {
      signupFormButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const username = this.querySelector('#signup-username').value;
        const email = this.querySelector('#signup-email').value;
        const password = this.querySelector('#signup-password').value;
        const confirmPassword = this.querySelector('#confirm-password').value;

        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        try {
          const response = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, username })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              alert('Signup successful! Please log in.');
              document.querySelector('.signup-popup').style.display = 'none';
              document.querySelector('.login-popup').style.display = 'block';
            } else {
              alert('Signup failed: ' + data.message);
            }
          } else {
            const errorText = await response.text();
            console.error('Signup failed:', errorText);
            alert('Signup request failed');
          }
        } catch (error) {
          console.error('Error signing up:', error);
        }
      });
    }
  }

  render() {
    this.innerHTML = `
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
                        <li><a href="movies.html?genre=Animation">Хүүхэлдэйн кино</a></li>
                        <li><a href="movies.html?genre=Sci-Fi">Ш/У уран зөгнөлт</a></li>
                    </ul>
                </div>
            </li>
            <li class="nav-list"><a id="movies-option" href="movies.html?type=movie" data-type="movie">Кино</a></li>
            <li class="nav-list"><a id="series-option" href="movies.html?type=series" data-type="series">Цуврал</a></li>
            <li class="nav-list"><a id="tv-shows-option" href="movies.html?type=tv_show" data-type="tv_show">ТВ шоу</a></li>
        </ul>
    </nav>
    <form class="search-container">
        <img src="assets/images/search.png" alt="search-icon" class="search-icon" />
        <input type="text" name="name" id="" class="search-input" placeholder="Хайх..." />
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
                        <li><a href="movies.html?genre=Animation">Хүүхэлдэйн кино</a></li>
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
    <img src="assets/images/user.png" alt="login" class="profile" height="30" width="30" />
</header>

<div class="popup">
    <section class="login-popup">
        <div class="close-btn">
            <img src="assets/images/Cancel.png" alt="close-btn" />
        </div>
        <article class="form">
            <h2>Нэвтрэх</h2>
            <div class="form-element">
                <input type="text" id="email" placeholder="Email-ээ оруулна уу" />
            </div>
            <div class="form-element">
                <input type="password" id="password" placeholder="Нууц үгээ оруулна уу" />
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
            <img src="assets/images/Cancel.png" alt="close-btn" />
        </div>
        <article class="form">
            <h2>Бүртгүүлэх</h2>
            <div class="form-element">
                <input type="text" id="signup-email" placeholder="Email-ээ оруулна уу" />
            </div>
            <div class="form-element">
                <input type="text" id="signup-username" placeholder="Нэрээ оруулна уу" />
            </div>
            <div class="form-element">
                <input type="password" id="signup-password" placeholder="Нууц үгээ оруулна уу" />
            </div>
            <div class="form-element">
                <input type="password" id="confirm-password" placeholder="Нууц үгээ дахин оруулна уу" />
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
        <li class="profile-option"><a href="intro.html"><img src="assets/images/continue.png" alt="continue" />Үргэлжлүүлэн үзэх</a></li>
        <bookmarked-component></bookmarked-component>
        <li class="profile-option"><a href="movies.html"><img src="assets/images/History.png" alt="History" />Үзсэн</a></li>
        <li class="profile-option"><a href="#"><img src="assets/images/logout.png" alt="logout" />Гарах</a></li>
    </ul>
</div>

    `;
  }
}

window.customElements.define('header-component', HeaderComponent);

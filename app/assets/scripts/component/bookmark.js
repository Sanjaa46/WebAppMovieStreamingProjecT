export default class BookmarkedComponent extends HTMLElement {
    constructor() {
        super();
        this.movies = this.loadBookmarkedMovies();
    }

    connectedCallback() {
        this.render();
        this.handleBookmarkEvent = this.handleBookmarkEvent.bind(this);
        document.addEventListener('bookmark', this.handleBookmarkEvent);
        this.addEventListener('click', this.showBookmarkedMovies.bind(this));
    }

    disconnectedCallback() {
        document.removeEventListener('bookmark', this.handleBookmarkEvent);
        this.removeEventListener('click', this.showBookmarkedMovies.bind(this));
    }

    handleBookmarkEvent(event) {
        const movie = event.detail;
        if (!this.movies.some(m => m.name === movie.name)) {
            this.movies.push(movie);
            this.storeBookmarkedMovies(this.movies);
            console.log('Bookmarked movie:', movie.name);
        }
    }

    storeBookmarkedMovies(movies) {
        localStorage.setItem('bookmarkedMovies', JSON.stringify(movies));
    }

    loadBookmarkedMovies() {
        const storedMovies = localStorage.getItem('bookmarkedMovies');
        return storedMovies ? JSON.parse(storedMovies) : [];
    }

    render() {
        this.innerHTML = `
        <li class="profile-option"><a href="movies.html" id="bookmarked"><img src="assets/images/bookmark.png" alt="bookmark">Хадгалсан</a></li>`;
    }

    showBookmarkedMovies(event) {
        event.preventDefault();
        const bookmarkedMoviesEvent = new CustomEvent('show-bookmarked-movies', {
            detail: { movies: this.movies }
        });
        document.dispatchEvent(bookmarkedMoviesEvent);
    }
}

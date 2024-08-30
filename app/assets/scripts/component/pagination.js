class Pagination extends HTMLElement {
    constructor() {
        super();
        this.movies = [];
        this.moviesPerPage = 24;
        this.currentPage = 1;
    }

    connectedCallback() {
        this.render();
    }

    updateMovies(movies) {
        this.movies = movies;
        this.currentPage = 1;
        this.renderMovies();
        this.updatePaginationButtons();
    }

    renderMovies() {
        const movieList = document.querySelector('movie-list');
        if (!movieList) return;

        const start = (this.currentPage - 1) * this.moviesPerPage;
        const end = this.currentPage * this.moviesPerPage;

        movieList.movies = this.movies.slice(start, end);
    }

    updatePaginationButtons() {
        const paginationContainer = this.querySelector('.pagination');
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(this.movies.length / this.moviesPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            if (i === this.currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.currentPage = i;
                this.renderMovies();
                this.updatePaginationButtons();
            });
            paginationContainer.appendChild(pageLink);
        }
    }

    render() {
        this.innerHTML = `
        <style>
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
        </style>
        <section class="pagination"></section>
        `;
    }
}

customElements.define('pagination-component', Pagination)
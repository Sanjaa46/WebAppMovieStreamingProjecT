export default class Movie {
    constructor(movie) {
        this.name = movie.name;
        this.since = movie.since;
        this.duration = movie.duration;
        this.director = movie.director;
        this.poster = movie.poster;
        this.genre = movie.genre;
        this.type = movie.type;
    }


    render() {
        return `
            <article class="movie-small-sized"><a href="intro.html?type=${this.type}&name=${this.name}&genre=${this.genre}">
                <div class="details">
                    <h3 class="Name">${this.name}</h3>
                    <p class="year-and-duration"><img src="/assets/images/movie-icon.png" alt="movie-icon" class="movie-icon"> ${this.since} - ${this.duration} мин</p>
                    <div class="info">
                        <p>Directed by ${this.director}</p>
                    </div>
                </div>
                <div class="poster">
                    <img src="${this.poster}" alt="movie-small-sized-poster">
                </div></a>
            </article>`;
    }
}
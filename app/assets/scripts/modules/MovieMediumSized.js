export default class MovieMediumSized {
    constructor(movie, rank) {
        this.name = movie.name;
        this.genre = movie.genre;
        this.poster = movie.poster;
        this.rank = rank;
    }

    render() {
        const paddedRank = (this.rank + 1).toString().padStart(2, '0'); // Ensure rank is displayed as '01', '02', etc.
        const genres = this.genre.join(', ');
        return `
        <article class="movie-medium-sized"><a href="intro.html?name=${this.name}&genre=${this.genre}">
            <p class="rank">${paddedRank}</p>
            <div class="details">
                <h3 class="name">${this.name}</h3>
                <p class="movie-type">${genres}</p>
            </div>
            <div class="poster">
                <img src="${this.poster}" alt="movie-medium-sized-poster">
            </div></a>
        </article>`;
    }
}
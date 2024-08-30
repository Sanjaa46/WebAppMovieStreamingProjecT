export default class MovieSliderItem {
    constructor(movie) {
        this.name = movie.name;
        this.genre = movie.genre;
        this.cover = movie.cover;
    }

    render() {
        const genres = this.genre.join('/');
        return `
        <div class="item1">
            <img src="${this.cover}" alt="Movie_slider"/>
            <div class="content1">
                <div class="title1">Онцлох кино</div>
                <div class="type1">${this.name}</div>
                <div class="description1">
                    ${genres}
                </div>
                <a href="intro.html?name=${this.name}&genre=${this.genre}">
                    <div class="button1">
                        <button>ҮЗЭХ</button>
                    </div>
                </a>
            </div>
        </div>`;
    }
}

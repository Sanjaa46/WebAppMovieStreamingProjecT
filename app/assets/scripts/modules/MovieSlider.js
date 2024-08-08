export default class MovieSliderItem {
    constructor(movie) {
        this.title = movie.title;
        this.genre = movie.genre;
        this.description = movie.description;
        this.poster = movie.poster;
    }

    render() {
        return `
        <div class="item1">
            <img src="${this.poster}" alt="Movie_slider"/>
            <div class="content1">
                <div class="title1">Онцлох кино</div>
                <div class="type1">${this.title}</div>
                <div class="description1">
                    ${this.description}
                </div>
                <div class="button1">
                    <button>ҮЗЭХ</button>
                </div>
            </div>
        </div>`;
    }
}

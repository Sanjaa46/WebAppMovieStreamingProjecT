export default class MovieThumbnailItem {
    constructor(poster) {
        this.poster = poster;
    }

    render() {
        return `
        <div class="item1">
            <img src="${this.poster}" alt="Movie_thumbnail"/>
        </div>`;
    }
}
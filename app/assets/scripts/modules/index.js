import Movie from './Movies.js';
import MovieSliderItem from './MovieSlider.js';
import MovieThumbnailItem from './MovieThumbnail.js';
import { fetchAllMovies } from '../webapi/api.js';

class Movies {
    constructor() {}

    async list(container_type) {
        let id;
        let movieType;
        switch (container_type) {
            case 'new-added-movies':
                id = 'new-added-movies';
                movieType = 'movie';
                break;
            case 'new-added-series':
                id = 'new-added-series';
                movieType = 'series';
                break;
            case 'new-added-tvshows':
                id = 'new-added-tvshows';
                movieType = 'tv_show';
                break;
            default:
                console.error('Invalid container type');
                return;
        }

        try {
            const data = await fetchAllMovies();

            data.sort((a, b) => b.since - a.since);

            let moviesData = '';
            let i = 0;
            let j = 0;
            while (i < data.length && j < 12) {
                if (data[i].type === movieType) {
                    const mov = new Movie(data[i]);
                    moviesData += mov.render();
                    j++;
                }
                i++;
            }
            document.getElementById(id).querySelector(".movies-container-12").insertAdjacentHTML("beforeend", moviesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
};

const movies = new Movies();
movies.list('new-added-movies');
movies.list('new-added-series');
movies.list('new-added-tvshows');

class MovieMediumSized {
    constructor(movie, rank) {
        this.name = movie.name;
        this.genre = movie.genre;
        this.poster = movie.poster;
        this.rank = rank;
    }

    render() {
        const paddedRank = (this.rank + 1).toString().padStart(2, '0');
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

class MostViewed {
    async list() {
        try {
            const data = await fetchAllMovies();

            data.sort((a, b) => b.views - a.views);

            let moviesData = '';
            for (let i = 0; i < Math.min(5, data.length); i++) {
                const mov = new MovieMediumSized(data[i], i);
                moviesData += mov.render();
            }
            document.querySelector('.most-viewed-movies-container').querySelector(".most-viewed-movies-slider").insertAdjacentHTML("beforeend", moviesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

const mostViewed = new MostViewed();
mostViewed.list();

function handleNext() {
    const slider = document.querySelector('.most-viewed-movies-slider');
    const movieWidth = document.querySelector('.movie-medium-sized').offsetWidth;
    const scrollDistance = movieWidth + 20;
    slider.scrollLeft += scrollDistance;
}

function handlePrev() {
    const slider = document.querySelector('.most-viewed-movies-slider');
    const movieWidth = document.querySelector('.movie-medium-sized').offsetWidth;
    const scrollDistance = movieWidth + 20;
    slider.scrollLeft -= scrollDistance;
}

document.querySelector('.next').addEventListener('click', handleNext);
document.querySelector('.prev').addEventListener('click', handlePrev);

let nextBtn = document.querySelector(".next1");
let prevBtn = document.querySelector(".prev1");

let slider = document.querySelector(".slider1");
let sliderList = document.querySelector(".slider1 .list1");
let thumbnail = document.querySelector(".slider1 .thumbnail1");
let thumbnailItems = document.querySelectorAll(".thumbnail1 .item1");

if (thumbnailItems[0]) {
    thumbnail.appendChild(thumbnailItems[0]);
} else {
    console.error("No thumbnail items found to append");
}

nextBtn.onclick = function () {
    moveSlider("next");
};

prevBtn.onclick = function () {
    moveSlider("prev");
};

function moveSlider(direction) {
    let sliderItem = sliderList.querySelectorAll(".item1");
    let thumbnailItem = document.querySelectorAll(".thumbnail1 .item1");

    if (direction === "next") {
        sliderList.appendChild(sliderItem[0]);
        thumbnail.appendChild(thumbnailItem[0]);
        slider.classList.add("next1");
    } else {
        sliderList.prepend(sliderItem[sliderItem.length - 1]);
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
        slider.classList.add("prev1");
    }

    setTimeout(() => {
        slider.classList.remove("next1", "prev1");
    }, 500);
}

const sliderContainer = document.querySelector('.list1');
const thumbnailContainer = document.querySelector('.thumbnail1');

let sliderMovies = [];

async function loadSliderMovies() {
    try {
        const data = await fetchAllMovies();

        const movieNames = ['13 Reasons Why', '1917', 'American Horror Story', '60 Minutes'];

        sliderMovies = data.filter(movie => movieNames.includes(movie.name));

        sliderMovies.forEach(movie => {
            const sliderItem = new MovieSliderItem(movie);
            sliderContainer.innerHTML += sliderItem.render();

            const thumbnailItem = new MovieThumbnailItem(movie.poster);
            thumbnailContainer.innerHTML += thumbnailItem.render();
        });
    } catch (error) {
        console.error('Error fetching slider movies:', error);
    }
}

loadSliderMovies();

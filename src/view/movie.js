import AbstractView from "./abstract.js";
import {convertToHourFormat} from "../utils.js";

const MAX_BRIEF_LENGTH = 140;
const ACTIVE_CLASS = `film-card__controls-item--active`;

const createMovieTemplate = (movie) => {
  const {
    title,
    poster,
    description,
    comments,
    rating,
    releaseDate,
    runtime,
    genres,
    userInfo: {
      isAtWatchlist,
      isWatched,
      isFavorite
    }
  } = movie;

  const formattedRating = rating.toFixed(1);
  const year = releaseDate.getFullYear();
  const genre = genres[0];
  const formattedRuntime = convertToHourFormat(runtime);

  const brief = description.length <= MAX_BRIEF_LENGTH
    ? description
    : description.substring(0, MAX_BRIEF_LENGTH).concat(`&hellip;`);

  const commentsCountTemplate = comments.length === 1
    ? `${comments.length} comment`
    : `${comments.length} comments`;

  const watchlistActiveClass = isAtWatchlist ? ACTIVE_CLASS : ``;
  const watchedActiveClass = isWatched ? ACTIVE_CLASS : ``;
  const favoriteActiveClass = isFavorite ? ACTIVE_CLASS : ``;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${formattedRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${formattedRuntime}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img 
      src="./images/posters/${poster}"
      alt="poster of movie: ${title}"
      class="film-card__poster"
    >
    <p class="film-card__description">${brief}</p>
    <a class="film-card__comments">${commentsCountTemplate}</a>
    <div class="film-card__controls">
      <button 
        class="
          film-card__controls-item
          button
          film-card__controls-item--add-to-watchlist
          ${watchlistActiveClass}"
        type="button"
      >Add to watchlist</button>
      <button 
        class="
          film-card__controls-item
          button
          film-card__controls-item--mark-as-watched
          ${watchedActiveClass}" 
        type="button"
      >Mark as watched</button>
      <button 
        class="
          film-card__controls-item
          button
          film-card__controls-item--favorite
          ${favoriteActiveClass}"
        type="button"
        >Mark as favorite</button>
    </div>
  </article>`;
};

export default class Movie extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    const movieTitle = this.getElement().querySelector(`.film-card__title`);
    const moviePoster = this.getElement().querySelector(`.film-card__poster`);
    const commentsLink = this.getElement().querySelector(`.film-card__comments`);

    if (evt.target === movieTitle || evt.target === moviePoster || evt.target === commentsLink) {
      this._callback.click();
    }
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}

import MovieView from "../view/movie.js";
import PopupView from "../view/popup.js";
import {getComments} from "../mock/comment.js";
import {render, append, remove, replace, RenderPosition} from "../utils/render.js";
import {isKeyEscape} from "../utils/common.js";
import {UserAction, UpdateType} from "../const.js";

const OVERFLOW_HIDE_CLASS = `hide-overflow`;
const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

const page = document.querySelector(`body`);

export default class Movie {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._movieComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;

    this._movieComponent = new MovieView(movie);
    this._popupComponent = new PopupView(movie, getComments(movie.id));

    this._movieComponent.setClickHandler(this._handleCardClick);
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._movieComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);

    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._container.contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }

    if (page.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
    remove(prevMovieComponent);
  }

  destroy() {
    remove(this._movieComponent);
    remove(this._popupComponent);
  }

  _openPopup() {
    append(page, this._popupComponent);
    page.classList.add(OVERFLOW_HIDE_CLASS);
  }

  _closePopup() {
    this._popupComponent.getElement().remove();
    page.classList.remove(OVERFLOW_HIDE_CLASS);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._mode = Mode.DEFAULT;
    }
  }

  _escKeyDownHandler(evt) {
    if (isKeyEscape(evt.key)) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      this._mode = Mode.DEFAULT;
    }
  }

  _handleCardClick() {
    this._changeMode();
    this._openPopup();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.POPUP;
  }

  _handleCloseButtonClick() {
    this._closePopup();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleWatchlistClick() {
    const updatedMovie = Object.assign({}, this._movie);

    updatedMovie.userInfo = JSON.parse(JSON.stringify(updatedMovie.userInfo));
    updatedMovie.userInfo.isAtWatchlist = !updatedMovie.userInfo.isAtWatchlist;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
  }

  _handleWatchedClick() {
    const updatedMovie = Object.assign({}, this._movie);

    updatedMovie.userInfo = JSON.parse(JSON.stringify(updatedMovie.userInfo));
    updatedMovie.userInfo.isWatched = !updatedMovie.userInfo.isWatched;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
  }

  _handleFavoriteClick() {
    const updatedMovie = Object.assign({}, this._movie);

    updatedMovie.userInfo = JSON.parse(JSON.stringify(updatedMovie.userInfo));
    updatedMovie.userInfo.isFavorite = !updatedMovie.userInfo.isFavorite;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
  }
}

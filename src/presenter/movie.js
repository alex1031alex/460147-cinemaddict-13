import MovieView from "../view/movie.js";
import PopupView from "../view/popup.js";
import {getComments} from "../mock/comment.js";
import {render, append, remove, RenderPosition} from "../utils/render.js";
import {isKeyEscape} from "../utils/common.js";

const OVERFLOW_HIDE_CLASS = `hide-overflow`;
const page = document.querySelector(`body`);

export default class Movie {
  constructor(container) {
    this._container = container;

    this._movieComponent = null;
    this._popupComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
  }

  init(movie) {
    this._movie = movie;

    this._movieComponent = new MovieView(movie);
    this._popupComponent = new PopupView(movie, getComments(movie.id));

    this._movieComponent.setClickHandler(this._handleCardClick);
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);

    render(this._container, this._movieComponent, RenderPosition.BEFOREEND);
  }

  _openPopup() {
    append(page, this._popupComponent);
    page.classList.add(OVERFLOW_HIDE_CLASS);
  }

  _closePopup() {
    remove(this._popupComponent);
    page.classList.remove(OVERFLOW_HIDE_CLASS);
  }

  _escKeyDownHandler(evt) {
    if (isKeyEscape(evt.key)) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _handleCardClick() {
    this._openPopup();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleCloseButtonClick() {
    this._closePopup();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}

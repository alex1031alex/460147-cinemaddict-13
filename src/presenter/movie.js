import MovieView from "../view/movie.js";
import PopupView from "../view/popup.js";
import CommentsModel from "../model/comments.js";
import {render, append, remove, replace, RenderPosition} from "../utils/render.js";
import {isKeyEscape} from "../utils/common.js";
import {UserAction, UpdateType} from "../const.js";

const OVERFLOW_HIDE_CLASS = `hide-overflow`;
const ENTER_KEY = `Enter`;
const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

const page = document.querySelector(`body`);

export default class Movie {
  constructor(container, changeData, changeMode, onPopupClose, api) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._onPopupClose = onPopupClose;
    this._api = api;

    this._movieComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel = new CommentsModel();
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(movie) {
    this._movie = movie;

    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;

    this._movieComponent = new MovieView(movie);
    this._popupComponent = new PopupView(movie, this._commentsModel.get());

    this._movieComponent.setClickHandler(this._handleCardClick);
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._movieComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setDeleteClickHandler(this._handleDeleteClick);

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

    if (this._mode === Mode.DEFAULT) {
      remove(this._popupComponent);
    }
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
      document.removeEventListener(`keydown`, this._handleFormSubmit);
      this._mode = Mode.DEFAULT;

      this._onPopupClose();
    }
  }

  _escKeyDownHandler(evt) {
    if (isKeyEscape(evt.key)) {
      evt.preventDefault();
      this._closePopup();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
      document.removeEventListener(`keydown`, this._handleFormSubmit);
      this._mode = Mode.DEFAULT;

      this._onPopupClose();
    }
  }

  _handleCardClick() {
    this._changeMode(this._movie.id);
    this._openPopup();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    document.addEventListener(`keydown`, this._handleFormSubmit);
    this._mode = Mode.POPUP;

    this._api.getComments(this._movie.id)
      .then((comments) => this._commentsModel.set(comments))
      .then(() => this.init(this._movie))
      .catch(() => this._commentsModel.set([]));
  }

  _handleCloseButtonClick() {
    this._closePopup();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    document.removeEventListener(`keydown`, this._handleFormSubmit);
    this._mode = Mode.DEFAULT;

    this._onPopupClose();
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

    if (updatedMovie.userInfo.isWatched && updatedMovie.userInfo.watchingDate === null) {
      updatedMovie.userInfo.watchingDate = new Date();
    }

    if (updatedMovie.userInfo.watchingDate && !updatedMovie.userInfo.isWatched) {
      updatedMovie.userInfo.watchingDate = null;
    }

    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
  }

  _handleFavoriteClick() {
    const updatedMovie = Object.assign({}, this._movie);

    updatedMovie.userInfo = JSON.parse(JSON.stringify(updatedMovie.userInfo));
    updatedMovie.userInfo.isFavorite = !updatedMovie.userInfo.isFavorite;
    this._changeData(UserAction.UPDATE_MOVIE, UpdateType.MINOR, updatedMovie);
  }

  _handleFormSubmit(evt) {
    if (evt.ctrlKey && evt.key === ENTER_KEY) {
      const localData = this._popupComponent.getLocalData();
      const localComment = {
        emotion: localData.localCommentEmotion,
        text: localData.localCommentText
      };

      if (localComment.emotion === `` || localComment.text === ``) {
        return;
      }

      localComment.date = new Date();

      this._popupComponent.updateLocalData({isDisabled: true});
      this._api.addComment(this._movie.id, localComment)
        .then((response) => {
          this._commentsModel.add(UserAction.ADD_COMMENT, response);
          this._popupComponent.moveScrollDown();
        });
    }
  }

  _handleDeleteClick(commentId) {
    this._popupComponent.updateLocalData({isDisabled: true, deletingCommentId: commentId});
    this._api.deleteComment(commentId)
      .then(() => {
        this._commentsModel.delete(UserAction.DELETE_COMMENT, commentId);
        this._popupComponent.moveScrollDown();
      });
  }

  _handleModelEvent(userAction, updatedMovie) {
    switch (userAction) {
      case UserAction.ADD_COMMENT: {
        this._changeData(
            UserAction.ADD_COMMENT,
            UpdateType.PATCH,
            updatedMovie
        );
        break;
      }
      case UserAction.DELETE_COMMENT: {
        this._changeData(
            UserAction.DELETE_COMMENT,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._movie,
                {
                  comments: this._commentsModel.get().slice()
                }
            )
        );
        break;
      }
    }
  }
}

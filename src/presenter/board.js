import BoardView from "../view/board.js";
import NoMoviesView from "../view/no-movies.js";
import SortView from "../view/sort.js";
import MainListView from "../view/main-list.js";
import TopRatedListView from "../view/top-rated-list.js";
import MostCommentedListView from "../view/most-commented-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import LoadingView from "../view/loading.js";
import MoviePresenter from "./movie.js";
import {render, remove, RenderPosition, replace} from "../utils/render.js";
import {sortByDate, sortByRating, filter} from "../utils/movie.js";
import {SortType, UserAction, UpdateType, HIDE_ELEMENT_CLASS} from "../const.js";

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

export default class Board {
  constructor(boardContainer, moviesModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    this._moviePresenter = {
      mainList: {},
      topRatedList: {},
      mostCommentedList: {},
      popup: {
        id: null,
        presenter: null
      }
    };
    this._isLoading = true;
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new BoardView();
    this._board = this._boardComponent.getElement();

    this._loadingComponent = new LoadingView();
    this._noMoviesComponent = new NoMoviesView();
    this._sortComponent = null;
    this._mainListComponent = new MainListView();
    this._topRatedListComponent = new TopRatedListView();
    this._mostCommentedListComponent = new MostCommentedListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlePopupClose = this._handlePopupClose.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filterModel.get();
    const movies = this._moviesModel.get().slice();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE: {
        return filteredMovies.sort(sortByDate);
      }
      case SortType.RATING: {
        return filteredMovies.sort(sortByRating);
      }
    }

    return filteredMovies;
  }

  _renderLoading() {
    render(this._board, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoMovies() {
    render(this._board, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _updateMovie(updatedMovie) {
    if (this._moviePresenter.mainList[updatedMovie.id]) {
      this._moviePresenter.mainList[updatedMovie.id].init(updatedMovie);
    }

    if (this._moviePresenter.topRatedList[updatedMovie.id]) {
      this._moviePresenter.topRatedList[updatedMovie.id].init(updatedMovie);
    }

    if (this._moviePresenter.mostCommentedList[updatedMovie.id]) {
      this._moviePresenter.mostCommentedList[updatedMovie.id].init(updatedMovie);
    }

    if (this._moviePresenter.popup.id === updatedMovie.id) {
      this._moviePresenter.popup.presenter.init(updatedMovie);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE: {
        this._api.updateMovie(update)
          .then((response) => this._moviesModel.update(updateType, response));
        break;
      }
      case UserAction.DELETE_COMMENT: {
        this._moviesModel.update(updateType, update);
        break;
      }
      case UserAction.ADD_COMMENT: {
        this._moviesModel.update(updateType, update);
        break;
      }
    }
  }

  _handleModelEvent(updateType, update) {
    if (update && this._moviePresenter.popup.id === update.id) {
      this._moviePresenter.popup.presenter.init(update);
    }

    switch (updateType) {
      case UpdateType.PATCH: {
        this._updateMovie(update);
        this._clearMostCommentedList();
        this._renderMostCommentedMovies();
        break;
      }
      case UpdateType.MINOR: {
        this._rerenderBoard();
        break;
      }
      case UpdateType.MAJOR: {
        this._rerenderBoard(true, true);
        break;
      }
      case UpdateType.INIT: {
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
      }
    }
  }

  _handleModeChange(movieId) {
    this._moviePresenter.popup.id = movieId;
    this._moviePresenter.popup.presenter = this._moviePresenter.mainList[movieId] ||
      this._moviePresenter.topRatedList[movieId] || this._moviePresenter.mostCommentedList[movieId];

    Object
      .values(this._moviePresenter.mainList)
      .forEach((presenter) => presenter.resetView());

    Object
      .values(this._moviePresenter.topRatedList)
      .forEach((presenter) => presenter.resetView());

    Object
      .values(this._moviePresenter.mostCommentedList)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePopupClose() {
    this._moviePresenter.popup.presenter = null;
    this._moviePresenter.popup.id = null;
  }

  _clearMainList() {
    Object
      .values(this._moviePresenter.mainList)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter.mainList = {};
  }

  _clearTopRatedList() {
    Object
      .values(this._moviePresenter.topRatedList)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter.topRatedList = {};
  }

  _clearMostCommentedList() {
    Object
      .values(this._moviePresenter.mostCommentedList)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter.mostCommentedList = {};
  }

  _clearBoard() {
    this._clearMainList();
    remove(this._showMoreButtonComponent);

    this._clearTopRatedList();
    this._clearMostCommentedList();
  }

  _rerenderBoard(resetRenderedMovieCount = false, resetSortType = false) {
    this._clearBoard();

    if (resetRenderedMovieCount) {
      this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      this._renderedMoviesCount = Math.min(this._getMovies().length, this._renderedMoviesCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    this._renderBoard();
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;

    this._renderSort();
    this._clearMainList();
    this._renderMainListMovies();
  }

  _renderMovie(container, movie, presenterList) {
    const moviePresenter = new MoviePresenter(
        container,
        this._handleViewAction,
        this._handleModeChange,
        this._handlePopupClose,
        this._api
    );
    moviePresenter.init(movie);
    presenterList[movie.id] = moviePresenter;
  }

  _renderSort() {
    const prevSortComponent = this._sortComponent;
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevSortComponent === null) {
      render(this._board, this._sortComponent, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this._sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  _renderMainListMovies() {
    render(this._board, this._mainListComponent, RenderPosition.AFTERBEGIN);

    const movieContainer = this._mainListComponent.getMovieContainer();
    const movies = this._getMovies();

    movies
      .slice(0, Math.min(this._renderedMoviesCount, movies.length))
      .forEach((movie) => this._renderMovie(movieContainer, movie, this._moviePresenter.mainList));

    if (movies.length > this._renderedMoviesCount) {
      this._renderShowMoreButton(movieContainer);
    }
  }

  _renderTopRatedMovies() {
    const movies = this._getMovies();

    if (movies.every((movie) => movie.rating === 0)) {
      return;
    }

    render(this._board, this._topRatedListComponent, RenderPosition.BEFOREEND);

    const movieContainer = this._topRatedListComponent.getMovieContainer();
    const topRatedMovies = movies
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, EXTRA_MOVIE_COUNT);

    topRatedMovies.forEach((movie) => this._renderMovie(
        movieContainer,
        movie,
        this._moviePresenter.topRatedList
    ));
  }

  _renderMostCommentedMovies() {
    const movies = this._getMovies();

    if (movies.every((movie) => movie.comments.length === 0)) {
      return;
    }

    render(this._board, this._mostCommentedListComponent, RenderPosition.BEFOREEND);

    const movieContainer = this._mostCommentedListComponent.getMovieContainer();
    const mostCommentedMovies = movies
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_MOVIE_COUNT);

    mostCommentedMovies.forEach((movie) => this._renderMovie(
        movieContainer,
        movie,
        this._moviePresenter.mostCommentedList
    ));
  }

  _renderShowMoreButton(movieContainer) {
    render(movieContainer, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const movieCount = this._getMovies().length;
      const newRenderedMovieCount = Math.min(
          movieCount,
          this._renderedMoviesCount + MOVIE_COUNT_PER_STEP
      );

      this._getMovies()
        .slice(this._renderedMoviesCount, newRenderedMovieCount)
        .forEach((movie) => this._renderMovie(
            movieContainer,
            movie,
            this._moviePresenter.mainList
        ));

      this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;

      if (this._renderedMoviesCount >= movieCount) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getMovies().length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();

    this._renderMainListMovies();
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  show() {
    this._board.classList.remove(HIDE_ELEMENT_CLASS);
    this._sortComponent.getElement().classList.remove(HIDE_ELEMENT_CLASS);
  }

  hide() {
    this._board.classList.add(HIDE_ELEMENT_CLASS);
    this._sortComponent.getElement().classList.add(HIDE_ELEMENT_CLASS);

    if (this._moviePresenter.popup.presenter) {
      this._moviePresenter.popup.presenter.resetView();
    }
  }
}

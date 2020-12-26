import BoardView from "../view/board.js";
import NoMoviesView from "../view/no-movies.js";
import SortView from "../view/sort.js";
import MainListView from "../view/main-list.js";
import TopRatedListView from "../view/top-rated-list.js";
import MostCommentedListView from "../view/most-commented-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import MoviePresenter from "./movie.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {sortByDate, sortByRating, filter} from "../utils/movie.js";
import {SortType, UserAction, UpdateType} from "../const.js";

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

export default class Board {
  constructor(boardContainer, moviesModel, filterModel) {
    this._boardContainer = boardContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    this._moviePresenter = {
      mainList: {},
      topRatedList: {},
      mostCommentedList: {}
    };
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new BoardView();
    this._board = this._boardComponent.getElement();

    this._noMoviesComponent = new NoMoviesView();
    this._sortComponent = new SortView();
    this._mainListComponent = new MainListView();
    this._topRatedListComponent = new TopRatedListView();
    this._mostCommentedListComponent = new MostCommentedListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.get();
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
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE: {
        this._moviesModel.update(updateType, update);
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
    switch (updateType) {
      case UpdateType.PATCH: {
        this._updateMovie(update);
        break;
      }
      case UpdateType.MINOR: {
        this._clearBoard();
        this._renderBoard();
        break;
      }
      case UpdateType.MAJOR: {
        this._clearBoard(true, true);
        this._renderBoard();
        break;
      }
    }
  }

  _handleModeChange() {
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

  _clearBoard(resetRenderedMovieCount = false, resetSortType = false) {
    this._clearMainList();
    remove(this._showMoreButtonComponent);

    this._clearTopRatedList();
    this._clearMostCommentedList();

    if (resetRenderedMovieCount) {
      this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    } else {
      this._renderedMoviesCount = Math.min(this._getMovies().length, this._renderedMovieCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainList();
    this._renderMainListMovies();
  }

  _renderMovie(container, movie, presenterList) {
    const moviePresenter = new MoviePresenter(
        container,
        this._handleViewAction,
        this._handleModeChange
    );
    moviePresenter.init(movie);
    presenterList[movie.id] = moviePresenter;
  }

  _renderSort() {
    render(this._board, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMainListMovies() {
    render(this._board, this._mainListComponent, RenderPosition.AFTERBEGIN);

    const movieContainer = this._mainListComponent.getMovieContainer();
    const movies = this._getMovies();

    movies
      .slice(0, Math.min(this._renderedMoviesCount, movies.length))
      .forEach((movie) => this._renderMovie(movieContainer, movie, this._moviePresenter.mainList));

    if (movies.length > MOVIE_COUNT_PER_STEP) {
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
    if (this._getMovies().length === 0) {
      this._renderNoMovies();

      return;
    }

    this._renderSort();

    this._renderMainListMovies();
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }
}

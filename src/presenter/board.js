import BoardView from "../view/board.js";
import NoMoviesView from "../view/no-movies.js";
import SortView from "../view/sort.js";
import MainListView from "../view/main-list.js";
import TopRatedListView from "../view/top-rated-list.js";
import MostCommentedListView from "../view/most-commented-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import MoviePresenter from "./movie.js";
import {updateItem} from "../utils/common.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {sortByDate, sortByRating} from "../utils/movie.js";
import {SortType} from "../const.js";

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

export default class Board {
  constructor(boardContainer, moviesModel) {
    this._boardContainer = boardContainer;
    this._moviesModel = moviesModel;
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

    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._sourcedMovies = movies.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _renderNoMovies() {
    render(this._board, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _handleMovieChange(updatedMovie) {
    this._movies = updateItem(this._movies, updatedMovie);

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

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.DATE: {
        this._movies.sort(sortByDate);
        break;
      }
      case SortType.RATING: {
        this._movies.sort(sortByRating);
        break;
      }
      default: {
        this._movies = this._sourcedMovies.slice();
      }
    }
  }

  _clearMainList() {
    Object
      .values(this._moviePresenter.mainList)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter.mainList = {};
    this._renderedMoviesCount = MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }

    this._sortMovies(sortType);
    this._clearMainList();
    this._renderMainListMovies();

    this._currentSortType = sortType;
  }

  _renderMovie(container, movie, presenterList) {
    const moviePresenter = new MoviePresenter(
        container,
        this._handleMovieChange,
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

    this._movies
      .slice(0, Math.min(MOVIE_COUNT_PER_STEP, this._movies.length))
      .forEach((movie) => this._renderMovie(movieContainer, movie, this._moviePresenter.mainList));

    if (this._movies.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton(movieContainer);
    }
  }

  _renderTopRatedMovies() {
    if (this._movies.every((movie) => movie.rating === 0)) {
      return;
    }

    render(this._board, this._topRatedListComponent, RenderPosition.BEFOREEND);

    const movieContainer = this._topRatedListComponent.getMovieContainer();
    const topRatedMovies = this._movies
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
    if (this._movies.every((movie) => movie.comments.length === 0)) {
      return;
    }

    render(this._board, this._mostCommentedListComponent, RenderPosition.BEFOREEND);

    const movieContainer = this._mostCommentedListComponent.getMovieContainer();
    const mostCommentedMovies = this._movies
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
      this._movies
        .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP)
        .forEach((movie) => this._renderMovie(
            movieContainer,
            movie,
            this._moviePresenter.mainList
        ));

      this._renderedMoviesCount += MOVIE_COUNT_PER_STEP;

      if (this._renderedMoviesCount >= this._movies.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _renderBoard() {
    if (this._movies.length === 0) {
      this._renderNoMovies();

      return;
    }

    this._renderSort();

    this._renderMainListMovies();
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }
}

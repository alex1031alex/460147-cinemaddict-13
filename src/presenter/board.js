import BoardView from "../view/board.js";
import NoMoviesView from "../view/no-movies.js";
import SortView from "../view/sort.js";
import MainListView from "../view/main-list.js";
import TopRatedListView from "../view/top-rated-list.js";
import MostCommentedListView from "../view/most-commented-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import MoviePresenter from "./movie.js";
import {render, remove, RenderPosition} from "../utils/render.js";

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._movies = null;

    this._boardComponent = new BoardView();
    this._board = this._boardComponent.getElement();

    this._noMoviesComponent = new NoMoviesView();
    this._sortComponent = new SortView();
    this._mainListComponent = new MainListView();
    this._topRatedListComponent = new TopRatedListView();
    this._mostCommentedListComponent = new MostCommentedListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }

  init(movies) {
    this._movies = movies.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _renderNoMovies() {
    render(this._board, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovie(container, movie) {
    const moviePresenter = new MoviePresenter(container);
    moviePresenter.init(movie);
  }

  _renderSort() {
    render(this._board, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderMainListMovies() {
    render(this._board, this._mainListComponent, RenderPosition.BEFOREEND);

    const movieContainer = this._mainListComponent.getMovieContainer();

    this._movies
      .slice(0, Math.min(MOVIE_COUNT_PER_STEP, this._movies.length))
      .forEach((movie) => this._renderMovie(movieContainer, movie));

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

    topRatedMovies.forEach((movie) => this._renderMovie(movieContainer, movie));
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

    mostCommentedMovies.forEach((movie) => this._renderMovie(movieContainer, movie));
  }

  _renderShowMoreButton(movieContainer) {
    render(movieContainer, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setClickHandler(() => {
      this._movies
        .slice(this._renderedMoviesCount, this._renderedMoviesCount + MOVIE_COUNT_PER_STEP)
        .forEach((movie) => this._renderMovie(movieContainer, movie));

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

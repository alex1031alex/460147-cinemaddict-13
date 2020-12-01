import UserProfileView from "./view/user-profile.js";
import MenuView from "./view/menu.js";
import SortView from "./view/sort.js";
import BoardView from "./view/board.js";
import MainListView from "./view/main-list.js";
import TopRatedListView from "./view/top-rated-list.js";
import MostCommentedListView from "./view/most-commented-list.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import MovieView from "./view/movie.js";
import CounterView from "./view/counter.js";
import PopupView from "./view/popup.js";
import FilterView from "./view/filter.js";
import NoMoviesView from "./view/no-movies.js";
import {generateMovie} from "./mock/movie.js";
import {getComments} from "./mock/comment.js";
import {generateFilter} from "./mock/filter.js";
import {generateUserRank} from "./mock/user-rank.js";
import {append, remove, render, RenderPosition} from "./utils/render.js";
import {isKeyEscape} from "./utils/common.js";

const MOVIE_COUNT = 23;
const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;
const OVERFLOW_HIDE_CLASS = `hide-overflow`;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const watchedMovies = movies.filter((movie) => movie.userInfo.isWatched);
const filters = generateFilter(movies);
const userRank = generateUserRank(watchedMovies.length);

const page = document.querySelector(`body`);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const renderMovie = (container, movie) => {
  const movieComponent = new MovieView(movie);
  const popupComponent = new PopupView(movie, getComments(movie.id));

  const openPopup = () => {
    append(page, popupComponent);
    page.classList.add(OVERFLOW_HIDE_CLASS);
  };

  const closePopup = () => {
    remove(popupComponent);
    page.classList.remove(OVERFLOW_HIDE_CLASS);
  };

  const onEscKeyDown = (evt) => {
    if (isKeyEscape(evt.key)) {
      evt.preventDefault();
      closePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  movieComponent.setClickHandler(() => {
    openPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  popupComponent.setCloseButtonClickHandler(() => {
    closePopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, movieComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, moviesToRender) => {
  const boardComponent = new BoardView();
  const board = boardComponent.getElement();

  render(boardContainer, board, RenderPosition.BEFOREEND);

  if (moviesToRender.length === 0) {
    render(board, new NoMoviesView(), RenderPosition.AFTERBEGIN);
    return;
  }

  const sortComponent = new SortView();
  const mainListComponent = new MainListView();
  const topRatedListComponent = new TopRatedListView();
  const mostCommentedListComponent = new MostCommentedListView();
  const showMoreButtonComponent = new ShowMoreButtonView();

  const topRatedMovies = moviesToRender
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, EXTRA_MOVIE_COUNT);
  const mostCommentedMovies = moviesToRender
    .slice()
    .sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, EXTRA_MOVIE_COUNT);

  render(board, sortComponent, RenderPosition.BEFOREBEGIN);

  render(board, mainListComponent, RenderPosition.BEFOREEND);
  render(board, topRatedListComponent, RenderPosition.BEFOREEND);
  render(board, mostCommentedListComponent, RenderPosition.BEFOREEND);

  moviesToRender
    .slice(0, Math.min(moviesToRender.length, MOVIE_COUNT_PER_STEP))
    .forEach((movie) => renderMovie(mainListComponent.getMovieContainer(), movie));

  topRatedMovies.forEach((movie) => renderMovie(topRatedListComponent.getMovieContainer(), movie));
  mostCommentedMovies.forEach(
      (movie) => renderMovie(mostCommentedListComponent.getMovieContainer(), movie)
  );

  if (moviesToRender.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    render(mainListComponent.getMovieContainer(), showMoreButtonComponent, RenderPosition.AFTEREND);

    showMoreButtonComponent.setClickHandler(() => {
      moviesToRender
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderMovie(mainListComponent.getMovieContainer(), movie));

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= moviesToRender.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
};

const userProfileComponent = new UserProfileView(userRank);
const menuComponent = new MenuView();
const filterComponent = new FilterView(filters);
const counterComponent = new CounterView(movies.length);

render(siteHeader, userProfileComponent, RenderPosition.BEFOREEND);
render(siteMain, menuComponent, RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

render(siteNavigation, filterComponent, RenderPosition.AFTERBEGIN);

renderBoard(siteMain, movies);
render(siteFooter, counterComponent, RenderPosition.BEFOREEND);

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
import {render, RenderPosition, isKeyEscape} from "./utils.js";

const MOVIE_COUNT = 0;
const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;
const OVERFLOW_HIDE_CLASS = `hide-overflow`;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const watchedMovies = movies.filter((movie) => movie.userInfo.isWatched);
const topRatedMovies = movies
  .slice()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, EXTRA_MOVIE_COUNT);
const mostCommentedMovies = movies
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, EXTRA_MOVIE_COUNT);
const filters = generateFilter(movies);
const userRank = generateUserRank(watchedMovies.length);

const page = document.querySelector(`body`);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const userProfileComponent = new UserProfileView(userRank);
const menuComponent = new MenuView();
const sortComponent = new SortView();
const boardComponent = new BoardView();
const noMoviesComponent = new NoMoviesView();
const mainListComponent = new MainListView();
const topRatedListComponent = new TopRatedListView();
const mostCommentedListComponent = new MostCommentedListView();
const showMoreButtonComponent = new ShowMoreButtonView();

const counterComponent = new CounterView(movies.length);
const filterComponent = new FilterView(filters);

render(siteHeader, userProfileComponent.getElement(), RenderPosition.BEFOREEND);
render(siteMain, menuComponent.getElement(), RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

render(siteNavigation, filterComponent.getElement(), RenderPosition.AFTERBEGIN);
render(siteMain, boardComponent.getElement(), RenderPosition.BEFOREEND);

const board = siteMain.querySelector(`.films`);

const renderMovie = (container, movie) => {
  const movieComponent = new MovieView(movie);
  const popupComponent = new PopupView(movie, getComments(movie.id));

  const openPopup = () => {
    page.appendChild(popupComponent.getElement());
    page.classList.add(OVERFLOW_HIDE_CLASS);
  };

  const closePopup = () => {
    page.removeChild(popupComponent.getElement());
    page.classList.remove(OVERFLOW_HIDE_CLASS);
  };

  const movieTitle = movieComponent.getElement().querySelector(`.film-card__title`);
  const moviePoster = movieComponent.getElement().querySelector(`.film-card__poster`);
  const commentsLink = movieComponent.getElement().querySelector(`.film-card__comments`);
  const popupCloseButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);

  const onEscKeyDown = (evt) => {
    if (isKeyEscape(evt.key)) {
      evt.preventDefault();
      closePopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  movieComponent.getElement().addEventListener(`click`, (evt) => {
    if (evt.target === movieTitle || evt.target === moviePoster || evt.target === commentsLink) {
      evt.preventDefault();
      openPopup();
      document.addEventListener(`keydown`, onEscKeyDown);
    }
  });

  popupCloseButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    closePopup();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, movieComponent.getElement(), RenderPosition.BEFOREEND);
};
if (movies.length === 0) {
  render(board, noMoviesComponent.getElement(), RenderPosition.AFTERBEGIN);
} else {
  render(siteNavigation, sortComponent.getElement(), RenderPosition.AFTEREND);

  render(board, mainListComponent.getElement(), RenderPosition.BEFOREEND);
  render(board, topRatedListComponent.getElement(), RenderPosition.BEFOREEND);
  render(board, mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);

  const mainList = board.querySelector(`.films-list .films-list__container`);
  const topRatedList = board.querySelector(`.films-list--rated .films-list__container`);
  const mostCommentedList = board.querySelector(`.films-list--commented .films-list__container`);

  for (let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
    renderMovie(mainList, movies[i]);
  }

  topRatedMovies.forEach((movie) => renderMovie(topRatedList, movie));
  mostCommentedMovies.forEach((movie) => renderMovie(mostCommentedList, movie));

  if (movies.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    render(mainList, showMoreButtonComponent.getElement(), RenderPosition.AFTEREND);

    showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      movies
        .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
        .forEach((movie) => renderMovie(mainList, movie));

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= movies.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
}

render(siteFooter, counterComponent.getElement(), RenderPosition.BEFOREEND);

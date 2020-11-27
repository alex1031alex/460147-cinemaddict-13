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
import {generateMovie} from "./mock/movie.js";
import {getComments} from "./mock/comment.js";
import {generateFilter} from "./mock/filter.js";
import {generateUserRank} from "./mock/user-rank.js";
import {render, RenderPosition} from "./utils.js";

const MOVIE_COUNT = 23;
const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

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

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const userProfileComponent = new UserProfileView(userRank);
const menuComponent = new MenuView();
const sortComponent = new SortView();
const boardComponent = new BoardView();
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
render(siteMain, sortComponent.getElement(), RenderPosition.BEFOREEND);
render(siteMain, boardComponent.getElement(), RenderPosition.BEFOREEND);

const board = siteMain.querySelector(`.films`);

render(board, mainListComponent.getElement(), RenderPosition.BEFOREEND);
render(board, topRatedListComponent.getElement(), RenderPosition.BEFOREEND);
render(board, mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);

const mainList = board.querySelector(`.films-list .films-list__container`);
const topRatedList = board.querySelector(`.films-list--rated .films-list__container`);
const mostCommentedList = board.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
  render(mainList, new MovieView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}

topRatedMovies
  .forEach((movie) => render(
      topRatedList,
      new MovieView(movie).getElement(),
      RenderPosition.BEFOREEND
  ));

mostCommentedMovies
  .forEach((movie) => render(
      mostCommentedList,
      new MovieView(movie).getElement(),
      RenderPosition.BEFOREEND
  ));

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  render(mainList, showMoreButtonComponent.getElement(), RenderPosition.AFTEREND);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => render(
          mainList,
          new MovieView(movie).getElement(),
          RenderPosition.BEFOREEND
      ));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

render(
    siteMain,
    new PopupView(movies[0], getComments(movies[0].id)).getElement(),
    RenderPosition.BEFOREEND
);
render(siteFooter, counterComponent.getElement(), RenderPosition.BEFOREEND);

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
import {renderElement} from "./utils.js";

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

renderElement(siteHeader, userProfileComponent.getElement(), `beforeend`);
renderElement(siteMain, menuComponent.getElement(), `beforeend`);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

renderElement(siteNavigation, filterComponent.getElement(), `afterbegin`);
renderElement(siteMain, sortComponent.getElement(), `beforeend`);
renderElement(siteMain, boardComponent.getElement(), `beforeend`);

const board = siteMain.querySelector(`.films`);

renderElement(board, mainListComponent.getElement(), `beforeend`);
renderElement(board, topRatedListComponent.getElement(), `beforeend`);
renderElement(board, mostCommentedListComponent.getElement(), `beforeend`);

const mainList = board.querySelector(`.films-list .films-list__container`);
const topRatedList = board.querySelector(`.films-list--rated .films-list__container`);
const mostCommentedList = board.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
  renderElement(mainList, new MovieView(movies[i]).getElement(), `beforeend`);
}

topRatedMovies
  .forEach((movie) => renderElement(topRatedList, new MovieView(movie).getElement(), `beforeend`));

mostCommentedMovies
  .forEach((movie) => renderElement(
      mostCommentedList,
      new MovieView(movie).getElement(),
      `beforeend`
  ));

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  renderElement(mainList, showMoreButtonComponent.getElement(), `afterend`);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderElement(mainList, new MovieView(movie).getElement(), `beforeend`));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

renderElement(
    siteMain,
    new PopupView(movies[0], getComments(movies[0].id)).getElement(),
    `beforeend`
);
renderElement(siteFooter, counterComponent.getElement(), `beforeend`);

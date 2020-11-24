import {createUserProfileTemplate} from "./view/user-profile.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createBoardTemplate} from "./view/board.js";
import {createMainListTemplate} from "./view/main-list.js";
import {createTopRatedListTemplate} from "./view/top-rated-list.js";
import {createMostCommentedListTemplate} from "./view/most-commented-list.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createMovieTemplate} from "./view/movie.js";
import {createCounterTemplate} from "./view/counter.js";
import {createPopupTemplate} from "./view/popup.js";
import {createFilterTemplate} from "./view/filter.js";
import {generateMovie} from "./mock/movie.js";
import {getComments} from "./mock/comment.js";
import {generateFilter} from "./mock/filter.js";
import {generateUserRank} from "./mock/user-rank.js";

const MOVIE_COUNT = 23;
const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const watchedMovies = movies.filter((movie) => movie.userInfo.isWatched);
const filters = generateFilter(movies);
const userRank = generateUserRank(watchedMovies.length);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

render(siteHeader, createUserProfileTemplate(userRank), `beforeend`);
render(siteMain, createMenuTemplate(), `beforeend`);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

render(siteNavigation, createFilterTemplate(filters), `afterbegin`);
render(siteMain, createSortTemplate(), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const board = siteMain.querySelector(`.films`);

render(board, createMainListTemplate(), `beforeend`);
render(board, createTopRatedListTemplate(), `beforeend`);
render(board, createMostCommentedListTemplate(), `beforeend`);

const mainList = board.querySelector(`.films-list .films-list__container`);
const topRatedList = board.querySelector(`.films-list--rated .films-list__container`);
const mostCommentedList = board.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
  render(mainList, createMovieTemplate(movies[i]), `beforeend`);

  if (i < EXTRA_MOVIE_COUNT) {
    render(topRatedList, createMovieTemplate(movies[i]), `beforeend`);
    render(mostCommentedList, createMovieTemplate(movies[i]), `beforeend`);
  }
}

render(mainList, createShowMoreButtonTemplate(), `afterend`);
// render(siteMain, createPopupTemplate(movies[0], getComments(movies[0].id)), `beforeend`);
render(siteFooter, createCounterTemplate(), `beforeend`);

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
}

topRatedMovies
  .forEach((movie) => render(topRatedList, createMovieTemplate(movie), `beforeend`));
mostCommentedMovies
  .forEach((movie) => render(mostCommentedList, createMovieTemplate(movie), `beforeend`));

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  render(mainList, createShowMoreButtonTemplate(), `afterend`);

  const showMoreButton = board.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => render(mainList, createMovieTemplate(movie), `beforeend`));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

render(siteMain, createPopupTemplate(movies[0], getComments(movies[0].id)), `beforeend`);
render(siteFooter, createCounterTemplate(), `beforeend`);

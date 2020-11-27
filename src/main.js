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
import {renderTemplate} from "./utils.js";

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

renderTemplate(siteHeader, createUserProfileTemplate(userRank), `beforeend`);
renderTemplate(siteMain, createMenuTemplate(), `beforeend`);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

renderTemplate(siteNavigation, createFilterTemplate(filters), `afterbegin`);
renderTemplate(siteMain, createSortTemplate(), `beforeend`);
renderTemplate(siteMain, createBoardTemplate(), `beforeend`);

const board = siteMain.querySelector(`.films`);

renderTemplate(board, createMainListTemplate(), `beforeend`);
renderTemplate(board, createTopRatedListTemplate(), `beforeend`);
renderTemplate(board, createMostCommentedListTemplate(), `beforeend`);

const mainList = board.querySelector(`.films-list .films-list__container`);
const topRatedList = board.querySelector(`.films-list--rated .films-list__container`);
const mostCommentedList = board.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
  renderTemplate(mainList, createMovieTemplate(movies[i]), `beforeend`);
}

topRatedMovies
  .forEach((movie) => renderTemplate(topRatedList, createMovieTemplate(movie), `beforeend`));
mostCommentedMovies
  .forEach((movie) => renderTemplate(mostCommentedList, createMovieTemplate(movie), `beforeend`));

if (movies.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  renderTemplate(mainList, createShowMoreButtonTemplate(), `afterend`);

  const showMoreButton = board.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((movie) => renderTemplate(mainList, createMovieTemplate(movie), `beforeend`));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(siteMain, createPopupTemplate(movies[0], getComments(movies[0].id)), `beforeend`);
renderTemplate(siteFooter, createCounterTemplate(), `beforeend`);

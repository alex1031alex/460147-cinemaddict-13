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

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

render(siteHeader, createUserProfileTemplate(), `beforeend`);
render(siteMain, createMenuTemplate(), `beforeend`);
render(siteMain, createSortTemplate(), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const board = siteMain.querySelector(`.films`);

render(board, createMainListTemplate(), `beforeend`);
render(board, createTopRatedListTemplate(), `beforeend`);
render(board, createMostCommentedListTemplate(), `beforeend`);

const mainList = board.querySelector(`.films-list .films-list__container`);
const topRatedList = board.querySelector(`.films-list--rated .films-list__container`);
const mostCommentedList = board.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(mainList, createMovieTemplate(), `beforeend`);

  if (i < EXTRA_FILM_COUNT) {
    render(topRatedList, createMovieTemplate(), `beforeend`);
    render(mostCommentedList, createMovieTemplate(), `beforeend`);
  }
}

render(mainList, createShowMoreButtonTemplate(), `afterend`);
render(siteMain, createPopupTemplate(), `beforeend`);
render(siteFooter, createCounterTemplate(), `beforeend`);

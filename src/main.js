import MenuView from "./view/menu.js";
import CounterView from "./view/counter.js";
import StatsView from "./view/stats.js";
import {generateMovie} from "./mock/movie.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import UserProfilePresenter from "./presenter/user-profile.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuItem} from "./const.js";

const MOVIE_COUNT = 23;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const moviesModel = new MoviesModel();
moviesModel.set(movies);

const filterModel = new FilterModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const userProfilePresenter = new UserProfilePresenter(siteHeader, moviesModel);
userProfilePresenter.init();

const menuComponent = new MenuView();
const counterComponent = new CounterView(movies.length);

const watchedMovies = moviesModel.get().filter((movie) => movie.userInfo.isWatched);
const statsComponent = new StatsView(watchedMovies);
statsComponent.hide();

render(siteMain, menuComponent, RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

const boardPresenter = new BoardPresenter(siteMain, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteNavigation, filterModel, moviesModel);

const handleMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS) {
    boardPresenter.hide();
    statsComponent.show();
    filterPresenter.resetActiveFilter();
  } else {
    statsComponent.hide();
    boardPresenter.show();
  }
};

menuComponent.setClickHandler(handleMenuClick);

filterPresenter.init();
boardPresenter.init();

render(siteMain, statsComponent, RenderPosition.BEFOREEND);
render(siteFooter, counterComponent, RenderPosition.BEFOREEND);

import MenuView from "./view/menu.js";
import CounterView from "./view/counter.js";
import StatsView from "./view/stats.js";
import {generateMovie} from "./mock/movie.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import UserProfilePresenter from "./presenter/user-profile.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition, replace} from "./utils/render.js";
import {MenuItem} from "./const.js";
import Api from "./api.js";

const MOVIE_COUNT = 23;
const AUTHORIZATION = `Basic Ft76bvG9xxN82L3muu18`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const api = new Api(END_POINT, AUTHORIZATION);
api.getMovies().then((movies) => {

});

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
let statsComponent = null;

render(siteMain, menuComponent, RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

const boardPresenter = new BoardPresenter(siteMain, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteNavigation, filterModel, moviesModel);

const handleMenuClick = (menuItem) => {
  if (menuItem !== MenuItem.STATS) {
    statsComponent.hide();
    boardPresenter.show();
    return;
  }

  let prevStatsComponent = statsComponent;
  const watchedMovies = moviesModel.get().filter((movie) => movie.userInfo.isWatched);
  const currentUserRank = userProfilePresenter.getCurrentUserRank();
  statsComponent = new StatsView(watchedMovies, currentUserRank);

  if (prevStatsComponent === null) {
    boardPresenter.hide();
    render(siteMain, statsComponent, RenderPosition.BEFOREEND);
    filterPresenter.resetActiveFilter();
    return;
  }

  replace(statsComponent, prevStatsComponent);

  boardPresenter.hide();
  statsComponent.show();
  filterPresenter.resetActiveFilter();
};

menuComponent.setClickHandler(handleMenuClick);

filterPresenter.init();
boardPresenter.init();

render(siteFooter, counterComponent, RenderPosition.BEFOREEND);

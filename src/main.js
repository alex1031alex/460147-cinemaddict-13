import MenuView from "./view/menu.js";
import CounterView from "./view/counter.js";
import StatsView from "./view/stats.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import UserProfilePresenter from "./presenter/user-profile.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition, replace} from "./utils/render.js";
import {MenuItem, UpdateType} from "./const.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTHORIZATION = `Basic Ft76bvG9xxN82L3muu18`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-cache`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const PageTitle = {
  ONLINE: `Cinemaddict`,
  OFFLINE: `Cinemaddict [offline]`
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const pageTitle = document.querySelector(`.header__logo`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

let statsComponent = null;
let counterComponent = null;
const menuComponent = new MenuView();

const userProfilePresenter = new UserProfilePresenter(siteHeader, moviesModel);

userProfilePresenter.init();
render(siteMain, menuComponent, RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

const boardPresenter = new BoardPresenter(siteMain, moviesModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(siteNavigation, filterModel, moviesModel);

const handleMenuClick = (menuItem) => {
  if (menuItem !== MenuItem.STATS) {
    statsComponent.hide();
    boardPresenter.show();
    return;
  }

  const prevStatsComponent = statsComponent;
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

apiWithProvider.getMovies()
    .then((movies) => {
      moviesModel.set(UpdateType.INIT, movies);
      counterComponent = new CounterView(moviesModel.get().length);
      render(siteFooter, counterComponent, RenderPosition.BEFOREEND);
    })
    .catch(() => {
      moviesModel.set(UpdateType.INIT, []);
    });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  pageTitle.textContent = PageTitle.ONLINE;

  if (apiWithProvider.isSyncronizationNeeded) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  pageTitle.textContent = PageTitle.OFFLINE;
});

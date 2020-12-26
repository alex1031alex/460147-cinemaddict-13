import UserProfileView from "./view/user-profile.js";
import MenuView from "./view/menu.js";
import CounterView from "./view/counter.js";
import {generateMovie} from "./mock/movie.js";
import {generateUserRank} from "./mock/user-rank.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";

const MOVIE_COUNT = 23;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const watchedMovies = movies.filter((movie) => movie.userInfo.isWatched);

const userRank = generateUserRank(watchedMovies.length);

const moviesModel = new MoviesModel();
moviesModel.set(movies);

const filterModel = new FilterModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const userProfileComponent = new UserProfileView(userRank);
const menuComponent = new MenuView();
const counterComponent = new CounterView(movies.length);

render(siteHeader, userProfileComponent, RenderPosition.BEFOREEND);
render(siteMain, menuComponent, RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

const boardPresenter = new BoardPresenter(siteMain, moviesModel, filterModel);
const filterPresenter = new FilterPresenter(siteNavigation, filterModel, moviesModel);

filterPresenter.init();
boardPresenter.init();

render(siteFooter, counterComponent, RenderPosition.BEFOREEND);

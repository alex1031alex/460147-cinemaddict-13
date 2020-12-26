import UserProfileView from "./view/user-profile.js";
import MenuView from "./view/menu.js";
import CounterView from "./view/counter.js";
import FilterView from "./view/filter.js";
import {generateMovie} from "./mock/movie.js";
import {generateFilter} from "./mock/filter.js";
import {generateUserRank} from "./mock/user-rank.js";
import BoardPresenter from "./presenter/board.js";
import MoviesModel from "./model/movies.js";
import {render, RenderPosition} from "./utils/render.js";
import {FilterName} from "./const.js";

const MOVIE_COUNT = 23;

const movies = new Array(MOVIE_COUNT).fill().map(generateMovie);
const watchedMovies = movies.filter((movie) => movie.userInfo.isWatched);

const filters = generateFilter(movies);
const userRank = generateUserRank(watchedMovies.length);

const moviesModel = new MoviesModel();
moviesModel.set(movies);

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const userProfileComponent = new UserProfileView(userRank);
const menuComponent = new MenuView();
const filterComponent = new FilterView(filters, FilterName.ALL_MOVIES);
const counterComponent = new CounterView(movies.length);

render(siteHeader, userProfileComponent, RenderPosition.BEFOREEND);
render(siteMain, menuComponent, RenderPosition.BEFOREEND);

const siteNavigation = siteMain.querySelector(`.main-navigation`);

render(siteNavigation, filterComponent, RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(siteMain, moviesModel);
boardPresenter.init();

render(siteFooter, counterComponent, RenderPosition.BEFOREEND);

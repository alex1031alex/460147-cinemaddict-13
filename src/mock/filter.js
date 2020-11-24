import {FilterName} from "../const.js";

const movieToFilterMap = {
  [FilterName.ALL_MOVIES]: (movies) => movies.length,
  [FilterName.WATCHLIST]: (movies) => movies
    .filter((movie) => movie.userInfo.isAtWatchlist).length,
  [FilterName.HISTORY]: (movies) => movies
    .filter((movie) => movie.userInfo.isWatched).length,
  [FilterName.FAVORITES]: (movies) => movies
    .filter((movie) => movie.userInfo.isFavorite).length,
};

const generateFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};

export {generateFilter};

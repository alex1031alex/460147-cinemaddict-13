import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {FilterName} from "../const.js";
dayjs.extend(duration);

export const convertToHourFormat = (timeInMinutes) => {
  const hours = dayjs.duration(timeInMinutes, `m`).hours();
  const minutes = dayjs.duration(timeInMinutes, `m`).minutes();

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

export const sortByDate = (movieA, movieB) => {
  return movieB.releaseDate.getTime() - movieA.releaseDate.getTime();
};

export const sortByRating = (movieA, movieB) => {
  return movieB.rating - movieA.rating;
};

export const filter = {
  [FilterName.ALL_MOVIES]: (movies) => movies,
  [FilterName.WATCHLIST]: (movies) => movies.filter((movie) => movie.userInfo.isAtWatchlist),
  [FilterName.HISTORY]: (movies) => movies.filter((movie) => movie.userInfo.isWatched),
  [FilterName.FAVORITES]: (movies) => movies.filter((movie) => movie.userInfo.isFavorite),
};

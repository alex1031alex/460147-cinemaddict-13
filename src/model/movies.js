import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  set(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  get() {
    return this._movies;
  }

  update(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const userInfo = {
      isAtWatchlist: movie.user_details.watchlist,
      isWatched: movie.user_details.already_watched,
      isFavorite: movie.user_details.favorite,
      watchingDate: new Date(movie.user_details.watching_date)
    };

    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          title: movie.film_info.title,
          poster: movie.film_info.poster,
          description: movie.film_info.description,
          rating: movie.film_info.total_rating,
          releaseDate: new Date(movie.film_info.release.date),
          runtime: movie.film_info.runtime,
          genres: movie.film_info.genre,
          original: movie.film_info.alternative_title,
          age: movie.film_info.age_rating,
          director: movie.film_info.director,
          writers: movie.film_info.writers,
          actors: movie.film_info.actors,
          country: movie.film_info.release.release_country,
          userInfo,
        }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const filmInfo = {
      [`actors`]: movie.actors,
      [`age_rating`]: movie.age,
      [`alternative_title`]: movie.original,
      [`description`]: movie.description,
      [`director`]: movie.director,
      [`genre`]: movie.genres,
      [`poster`]: movie.poster,
      [`release`]: {
        [`date`]: movie.releaseDate.toISOString(),
        [`release_country`]: movie.country
      },
      [`runtime`]: movie.runtime,
      [`title`]: movie.title,
      [`total_rating`]: movie.rating
    };

    const userDetails = {
      [`already_watched`]: movie.userInfo.isWatched,
      [`favorite`]: movie.userInfo.isFavorite,
      [`watching_date`]: movie.userInfo.isWatched ?
        movie.userInfo.watchingDate.toISOString() : null,
      [`watchlist`]: movie.userInfo.isAtWatchlist
    };

    const adaptedMovie = {
      [`film_info`]: filmInfo,
      [`user_details`]: userDetails,
      [`id`]: movie.id,
      [`comments`]: movie.comments
    };

    return adaptedMovie;
  }
}

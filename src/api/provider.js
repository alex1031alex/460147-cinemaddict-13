import MoviesModel from "../model/movies.js";

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  getComments(movieId) {
    if (this._isOnline()) {
      return this._api.getComments(movieId);
    }

    return Promise.resolve([]);
  }

  updateMovie(movie) {
    if (this._isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._store.setItem(String(movie.id), MoviesModel.adaptToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  addComment(movieId, localComment) {
    if (this._isOnline()) {
      return this._api.addComment(movieId, localComment)
        .then(({movie, comments}) => {
          this._store.setItem(movie.id, MoviesModel.adaptToServer(movie));
          return {movie, comments};
        });
    }

    return Promise.reject(new Error(`Add new comment failed`));
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  sync() {
    if (this._isOnline()) {
      const storeMovies = Object.values(this._store.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const items = createStoreStructure(response.updated);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

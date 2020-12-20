import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  set(movies) {
    this._movies = movies.slice();
  }

  get() {
    return this._movies;
  }
}

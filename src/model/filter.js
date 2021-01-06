import Observer from "../utils/observer.js";
import {FilterName} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterName.ALL_MOVIES;
  }

  set(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeFilter;
  }
}

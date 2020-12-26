import Observer from "../utils/observer.js";
import {FilterName} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterName.ALL_MOVIES;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

import FilterView from "../view/filter.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {filter} from "../utils/movie.js";
import {FilterName, UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, moviesModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init(isFilterReset = false) {
    if (isFilterReset) {
      this._currentFilter = null;
    } else {
      this._currentFilter = this._filterModel.get();
    }

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  resetActiveFilter() {
    this.init(true);
  }

  _getFilters() {
    const movies = this._moviesModel.get();

    return Object
      .values(FilterName)
      .map((filterName) => {
        return {name: filterName, count: filter[filterName](movies).length};
      });
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}

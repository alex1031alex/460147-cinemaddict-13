import AbstractView from "./abstract.js";
import {FilterName} from "../const.js";

const FILTER_ACTIVE_CLASS_NAME = `main-navigation__item--active`;

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count} = filter;

  const nameTemplate = name.toLowerCase();
  const countTemplate = filter.name !== FilterName.ALL_MOVIES ?
    `<span class="main-navigation__item-count">${count}</span>` :
    ``;
  const activeClassTemplate = (currentFilterType === name) ?
    FILTER_ACTIVE_CLASS_NAME :
    ``;

  return `<a
    href="#${nameTemplate}"
    class="main-navigation__item ${activeClassTemplate}"
    data-type="${name}"
  >${name} ${countTemplate}</a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(`\n`);

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this
      .getElement()
      .addEventListener(`click`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._callback.filterTypeChange(evt.target.dataset.type);
  }
}

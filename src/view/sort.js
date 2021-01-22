import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const SORT_ACTIVE_CLASS_NAME = `sort__button--active`;

const createSortItemTemplate = (sortType, currentSortType) => {
  return `<li>
    <a href="#"
      class="sort__button ${currentSortType === sortType ? SORT_ACTIVE_CLASS_NAME : ``}" 
      data-sort-type="${sortType}"
    >Sort by ${sortType}</a>
  </li>`;
};

const createSortTemplate = (currentSortType) => {
  const sortItemsTemplate = Object
    .values(SortType)
    .map((sortType) => createSortItemTemplate(sortType, currentSortType))
    .join(`\n`);

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

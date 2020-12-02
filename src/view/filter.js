import AbstractView from "./abstract.js";
import {FilterName} from "../const.js";

const FILTER_ACTIVE_CLASS_NAME = `main-navigation__item--active`;

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  const nameTemplate = name.toLowerCase();
  const countTemplate = filter.name !== FilterName.ALL_MOVIES ?
    `<span class="main-navigation__item-count">${count}</span>` :
    ``;
  const activeClassTemplate = isActive ?
    FILTER_ACTIVE_CLASS_NAME :
    ``;

  return `<a
    href="#${nameTemplate}"
    class="main-navigation__item ${activeClassTemplate}"
  >${name} ${countTemplate}</a>`;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(`\n`);

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}

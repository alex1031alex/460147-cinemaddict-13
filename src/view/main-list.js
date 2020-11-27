import {createElement} from "../utils.js";

const createMainListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class MainList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

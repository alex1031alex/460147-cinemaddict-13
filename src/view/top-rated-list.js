import {createElement} from "../utils.js";

const createTopRatedListTemplate = () => (
  `<section class="films-list--extra films-list--rated">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class TopRatedList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTopRatedListTemplate();
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

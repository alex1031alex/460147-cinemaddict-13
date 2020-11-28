import {createElement} from "../utils.js";

const createCounterTemplate = (movieCount) => (
  `<section class="footer__statistics">
    <p>${movieCount} movies inside</p>
  </section>`
);

export default class Counter {
  constructor(movieCount) {
    this._movieCount = movieCount;
    this._element = null;
  }

  getTemplate() {
    return createCounterTemplate(this._movieCount);
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

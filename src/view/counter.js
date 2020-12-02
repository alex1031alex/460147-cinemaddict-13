import AbstractView from "./abstract.js";

const createCounterTemplate = (movieCount) => (
  `<section class="footer__statistics">
    <p>${movieCount} movies inside</p>
  </section>`
);

export default class Counter extends AbstractView {
  constructor(movieCount) {
    super();
    this._movieCount = movieCount;
  }

  getTemplate() {
    return createCounterTemplate(this._movieCount);
  }
}

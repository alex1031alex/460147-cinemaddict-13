import AbstractView from "./abstract.js";

const createMainListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class MainList extends AbstractView {
  getTemplate() {
    return createMainListTemplate();
  }

  getMovieContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}

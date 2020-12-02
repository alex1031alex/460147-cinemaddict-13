import AbstractView from "./abstract.js";

const createTopRatedListTemplate = () => (
  `<section class="films-list--extra films-list--rated">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class TopRatedList extends AbstractView {
  getTemplate() {
    return createTopRatedListTemplate();
  }

  getMovieContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}

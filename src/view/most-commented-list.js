import AbstractView from "./abstract.js";

const createMostCommentedListTemplate = () => (
  `<section class="films-list--extra films-list--commented">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

export default class MostCommentedList extends AbstractView {
  getTemplate() {
    return createMostCommentedListTemplate();
  }

  getMovieContainer() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}

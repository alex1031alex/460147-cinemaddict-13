import AbstractView from "./abstract.js";

const createBoardTemplate = () => `<section class="films"></section>`;

export default class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}

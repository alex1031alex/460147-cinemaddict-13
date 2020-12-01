import AbstractView from "./abstract.js";

const createMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class Menu extends AbstractView {
  getTemplate() {
    return createMenuTemplate();
  }
}

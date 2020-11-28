import {createElement} from "../utils.js";

const createUserProfileTemplate = (userRank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img
      class="profile__avatar"
      src="images/bitmap@2x.png"
      alt="Avatar"
      width="35"
      height="35"
    >
  </section>`
);

export default class UserProfile {
  constructor(userRank) {
    this._userRank = userRank;
    this._element = null;
  }

  getTemplate() {
    return createUserProfileTemplate(this._userRank);
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

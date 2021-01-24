import Abstract from "./abstract.js";
import {HIDE_ELEMENT_CLASS} from "../const.js";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._localData = {};
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateLocalData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._localData = Object.assign(
        {},
        this._localData,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  hide() {
    this.getElement().classList.add(HIDE_ELEMENT_CLASS);
  }

  show() {
    this.getElement().classList.remove(HIDE_ELEMENT_CLASS);
  }
}

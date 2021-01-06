import Abstract from "./abstract.js";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._localData = {};
  }

  updateElement() {
    let prevElement = this.getElement();
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
}

import { ChildrenNotFoundError, ElementNotFoundError } from "./error.js";

class Content {
  constructor(selector) {
    this._current = 0;
    this._selector = selector;

    this._element = document.querySelector(selector);

    if (!this._element) {
      throw new ElementNotFoundError(this._selector);
    }

    const children = Array.from(this._element.children);

    if (children.length === 0) {
      throw new ChildrenNotFoundError(this._selector);
    }

    this._items = children;
  }

  toggle(index) {
    this._current = index;

    this._items.forEach((item, itemIndex) => {
      if (this._current === itemIndex) {
        item.setAttribute("aria-hidden", false);
        item.classList.remove("hidden");
        return;
      }

      item.setAttribute("aria-hidden", true);
      item.classList.add("hidden");
    });
  }
}

export default Content;

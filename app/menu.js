import { ChildrenNotFoundError, ElementNotFoundError } from "./error.js";
import MenuItem from "./menu-item.js";

class Menu {
  constructor(selector) {
    this._current = 0;
    this._onChange = () => {};
    this._selector = selector;

    this._element = document.querySelector(selector);

    if (!this._element) {
      throw new ElementNotFoundError(this._selector);
    }

    const children = Array.from(this._element.children);

    if (children.length === 0) {
      throw new ChildrenNotFoundError(this._selector);
    }

    this._items = children.map((child, index) => {
      const item = new MenuItem(child);

      item.onClick(() => {
        this._toggle(index);
        this._onChange(index);
      });

      return item;
    });

    this._items[0].selected = true;
  }

  onChange(callback) {
    this._onChange = callback;
  }

  _toggle(index) {
    this._current = index;

    this._items.forEach((item, itemIndex) => {
      if (this._current === itemIndex) {
        item.selected = true;
        return;
      }

      item.selected = false;
    });
  }
}

export default Menu;

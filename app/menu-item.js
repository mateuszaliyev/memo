class MenuItem {
  constructor(element) {
    this._element = element;
    this._onClick = () => {};
    this._selected = false;

    this._element.addEventListener("click", () => {
      this._handleClick();
    });
  }

  get selected() {
    return this._selected;
  }

  _handleClick() {
    this._onClick();
  }

  onClick(callback) {
    this._onClick = callback;
  }

  set selected(value) {
    this._selected = value;

    if (this._selected) {
      this._element.classList.add("menu__item--selected");
      return;
    }

    this._element.classList.remove("menu__item--selected");
  }
}

export default MenuItem;

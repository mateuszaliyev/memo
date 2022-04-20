class Card {
  constructor(imageName) {
    this._disabled = false;
    this._image = null;
    this._imageName = imageName;
    this._imageUrl = `images/${this._imageName}.png`;
    this._onClick = () => {};
    this._visible = false;

    this._element = document.createElement("figure");
    this._element.classList.add("card");
    this._element.addEventListener("click", () => {
      this._onClick();
    });
    this._element.addEventListener("transitionend", () => {
      if (!this._visible) {
        this._element.replaceChildren();
      }
    });

    this._update();
  }

  disable() {
    this._disabled = true;
    this._update();
  }

  enable() {
    this._disabled = false;
    this._update();
  }

  get disabled() {
    return this._disabled;
  }

  get element() {
    return this._element;
  }

  get imageName() {
    return this._imageName;
  }

  get visible() {
    return this._visible;
  }

  hide() {
    this._visible = false;
    this._update();
  }

  onClick(callback) {
    this._onClick = callback;
  }

  show() {
    this._visible = true;
    this._update();
  }

  _update() {
    const toggleClasses = () => {
      this._element.classList.toggle("card--disabled", this._disabled);
      this._element.classList.toggle("card--visible", this._visible);
    };

    if (this._visible) {
      this._image = new Image();
      this._image.onload = () => toggleClasses();
      this._image.setAttribute("alt", "Karta");
      this._image.setAttribute("src", this._imageUrl);
      this._element.replaceChildren(this._image);
      return;
    }

    toggleClasses();
  }
}

export default Card;

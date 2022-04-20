import Card from "./card.js";
import { ElementNotFoundError } from "./error.js";
import { shuffleArray } from "./utilities.js";

class Memo {
  constructor(selector, size) {
    this._selector = selector;

    this._element = document.querySelector(selector);

    if (!this._element) {
      throw new ElementNotFoundError(this._selector);
    }

    this._moves = 0;
    this._onGameOver = () => {};
    this._size = size;
    this._visibleCard = null;

    if (this._size > Memo.max) {
      this._size = Memo.max;
    }

    if (this._size < Memo.min) {
      this._size = Memo.min;
    }

    this._element.style.cssText = `--memo-columns: ${Math.round(
      Math.sqrt(this._size)
    )};`;

    this._cards = [];

    for (let index = 0; index < this._size; index++) {
      this._cards.push(new Card(Math.floor(index / 2)));
    }

    this._shuffleCards();

    this._cards.forEach((card, index) => {
      card.onClick(() => {
        this._move(index);
      });
    });

    this._element.replaceChildren(...this._cards.map((card) => card.element));

    this._canMove = true;
  }

  get moves() {
    return this._moves;
  }

  static get max() {
    return 16;
  }

  static get min() {
    return 4;
  }

  get size() {
    return this._size;
  }

  isGameOver() {
    return this._cards.every((card) => card.disabled && card.visible);
  }

  _move(cardIndex) {
    if (
      !this._canMove ||
      this._cards[cardIndex].disabled ||
      this._cards[cardIndex].visible
    ) {
      return;
    }

    const nextMove = () => {
      this._moves++;
      this._canMove = true;
    };

    this._canMove = false;
    this._cards[cardIndex].show();

    if (this._moves % 2) {
      if (
        this._cards[cardIndex].imageName !==
        this._cards[this._visibleCard].imageName
      ) {
        setTimeout(() => {
          this._cards[cardIndex].hide();
          this._cards[this._visibleCard].hide();
          nextMove();
        }, 1000);
        return;
      }

      this._cards[cardIndex].disable();
      this._cards[this._visibleCard].disable();

      if (this.isGameOver()) {
        this._moves++;
        this._onGameOver();
        return;
      }

      nextMove();
      return;
    }

    this._visibleCard = cardIndex;
    nextMove();
  }

  onGameOver(callback) {
    this._onGameOver = callback;
  }

  _shuffleCards() {
    this._cards = shuffleArray(this._cards);
  }
}

export default Memo;

class Result {
  constructor({ date, max, min, moves, size, username }) {
    if (!date || !max || !min || !moves || !size || !username) {
      throw new Error("Informacje na temat wyniku są niekompletne.");
    }

    this._date = date;
    this._max = max;
    this._min = min;
    this._moves = moves;
    this._size = size;
    this._username = username;
  }

  get date() {
    return this._date;
  }

  get moves() {
    return this._moves;
  }

  get score() {
    const percentage = this._size / this._moves;

    return Math.round(100 * percentage) * this._size;
  }

  get size() {
    return this._size;
  }

  get username() {
    return this._username;
  }

  toObject() {
    return {
      date: this._date.toJSON(),
      moves: this._moves,
      size: this._size,
      username: this._username,
    };
  }
}

export default Result;

class ScoreboardItem {
  constructor({ rank, result }) {
    this._rank = rank;
    this._result = result;

    this._element = document.createElement("li");
    this._element.classList.add("scoreboard__item");
    this._update();
  }

  get() {
    return this._element;
  }

  _update() {
    const rank = document.createElement("div");
    rank.classList.add("scoreboard__rank");
    rank.textContent = `#${this._rank}`;

    const info = document.createElement("div");
    info.classList.add("scoreboard__info");

    const username = document.createElement("div");
    username.classList.add("scoreboard__username");
    username.textContent = this._result.username;

    const date = document.createElement("div");
    date.classList.add("scoreboard__date");
    date.textContent = this._result.date.toLocaleString();

    const details = document.createElement("div");
    details.classList.add("scoreboard__details");

    const moves = document.createElement("div");
    moves.classList.add("scoreboard__moves");
    moves.textContent = this._result.moves;

    const size = document.createElement("div");
    size.classList.add("scoreboard__size");
    size.textContent = this._result.size;

    const score = document.createElement("div");
    score.classList.add("scoreboard__score");
    score.textContent = this._result.score;

    info.replaceChildren(username, date);
    this._element.replaceChildren(rank, info, moves, size, score);
  }
}

export default ScoreboardItem;

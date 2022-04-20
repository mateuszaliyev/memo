import { ElementNotFoundError } from "./error.js";
import Memo from "./memo.js";
import Result from "./result.js";
import ScoreboardItem from "./scoreboard-item.js";

class Scoreboard {
  constructor(selector) {
    this._results = [];
    this._selector = selector;

    this._element = document.querySelector(selector);

    if (!this._element) {
      throw new ElementNotFoundError(this._selector);
    }

    this._clear = document.querySelector(`${this._selector}-clear`);
    this._export = document.querySelector(`${this._selector}-export`);
    this._header = document.querySelector(`${this._selector}-header`);
    this._import = document.querySelector(`${this._selector}-import`);

    if (!this._clear) throw new ElementNotFoundError(`${this._selector}-clear`);
    if (!this._export)
      throw new ElementNotFoundError(`${this._selector}-export`);
    if (!this._header)
      throw new ElementNotFoundError(`${this._selector}-header`);
    if (!this._import)
      throw new ElementNotFoundError(`${this._selector}-import`);

    this._clear.addEventListener("click", () => {
      const shouldClear = confirm("Obecny ranking zostanie utracony.");

      if (shouldClear) {
        this.clear();
      }
    });

    this._export.addEventListener("click", () => {
      this.export();
    });

    this._import.addEventListener("click", () => {
      const shouldImport = this._results.length
        ? confirm("Obecny ranking zostanie utracony.")
        : true;

      if (shouldImport) {
        this.import();
      }
    });

    this.read();
    this._update();
  }

  add(result) {
    this._results.push(result);
    this.store();
    this._update();
  }

  clear() {
    this._results = [];
    this.store();
    this._update();
  }

  export() {
    const jsonResults = this._results.map((result) => ({
      date: result.date.toJSON(),
      moves: result.moves,
      size: result.size,
      username: result.username,
    }));

    const data = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(jsonResults)
    )}`;

    const downloadElement = document.createElement("a");

    downloadElement.setAttribute("download", "scoreboard.json");
    downloadElement.setAttribute("href", data);
    downloadElement.click();
    downloadElement.remove();
  }

  get() {
    return this._results;
  }

  import() {
    const fileInput = document.createElement("input");
    fileInput.classList.add("hidden");
    fileInput.setAttribute("accept", "application/json");
    fileInput.setAttribute("type", "file");

    fileInput.addEventListener("change", (event) => {
      const files = event.target.files;

      if (!files.length) {
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        const results = JSON.parse(event.target.result);

        this._results = results.map(
          (result) =>
            new Result({
              ...result,
              date: new Date(result.date),
              max: Memo.max,
              min: Memo.min,
            })
        );

        this.store();
        this._update();
      };

      fileReader.readAsText(files[0]);
    });

    fileInput.click();
    fileInput.remove();
  }

  read() {
    const localResults = localStorage.getItem("scoreboard");

    if (localResults) {
      const results = JSON.parse(localResults);

      this._results = results.map(
        (result) =>
          new Result({
            ...result,
            date: new Date(result.date),
            max: Memo.max,
            min: Memo.min,
          })
      );
    }
  }

  store() {
    const results = this._results.map((result) => result.toObject());
    localStorage.setItem("scoreboard", JSON.stringify(results));
  }

  _update() {
    this._clear.disabled = !this._results.length;
    this._export.disabled = !this._results.length;

    this._clear.classList.toggle("hidden", !this._results.length);
    this._export.classList.toggle("hidden", !this._results.length);
    this._header.classList.toggle("hidden", !this._results.length);

    const items = this._results
      .sort((a, b) =>
        a.score > b.score
          ? -1
          : a.score < b.score
          ? 1
          : a.date < b.date
          ? -1
          : 1
      )
      .map((result, index) =>
        new ScoreboardItem({
          rank: index + 1,
          result,
        }).get()
      );

    this._element.replaceChildren(...items);
  }
}

export default Scoreboard;

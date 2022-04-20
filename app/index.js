import Content from "./content.js";
import Memo from "./memo.js";
import Menu from "./menu.js";
import Result from "./result.js";
import Scoreboard from "./scoreboard.js";
import Settings from "./settings.js";

class App {
  constructor() {
    this._content = new Content("#main");
    this._menu = new Menu("#menu");
    this._scoreboard = new Scoreboard("#scoreboard");
    this._settings = new Settings("#settings");

    this._memo = null;

    this._newGame();

    this._menu.onChange((index) => {
      this._content.toggle(index);
    });

    this._settings.onSettingChange((setting, value) => {
      if (setting === "size") {
        const shouldGameRestart = this._memo.moves
          ? confirm("Obecna rozgrywka zostanie utracona.")
          : true;

        if (shouldGameRestart) {
          this._newGame();
        }
      }
    });
  }

  _newGame() {
    this._memo = new Memo("#memo", this._settings.get("size"));

    this._memo.onGameOver(() => {
      setTimeout(() => {
        const username =
          prompt(
            `Koniec gry! Ilość ruchów: ${this._memo.moves}.\n\nPodaj imię:`
          ) || `Gracz ${Math.floor(Math.random() * (1e6 - 1)) + 1}`;

        this._scoreboard.add(
          new Result({
            date: new Date(),
            max: Memo.max,
            min: Memo.min,
            moves: this._memo.moves,
            size: this._memo.size,
            username,
          })
        );

        this._newGame();
      }, 1000);
    });
  }
}

new App();

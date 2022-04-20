class Theme {
  constructor() {
    this._system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    this._theme = "system";

    this._read();
    this._update();
  }

  get() {
    return this._theme;
  }

  static isSupported(theme) {
    return Theme.supported().includes(theme);
  }

  _read() {
    const localTheme = localStorage.getItem("theme");

    if (Theme.isSupported(localTheme)) {
      this._theme = localTheme;
      this._update();
    }
  }

  resolved() {
    return this._theme === "system" ? this._system : this._theme;
  }

  set(theme) {
    if (!Theme.isSupported(theme)) {
      console.warn(`Motyw \`${theme}\` nie jest wspierany.`);
    }

    this._theme = theme;
    this._store();
    this._update();
  }

  _store() {
    localStorage.setItem("theme", this._theme);
  }

  static supported() {
    return ["dark", "light", "system"];
  }

  _update() {
    Theme.supported().forEach((supportedTheme) => {
      document.documentElement.classList.toggle(
        supportedTheme,
        supportedTheme === this.resolved()
      );
    });
  }
}

export default Theme;

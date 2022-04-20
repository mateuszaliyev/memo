import { ElementNotFoundError } from "./error.js";
import { TextFieldSetting, SelectSetting } from "./setting.js";
import Theme from "./theme.js";

class Settings {
  constructor(selector) {
    this._selector = selector;

    this._element = document.querySelector(selector);

    if (!this._element) {
      throw new ElementNotFoundError(this._selector);
    }

    this._onSettingChange = () => {};
    this._theme = new Theme();

    this._settings = [
      new SelectSetting({
        label: "Motyw",
        name: "theme",
        onChange: (value) => {
          this._theme.set(value);
          this._onSettingChange("theme", value);
        },
        options: [
          {
            label: "Ciemny",
            value: "dark",
          },
          {
            label: "Jasny",
            value: "light",
          },
          {
            label: "Systemowy",
            value: "system",
          },
        ],
        selected: Theme.supported().findIndex(
          (theme) => theme === this._theme.get()
        ),
      }),
      new TextFieldSetting({
        initial: 16,
        label: "Rozmiar planszy",
        max: 16,
        min: 4,
        name: "size",
        onChange: (value) => {
          this._onSettingChange("size", value);
        },
        step: 2,
        type: "number",
      }),
    ];

    this._form = document.createElement("form");
    this._form.classList.add("settings__form");
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    const settingElements = this._settings.map((setting) => setting.element);

    this._form.replaceChildren(...settingElements);

    this._element.replaceChildren(this._form);
  }

  get(settingName) {
    return this._settings.find((setting) => setting._name === settingName)
      ?.value;
  }

  onSettingChange(callback) {
    this._onSettingChange = callback;
  }
}

export default Settings;

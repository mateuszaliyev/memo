export class Setting {
  constructor({ label, name, onChange = () => {} }) {
    this._id = `setting-${name}`;
    this._label = label;
    this._name = name;
    this._onChange = onChange;

    this._element = document.createElement("div");
    this._element.classList.add("setting");

    this._inputElement = null;

    this._labelElement = document.createElement("label");
    this._labelElement.setAttribute("for", this._id);
    this._labelElement.textContent = this._label;
  }

  get element() {
    return this._element;
  }

  onChange(callback) {
    this._onChange = callback;
  }

  _setInputElement(inputElement) {
    this._element.replaceChildren(this._labelElement, inputElement);
  }
}

export class SelectSetting extends Setting {
  constructor({ label, name, onChange, options, selected = null }) {
    super({ label, name, onChange });

    this._options = options.map((option) => {
      if (option.label === undefined || option.value === undefined) {
        throw new Error(`Lista \`${name}\` otrzymała nieprawidłową wartość.`);
      }

      return option;
    });

    this._selected = selected ?? 0;

    this._selectElement = document.createElement("select");
    this._selectElement.id = this._id;
    this._selectElement.addEventListener("change", (event) => {
      this._onChange(event.target.value);
    });

    const optionElements = this._options.map((option, index) => {
      const optionElement = document.createElement("option");

      if (index === selected) {
        optionElement.setAttribute("selected", true);
      }

      optionElement.setAttribute("value", option.value);
      optionElement.textContent = option.label;

      return optionElement;
    });

    this._selectElement.replaceChildren(...optionElements);
    this._setInputElement(this._selectElement);
  }

  get value() {
    return this._options[this._selected].value;
  }
}

export class TextFieldSetting extends Setting {
  constructor({ initial, label, max, min, name, onChange, step, type }) {
    super({ label, name, onChange });

    if (!TextFieldSetting.types().includes(type)) {
      throw new Error(`Typ \`${type}\` pola \`${name}\` nie jest wspierany.`);
    }

    this._max = max;
    this._min = min;
    this._step = step;
    this._type = type;
    this._value = initial > max ? max : initial < min ? min : initial;

    this._textFieldElement = document.createElement("input");
    this._textFieldElement.setAttribute("max", this._max);
    this._textFieldElement.setAttribute("min", this._min);
    this._textFieldElement.setAttribute("step", this._step);
    this._textFieldElement.setAttribute("type", this._type);
    this._textFieldElement.id = this._id;
    this._textFieldElement.value = this._value;
    this._textFieldElement.addEventListener("input", (event) => {
      this._value = Math.floor(event.target.value / this._step) * this._step;
      this._onChange(this._value);
    });

    this._setInputElement(this._textFieldElement);
  }

  get value() {
    return this._value;
  }

  static types() {
    return ["number", "text"];
  }
}

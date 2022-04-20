export class ChildrenNotFoundError extends Error {
  constructor(selector) {
    super(`Element \`${selector}\` nie posiada żadnych potomków.`);
    this.name = this.constructor.name;
  }
}

export class ElementNotFoundError extends Error {
  constructor(selector) {
    super(`Element \`${selector}\` nie został znaleziony.`);
    this.name = this.constructor.name;
  }
}

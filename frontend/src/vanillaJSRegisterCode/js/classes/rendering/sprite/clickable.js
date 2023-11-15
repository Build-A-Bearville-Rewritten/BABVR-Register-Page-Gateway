import AbstractMouse from './abstract-mouse.js';

export default class Clickable extends AbstractMouse {
  constructor() {
    super();
    this.callbacks = [];
    this.clickEvent = document.addEventListener(
      'click',
      this.onDocumentClicked.bind(this)
    );
  }

  onClick(sprite, callback) {
    const clickHandler = event => {
      if (this.mouseIsOnSprite(sprite, event) && callback) callback(event);
    };

    this.callbacks.push(clickHandler);
  }

  onDocumentClicked(event) {
    for (const callback of this.callbacks) callback(event);
  }

  destroy() {
    this.callbacks = [];
    document.removeEventListener('click', this.clickEvent);
  }
}

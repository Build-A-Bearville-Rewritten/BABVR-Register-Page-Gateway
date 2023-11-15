export default class AbstractMouse {
  constructor() {}

  mouseIsOnSprite(sprite, event) {
    let isInBounds = false;

    const rect = sprite.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pos = sprite.getPosition();
    const size = sprite.getSize();

    isInBounds =
      x >= pos.x && x < pos.x + size.x && y >= pos.y && y < pos.y + size.y;

    return isInBounds;
  }

  destroy() {}
}

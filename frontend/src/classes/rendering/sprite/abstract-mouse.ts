import type { Point2D, Size2D } from '../../../types/common.js';

/**
 * Interface for sprites that can be checked for mouse interaction
 */
interface ISpriteWithMouse {
  canvas?: HTMLCanvasElement;
  getPosition(): Point2D;
  getSize(): Size2D;
}

/**
 * Base class for mouse interaction functionality
 */
export default class AbstractMouse {
  constructor() {}

  /**
   * Checks if the mouse cursor is within the bounds of a sprite
   * @param sprite - The sprite to check mouse position against
   * @param event - The mouse event containing cursor coordinates
   * @returns True if the mouse is within the sprite's bounds, false otherwise
   */
  mouseIsOnSprite(sprite: ISpriteWithMouse, event: MouseEvent): boolean {
    if (!sprite.canvas) {
      return false;
    }

    const position: Point2D = sprite.getPosition();
    const rect = sprite.canvas.getBoundingClientRect();
    const size: Size2D = sprite.getSize();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return (
      x >= position.x &&
      x < position.x + size.x &&
      y >= position.y &&
      y < position.y + size.y
    );
  }

  /**
   * Cleanup method for subclasses to override
   */
  destroy(): void {}
}

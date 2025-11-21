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

  /**
   * Cleanup method for subclasses to override
   */
  destroy(): void {}
}


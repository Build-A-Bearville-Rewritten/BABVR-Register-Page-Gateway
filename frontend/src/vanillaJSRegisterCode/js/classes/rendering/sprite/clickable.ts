import AbstractMouse from './abstract-mouse.js';
import type { Point2D, Size2D } from '../../../../types/common.js';

/**
 * Interface for sprites that can be clicked
 */
interface IClickableSprite {
  canvas?: HTMLCanvasElement;
  getPosition(): Point2D;
  getSize(): Size2D;
}

/**
 * Callback function type for click events
 */
type ClickCallback = (event: MouseEvent) => void;

/**
 * Click handler function type
 */
type ClickHandler = (event: MouseEvent) => void;

/**
 * Class for handling clickable sprite interactions
 */
export default class Clickable extends AbstractMouse {
  private callbacks: ClickHandler[];
  private boundClickHandler: ClickHandler;

  constructor() {
    super();
    this.callbacks = [];
    this.boundClickHandler = this.onDocumentClicked.bind(this);
    document.addEventListener('click', this.boundClickHandler);
  }

  /**
   * Registers a callback to be called when a sprite is clicked
   * @param sprite - The sprite to check for clicks
   * @param callback - The callback function to call when the sprite is clicked
   */
  onClick(sprite: IClickableSprite, callback: ClickCallback): void {
    const clickHandler: ClickHandler = (event: MouseEvent) => {
      if (this.mouseIsOnSprite(sprite, event) && callback) {
        callback(event);
      }
    };

    this.callbacks.push(clickHandler);
  }

  /**
   * Handles document click events and calls registered callbacks
   * @param event - The mouse event
   */
  private onDocumentClicked(event: MouseEvent): void {
    for (const callback of this.callbacks) {
      callback(event);
    }
  }

  /**
   * Cleanup method - removes event listeners and clears callbacks
   */
  destroy(): void {
    this.callbacks = [];
    document.removeEventListener('click', this.boundClickHandler);
  }
}


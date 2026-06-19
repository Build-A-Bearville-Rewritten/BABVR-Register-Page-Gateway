import AbstractMouse from './abstract-mouse.js';
import type { Point2D, Size2D } from '../../../types/common.js';

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
// eslint-disable-next-line no-unused-vars
export type MouseCallback = (event: MouseEvent) => void;

interface HoverRegistration {
  sprite: IClickableSprite;
  callback: MouseCallback;
}

/**
 * Class for handling clickable sprite interactions
 */
export default class Clickable extends AbstractMouse {
  private callbacks: MouseCallback[];
  private boundClickHandler: MouseCallback;
  private hoverStartRegistrations: HoverRegistration[];
  private hoverEndRegistrations: HoverRegistration[];
  private hoveredSprites: Set<IClickableSprite>;
  private boundMouseMoveHandler: (event: MouseEvent) => void;

  constructor() {
    super();
    this.callbacks = [];
    this.boundClickHandler = this.onDocumentClicked.bind(this);
    this.hoverStartRegistrations = [];
    this.hoverEndRegistrations = [];
    this.hoveredSprites = new Set();
    this.boundMouseMoveHandler = this.onDocumentMouseMoved.bind(this);
    document.addEventListener('click', this.boundClickHandler);
    document.addEventListener('mousemove', this.boundMouseMoveHandler);
  }

  /**
   * Registers a callback to be called when a sprite is clicked
   * @param sprite - The sprite to check for clicks
   * @param callback - The callback function to call when the sprite is clicked
   */
  onClick(sprite: IClickableSprite, callback: MouseCallback): void {
    const clickHandler: MouseCallback = (event: MouseEvent) => {
      if (this.mouseIsOnSprite(sprite, event) && callback) {
        callback(event);
      }
    };

    this.callbacks.push(clickHandler);
  }

  /**
   * Registers a callback to be called when the pointer enters a sprite
   * @param sprite - The sprite to check for hover
   * @param callback - The callback function to call when hover starts
   */
  onHoverStart(sprite: IClickableSprite, callback: MouseCallback): void {
    this.hoverStartRegistrations.push({ sprite, callback });
  }

  /**
   * Registers a callback to be called when the pointer leaves a sprite
   * @param sprite - The sprite to check for hover
   * @param callback - The callback function to call when hover ends
   */
  onHoverEnd(sprite: IClickableSprite, callback: MouseCallback): void {
    this.hoverEndRegistrations.push({ sprite, callback });
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
   * Handles document mouse move events and calls hover start/end callbacks
   * @param event - The mouse event
   */
  private onDocumentMouseMoved(event: MouseEvent): void {
    for (const sprite of this.getTrackedSprites()) {
      const isOnSprite = this.mouseIsOnSprite(sprite, event);
      const wasHovered = this.hoveredSprites.has(sprite);

      if (isOnSprite && !wasHovered) {
        this.hoveredSprites.add(sprite);
        for (const { sprite: regSprite, callback } of this
          .hoverStartRegistrations) {
          if (regSprite === sprite && callback) {
            callback(event);
          }
        }
      } else if (!isOnSprite && wasHovered) {
        this.hoveredSprites.delete(sprite);
        for (const { sprite: regSprite, callback } of this.hoverEndRegistrations) {
          if (regSprite === sprite && callback) {
            callback(event);
          }
        }
      }
    }
  }

  private getTrackedSprites(): Set<IClickableSprite> {
    const sprites = new Set<IClickableSprite>();

    for (const { sprite } of this.hoverStartRegistrations) {
      sprites.add(sprite);
    }
    for (const { sprite } of this.hoverEndRegistrations) {
      sprites.add(sprite);
    }
    for (const sprite of this.hoveredSprites) {
      sprites.add(sprite);
    }

    return sprites;
  }

  /**
   * Cleanup method - removes event listeners and clears callbacks
   */
  destroy(): void {
    this.callbacks = [];
    this.hoverStartRegistrations = [];
    this.hoverEndRegistrations = [];
    this.hoveredSprites.clear();
    document.removeEventListener('click', this.boundClickHandler);
    document.removeEventListener('mousemove', this.boundMouseMoveHandler);
  }
}

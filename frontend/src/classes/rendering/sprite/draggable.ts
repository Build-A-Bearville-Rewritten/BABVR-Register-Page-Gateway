import type { Point2D, Size2D } from '../../../types/common.js';

import AbstractMouse from './abstract-mouse.js';

/**
 * Interface for sprites that can be dragged
 */
interface IDraggableSprite {
  canvas: HTMLCanvasElement;
  getPosition(): Point2D;
  getSize(): Size2D;
  _isDragging?: boolean;
}

/**
 * Callback function type for drag events (while dragging)
 */
type DragCallback = (
  // eslint-disable-next-line no-unused-vars
  event: MouseEvent,
  // eslint-disable-next-line no-unused-vars
  velocityX: number,
  // eslint-disable-next-line no-unused-vars
  velocityY: number
) => void;

/**
 * Callback function type for drag start/end events
 */
type DragStartEndCallback = (
  // eslint-disable-next-line no-unused-vars
  event: MouseEvent,
  // eslint-disable-next-line no-unused-vars
  sprite: IDraggableSprite
) => void;

/**
 * Event handler type for mouse move events
 */
// eslint-disable-next-line no-unused-vars
type MouseMoveHandler = (event: MouseEvent) => void;

/**
 * Event handler type for mouse up/down events
 */
// eslint-disable-next-line no-unused-vars
type MouseUpDownHandler = (event: MouseEvent) => void;

/**
 * Class for handling draggable sprite interactions
 */
export default class Draggable extends AbstractMouse {
  private _dragEndedHandler: MouseUpDownHandler | null;
  private _draggingHandler: MouseMoveHandler | null;
  private _dragStartedHandler: MouseUpDownHandler | null;
  private _isUsingMouseMoveEvent: boolean;

  private readonly _dragCallbacks: Map<IDraggableSprite, DragCallback>;
  private readonly _dragEndCallbacks: Map<
    IDraggableSprite,
    DragStartEndCallback
  >;
  private readonly _dragStartCallbacks: Map<
    IDraggableSprite,
    DragStartEndCallback
  >;

  constructor() {
    super();
    this._dragStartCallbacks = new Map();
    this._dragEndCallbacks = new Map();
    this._dragCallbacks = new Map();

    this._draggingHandler = null;
    this._dragEndedHandler = null;
    this._dragStartedHandler = null;
    this._isUsingMouseMoveEvent = false;

    this.initEvents();
  }

  /**
   * Initializes event handlers for drag, drag ended, and drag started callbacks
   */
  private initEvents(): void {
    let previousX = 0;
    let previousY = 0;
    let previousTime = 0;
    let velocityX = 0;
    let velocityY = 0;

    this._draggingHandler = (event: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - previousTime || 1; // Avoid division by zero
      const currentX = event.clientX;
      const currentY = event.clientY;

      velocityX = (currentX - previousX) / deltaTime;
      velocityY = (currentY - previousY) / deltaTime;

      previousX = currentX;
      previousY = currentY;
      previousTime = currentTime;

      for (const [sprite, callback] of this._dragCallbacks) {
        if (!sprite._isDragging) continue;
        callback(event, velocityX, velocityY);
      }
    };

    this._dragEndedHandler = (event: MouseEvent) => {
      if (this._draggingHandler) {
        document.removeEventListener('mousemove', this._draggingHandler);
      }
      this._isUsingMouseMoveEvent = false;

      for (const [sprite, callback] of this._dragEndCallbacks) {
        callback(event, sprite);
      }
    };

    this._dragStartedHandler = (event: MouseEvent) => {
      if (this._draggingHandler) {
        document.addEventListener('mousemove', this._draggingHandler);
      }
      this._isUsingMouseMoveEvent = true;

      for (const [sprite, callback] of this._dragStartCallbacks) {
        if (this.mouseIsOnSprite(sprite, event)) {
          sprite._isDragging = true;
          callback(event, sprite);
        }
      }
    };

    document.addEventListener('mouseup', this._dragEndedHandler);
    document.addEventListener('mousedown', this._dragStartedHandler);
  }

  /**
   * Add a callback to be called while the sprite is being dragged
   * @param whichSprite - The sprite to track dragging for
   * @param callback - The callback function to call during drag
   */
  onDrag(whichSprite: IDraggableSprite, callback: DragCallback): void {
    this._dragCallbacks.set(whichSprite, callback);
  }

  /**
   * Add a callback to be called when the drag starts
   * @param whichSprite - The sprite to track drag start for
   * @param callback - The callback function to call when drag starts
   */
  onDragStarted(
    whichSprite: IDraggableSprite,
    callback: DragStartEndCallback
  ): void {
    this._dragStartCallbacks.set(whichSprite, callback);
  }

  /**
   * Add a callback to be called when the drag ends
   * @param whichSprite - The sprite to track drag end for
   * @param callback - The callback function to call when drag ends
   */
  onDragEnded(
    whichSprite: IDraggableSprite,
    callback: DragStartEndCallback
  ): void {
    this._dragEndCallbacks.set(whichSprite, callback);
  }

  /**
   * Cleanup method - removes event listeners and clears callbacks
   */
  destroy(): void {
    if (this._draggingHandler) {
      document.removeEventListener('mousemove', this._draggingHandler);
    }
    if (this._dragEndedHandler) {
      document.removeEventListener('mouseup', this._dragEndedHandler);
    }
    if (this._dragStartedHandler) {
      document.removeEventListener('mousedown', this._dragStartedHandler);
    }

    this._dragStartCallbacks.clear();
    this._dragEndCallbacks.clear();
    this._dragCallbacks.clear();
  }
}

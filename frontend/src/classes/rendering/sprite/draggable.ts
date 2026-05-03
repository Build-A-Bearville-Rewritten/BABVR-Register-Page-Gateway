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
  private dragStartCallbacks: Map<IDraggableSprite, DragStartEndCallback>;
  private dragEndCallbacks: Map<IDraggableSprite, DragStartEndCallback>;
  private dragCallbacks: Map<IDraggableSprite, DragCallback>;

  private draggingHandler: MouseMoveHandler | null;
  private dragEndedHandler: MouseUpDownHandler | null;
  private dragStartedHandler: MouseUpDownHandler | null;
  private isUsingMouseMoveEvent: boolean;

  constructor() {
    super();
    this.dragStartCallbacks = new Map();
    this.dragEndCallbacks = new Map();
    this.dragCallbacks = new Map();

    this.draggingHandler = null;
    this.dragEndedHandler = null;
    this.dragStartedHandler = null;
    this.isUsingMouseMoveEvent = false;

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

    this.draggingHandler = (event: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - previousTime || 1; // Avoid division by zero
      const currentX = event.clientX;
      const currentY = event.clientY;

      velocityX = (currentX - previousX) / deltaTime;
      velocityY = (currentY - previousY) / deltaTime;

      previousX = currentX;
      previousY = currentY;
      previousTime = currentTime;

      for (const [sprite, callback] of this.dragCallbacks) {
        if (!sprite._isDragging) continue;
        callback(event, velocityX, velocityY);
      }
    };

    this.dragEndedHandler = (event: MouseEvent) => {
      if (this.draggingHandler) {
        document.removeEventListener('mousemove', this.draggingHandler);
      }
      this.isUsingMouseMoveEvent = false;

      for (const [sprite, callback] of this.dragEndCallbacks) {
        callback(event, sprite);
      }
    };

    this.dragStartedHandler = (event: MouseEvent) => {
      if (this.draggingHandler) {
        document.addEventListener('mousemove', this.draggingHandler);
      }
      this.isUsingMouseMoveEvent = true;

      for (const [sprite, callback] of this.dragStartCallbacks) {
        if (this.mouseIsOnSprite(sprite, event)) {
          sprite._isDragging = true;
          callback(event, sprite);
        }
      }
    };

    document.addEventListener('mouseup', this.dragEndedHandler);
    document.addEventListener('mousedown', this.dragStartedHandler);
  }

  /**
   * Add a callback to be called while the sprite is being dragged
   * @param whichSprite - The sprite to track dragging for
   * @param callback - The callback function to call during drag
   */
  onDrag(whichSprite: IDraggableSprite, callback: DragCallback): void {
    this.dragCallbacks.set(whichSprite, callback);
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
    this.dragStartCallbacks.set(whichSprite, callback);
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
    this.dragEndCallbacks.set(whichSprite, callback);
  }

  /**
   * Cleanup method - removes event listeners and clears callbacks
   */
  destroy(): void {
    if (this.draggingHandler) {
      document.removeEventListener('mousemove', this.draggingHandler);
    }
    if (this.dragEndedHandler) {
      document.removeEventListener('mouseup', this.dragEndedHandler);
    }
    if (this.dragStartedHandler) {
      document.removeEventListener('mousedown', this.dragStartedHandler);
    }

    this.dragStartCallbacks.clear();
    this.dragEndCallbacks.clear();
    this.dragCallbacks.clear();
  }
}

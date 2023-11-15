import AbstractMouse from './abstract-mouse.js';

export default class Draggable extends AbstractMouse {
  constructor() {
    super();
    this.dragStartCallbacks = new Map();
    this.dragEndCallbacks = new Map();
    this.dragCallbacks = new Map();

    this.draggingHandler = null
    this.dragEndedHandler = null
    this.dragStartedHandler = null

    this.initEvents();
  }

  // events which handle when to call the drag, drag ended, and drag started callbacks
  initEvents() {
    let previousX = 0;
    let previousY = 0;
    let previousTime = 0;
    let velocityX = 0;
    let velocityY = 0;

    this.draggingHandler = event => {
      const currentTime = Date.now();
      const deltaTime = currentTime - previousTime;
      const currentX = event.clientX;
      const currentY = event.clientY;

      velocityX = (currentX - previousX) / deltaTime;
      velocityY = (currentY - previousY) / deltaTime;

      previousX = currentX;
      previousY = currentY;
      previousTime = currentTime;

      for (let [sprite, callback] of this.dragCallbacks) {
        if (!sprite._isDragging) continue;
        callback(event, velocityX, velocityY);
      }
    };

    this.dragEndedHandler = event => {
      document.removeEventListener('mousemove', this.draggingHandler);
      this.usingMouseMoveEvent = false;

      for (let [sprite, callback] of this.dragEndCallbacks)
        callback(event, sprite);
    };

    this.dragStartedHandler = event => {
      document.addEventListener('mousemove', this.draggingHandler);
      this.usingMouseMoveEvent = true;

      for (let [sprite, callback] of this.dragStartCallbacks) {
        if (this.mouseIsOnSprite(sprite, event)) {
          sprite._isDragging = true;
          callback(event, sprite);
        }
      }
    };

    document.addEventListener('mouseup', this.dragEndedHandler);
    document.addEventListener('mousedown', this.dragStartedHandler);
  }

  // Add a callback to be called while the sprite is being dragged
  onDrag(whichSprite, callback) {
    this.dragCallbacks.set(whichSprite, callback);
  }

  // Add a callback to be called when the drag starts
  onDragStarted(whichSprite, callback) {
    this.dragStartCallbacks.set(whichSprite, callback);
  }

  // Add a callback to be called when the drag ends
  onDragEnded(whichSprite, callback) {
    this.dragEndCallbacks.set(whichSprite, callback);
  }

  destroy() {
    document.removeEventListener('mousemove', this.mouseDragHandler);
    document.removeEventListener('mouseup', this.dragEndedHandler);
    document.removeEventListener('mousedown', this.dragStartedHandler);

    this.dragStartCallbacks.clear();
    this.dragEndCallbacks.clear();
    this.dragCallbacks.clear();
  }
}

// Handles redrawing the canvas whenever the screen is resized, or loaded for the first time.

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import type { ICanvasRenderer } from '../../types/rendering.ts';

/**
 * Type for requestAnimationFrame callback
 */
type AnimationFrameCallback = (timestamp: DOMHighResTimeStamp) => void;

/**
 * Type for requestAnimationFrame return value (animation frame ID)
 */
type AnimationFrameId = number;

export default class CanvasRenderer implements ICanvasRenderer {
  public canvas: HTMLCanvasElement;

  private _animationFrameId: AnimationFrameId | null = null;
  private _screenHandler: ReturnType<
    typeof screenHandlerModule.getInstance
  > | null = null;

  static get CANVAS_PERCENT_OF_SCREEN(): number {
    return 0.8;
  }

  // the ratio of the buildabear registration screen
  static get TARGET_RATIO(): number {
    return 1.46531764706;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  // Init canvas rendering and create resize event for resizing the canvas
  // when the screen size changes
  startRender(): void {
    this._screenHandler = screenHandlerModule.getInstance(this.canvas);
    this.resizeCanvas4by3();

    // Start the rendering loop
    this.startRenderingLoop();

    // binds the resizeCanvas4by3 method to the page's resize event.
    window.addEventListener('resize', () => {
      this.resizeCanvas4by3();
      // Trigger a redraw on resize
      if (this._screenHandler) {
        const drawCallback: AnimationFrameCallback = () => {
          this._screenHandler?.drawScreen();
        };

        globalThis.requestAnimationFrame(drawCallback);
      }
    });
  }

  /**
   * Starts the canvas rendering loop using requestAnimationFrame
   */
  private startRenderingLoop(): void {
    const renderLoop: AnimationFrameCallback = (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _timestamp: DOMHighResTimeStamp
    ) => {
      if (this._screenHandler) {
        this._screenHandler.drawScreen();
      }

      // Continue the loop
      this._animationFrameId = globalThis.requestAnimationFrame(renderLoop);
    };

    // Start the loop
    this._animationFrameId = globalThis.requestAnimationFrame(renderLoop);
  }

  /**
   * Stops the rendering loop
   */
  stopRenderingLoop(): void {
    if (this._animationFrameId !== null) {
      globalThis.cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  // Make canvas have original 4:3 screen ratio
  resizeCanvas4by3(): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    let newHeight = currentHeight;
    let newWidth = currentWidth;

    const currentRatio = currentWidth / currentHeight;

    if (currentRatio > CanvasRenderer.TARGET_RATIO)
      newWidth = currentHeight * CanvasRenderer.TARGET_RATIO;
    else newHeight = currentWidth / CanvasRenderer.TARGET_RATIO;

    this.canvas.height = newHeight * CanvasRenderer.CANVAS_PERCENT_OF_SCREEN;
    this.canvas.width = newWidth * CanvasRenderer.CANVAS_PERCENT_OF_SCREEN;
  }
}

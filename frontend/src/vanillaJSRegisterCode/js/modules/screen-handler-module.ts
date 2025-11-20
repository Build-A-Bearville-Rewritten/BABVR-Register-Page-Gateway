// Keeps track of all screen handler instances,
// and allows for getting and setting screen handlers for each canvas

import ScreenHandler from '../classes/rendering/screen-handler.ts';
import type { IScreenHandlerModule, GetScreenHandlerInstance } from '../../types/modules.ts';
import type { IScreenHandler } from '../../types/rendering.ts';

/**
 * Singleton class for managing screen handler instances per canvas
 */
class ScreenHandlerModuleClass implements IScreenHandlerModule {
  private _screenHandlers: Map<HTMLCanvasElement, ScreenHandler>;

  constructor() {
    this._screenHandlers = new Map();
  }

  /**
   * Gets the screen handler for a given canvas, returning a new one if it doesn't already exist.
   * @param canvas - Canvas element to get the handler for
   * @returns The screen handler instance
   */
  getInstance: GetScreenHandlerInstance = (canvas: HTMLCanvasElement): IScreenHandler => {
    // Get or create handler for specific canvas
    if (!this._screenHandlers.has(canvas)) {
      const newInstance = new ScreenHandler(canvas);
      this._screenHandlers.set(canvas, newInstance);
    }

    return this._screenHandlers.get(canvas)!;
  };
}

// Export singleton instance
const ScreenHandlerModule = new ScreenHandlerModuleClass();
export default ScreenHandlerModule;


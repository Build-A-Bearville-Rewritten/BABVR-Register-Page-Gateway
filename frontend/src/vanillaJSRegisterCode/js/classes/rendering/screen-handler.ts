// Renders all objects on the current screen with help from the sprite-renderer class.

import spriteRendererModule from '../../modules/sprite-renderer-module.ts';
import type { IScreenHandler, AbstractScreen, ScreenClass } from '../../../types/rendering.ts';

export default class ScreenHandler implements IScreenHandler {
  public canvas: HTMLCanvasElement;
  private _currentScreens: Map<HTMLCanvasElement, AbstractScreen>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._currentScreens = new Map();
  }

  /**
   * Sets canvas's screen to be newScreen, clearing out the old screen
   * @param screenToDraw - The class for the screen to draw
   * @param screenArgs - Any args the screen constructor should have (except canvas)
   */
  async setScreen<T extends AbstractScreen>(
    screenToDraw: ScreenClass<T>,
    screenArgs?: any[]
  ): Promise<void> {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();
    const previousScreen = this._currentScreens.get(this.canvas);

    const args = screenArgs || [];

    if (previousScreen) {
      spriteRenderer.removeAllSprites();
      previousScreen.destroy();
    }

    const newScreen = new screenToDraw(this.canvas, ...args);
    this._currentScreens.set(this.canvas, newScreen);

    spriteRenderer.updateAnimations();
  }

  /**
   * Draws all sprites on the screen
   */
  async drawScreen(): Promise<void> {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();

    if (spriteRenderer.numSprites > 0) {
      spriteRenderer.drawSprites();
    }
  }
}


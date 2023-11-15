// Renders all objects on the current screen with help from theh sprite-renderer class.

import spriteRendererModule from '../../modules/sprite-renderer-module.js';

export default class ScreenHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this._currentScreens = [];
  }

  // Sets canvas's screen to be newScreen, clearing out the old screen
  //  screenToDraw: the class for the screen to draw
  //  screenArgs: any args the screen constructor should have (except canvas)
  async setScreen(screenToDraw, screenArgs) {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();
    const previousScreen = this._currentScreens[this.canvas];

    screenArgs = screenArgs || [];

    if (previousScreen) {
      spriteRenderer.removeAllSprites();
      previousScreen.destroy();
    }

    const newScreen = new screenToDraw(this.canvas, ...screenArgs);
    this._currentScreens[this.canvas] = newScreen;

    spriteRenderer.updateAnimations();
  }

  // Draws all sprites on the screen
  async drawScreen() {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();

    if (spriteRenderer.numSprites > 0) spriteRenderer.drawSprites();
  }
  // -----------------------------
  // Private functions:
  // -----------------------------
}

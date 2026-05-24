// Renders all objects on the current screen with help from the sprite-renderer class.

import spriteRendererModule from '../../modules/sprite-renderer-module.ts';
import type {
  IScreenHandler,
  AbstractScreen,
  ScreenClass,
  ISpriteRenderer
} from '../../types/rendering.ts';
import StaticSprite from './sprite/static-sprite.ts';
import LoginHUD from './sprite/widgets/loginHud.ts';

export default class ScreenHandler implements IScreenHandler {
  public canvas: HTMLCanvasElement;

  private readonly _currentScreens: Map<HTMLCanvasElement, AbstractScreen>;
  private _background!: StaticSprite;
  private _overlay!: LoginHUD;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._currentScreens = new Map();
    this.createBackground();
    this.createOverlay();
  }

  private createBackground(){
    this._background = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });
  }

  private createOverlay(){
    this._overlay = new LoginHUD(this.canvas);
  }

  /**
   * Sets canvas's screen to be newScreen, clearing out the old screen
   * @param screenToDraw - The class for the screen to draw
   * @param screenArgs - Any args the screen constructor should have (except canvas)
   */
  async setScreen<T extends AbstractScreen>(
    screenToDraw: ScreenClass<T>,
    screenArgs?: unknown[]
  ): Promise<void> {
    const spriteRenderer = spriteRendererModule.getSpriteRenderer();
    const previousScreen = this._currentScreens.get(this.canvas);

    const args = screenArgs || [];

    if (previousScreen) {
      spriteRenderer.removeAllSprites();
      previousScreen.destroy();
      this._overlay.destroy();
    }

    this.createBackground();
    this.createOverlay();
    const newScreen = new screenToDraw(this.canvas, ...args);
    this._currentScreens.set(this.canvas, newScreen);

    spriteRenderer.updateAnimations();
  }

  /**
   * Draws all sprites on the screen
   */
  async drawScreen(): Promise<void> {
    const spriteRenderer: ISpriteRenderer =
      spriteRendererModule.getSpriteRenderer();

    if (spriteRenderer.numSprites < 1) return;

    spriteRenderer.drawSprites();
  }
}

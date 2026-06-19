import { HSL, Point2D, Size2D } from './common';
import AbstractSprite from '../classes/rendering/sprite/abstract-sprite.ts';
import StaticSprite from '../classes/rendering/sprite/static-sprite.ts';
import LoginHUD from '../classes/rendering/sprite/widgets/login-hud.ts';

/**
 * Canvas element type
 */
export type Canvas = HTMLCanvasElement;

/**
 * Image element type
 */
export type Image = HTMLImageElement;

/**
 * A sprite's parent can be either a canvas or another sprite
 */
export type SpriteParent = HTMLCanvasElement | AbstractSprite;

/**
 * Interface for canvas renderer
 */
export interface ICanvasRenderer {
  canvas: HTMLCanvasElement;
  startRender(): void;
  resizeCanvas4by3(): void;
}

/**
 * Interface for sprites that can be rendered
 */
export interface IRenderableSprite extends IDrawableSprite {
  id: number | null;
  getZIndex(): number;
  update(): void;
  isAnimation?: boolean;
}

/**
 * Interface for sprite renderer
 */
export interface ISpriteRenderer {
  numSprites: number;
  preloadCB: (() => void) | null;

  // eslint-disable-next-line no-unused-vars
  addSpriteToScreen(sprite: IRenderableSprite): Promise<void>;
  removeAllSprites(): void;
  drawSprites(): void;
  updateAnimations(): void;
  // eslint-disable-next-line no-unused-vars
  addRedrawCB(cb: () => void): void;
  // eslint-disable-next-line no-unused-vars
  addPostRedrawCB(cb: () => void): void;
  // eslint-disable-next-line no-unused-vars
  removePostRedrawCB(cb: () => void): void;
}

/**
 * Abstract base class for all screen classes
 * All screens must extend this class and implement the destroy method
 */
export abstract class AbstractScreen {
  public canvas: HTMLCanvasElement;
  private _background!: StaticSprite;
  private _overlay!: LoginHUD;

  protected constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.createBackgroundAndOverlay();
  }

  private createBackgroundAndOverlay(){
    this._background = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });
    this._overlay = new LoginHUD(this.canvas);
  }

  /**
   * Cleanup method called when the screen is being replaced
   * Must be implemented by all screen classes
   */
  public destroy(): void {
    this._background.destroy();
    this._overlay.destroy();
  }
}

/**
 * Type for screen class constructors
 * Screens must extend AbstractScreen and take canvas as first parameter
 */
export type ScreenClass<T extends AbstractScreen = AbstractScreen> = new (
  // eslint-disable-next-line no-unused-vars
  canvas: HTMLCanvasElement,
  // eslint-disable-next-line no-unused-vars
  ...args: unknown[]
) => T;

/**
 * Interface for screen handler
 */
export interface IScreenHandler {
  canvas: HTMLCanvasElement;
  setScreen<T extends AbstractScreen>(
    // eslint-disable-next-line no-unused-vars
    screenToDraw: ScreenClass<T>,
    // eslint-disable-next-line no-unused-vars
    screenArgs?: unknown[]
  ): Promise<void>;
  drawScreen(): Promise<void>;
}

/**
 * Interface for sprite drawer
 */
export interface ISpriteDrawer {
  // eslint-disable-next-line no-unused-vars
  drawSprite(sprite: AbstractSprite, ctx: CanvasRenderingContext2D): void;
}

export interface IDrawableSprite {
  canvas: HTMLCanvasElement | undefined;
  getImage(): HTMLImageElement | null;
  getSize(): Size2D;
  getHSL(): HSL | undefined;
  getPosition(): Point2D;
  getRotation(): number | undefined;
  getFlip(): 'horizontal' | 'vertical' | undefined;
  propertiesChanged: {
    size?: boolean;
    hsl?: boolean;
  };
  getImgCanvas(): HTMLCanvasElement | undefined;
  // eslint-disable-next-line no-unused-vars
  setImgCanvas(imgCanvas: HTMLCanvasElement): void;
}

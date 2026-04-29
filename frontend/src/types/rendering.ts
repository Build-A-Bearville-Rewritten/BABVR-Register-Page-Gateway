/**
 * Rendering-related type definitions
 */

import { HSL, Point2D, Size2D } from './common';
import AbstractSprite from '../classes/rendering/sprite/abstract-sprite.ts';

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
 * Interface for sprite renderer
 */
export interface ISpriteRenderer {
  numSprites: number;
  preloadCB: (() => void) | null;

  addSpriteToScreen(sprite: AbstractSprite): Promise<void>;
  removeAllSprites(): void;
  drawSprites(): void;
  updateAnimations(): void;
  addRedrawCB(cb: () => void): void;
}

/**
 * Abstract base class for all screen classes
 * All screens must extend this class and implement the destroy method
 */
export abstract class AbstractScreen {
  public canvas: HTMLCanvasElement;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(canvas: HTMLCanvasElement, ..._args: unknown[]) {
    this.canvas = canvas;
  }

  /**
   * Cleanup method called when the screen is being replaced
   * Must be implemented by all screen classes
   */
  abstract destroy(): void;
}

/**
 * Type for screen class constructors
 * Screens must extend AbstractScreen and take canvas as first parameter
 */
export type ScreenClass<T extends AbstractScreen = AbstractScreen> = new (
  canvas: HTMLCanvasElement,
  ...args: unknown[]
) => T;

/**
 * Interface for screen handler
 */
export interface IScreenHandler {
  canvas: HTMLCanvasElement;
  setScreen<T extends AbstractScreen>(
    screenToDraw: ScreenClass<T>,
    screenArgs?: unknown[]
  ): Promise<void>;
  drawScreen(): Promise<void>;
}

/**
 * Interface for sprite drawer
 */
export interface ISpriteDrawer {
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
  setImgCanvas(imgCanvas: HTMLCanvasElement): void;
}

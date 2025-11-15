/**
 * Rendering-related type definitions
 */

import { HSL, Point2D, Size2D } from "./common";

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
export type SpriteParent = HTMLCanvasElement | any; // AbstractSprite - using any to avoid circular dependency

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
  addSpriteToScreen(sprite: any): Promise<void>;
  removeAllSprites(): void;
  drawSprites(): void;
  updateAnimations(): void;
}

/**
 * Interface for screen handler
 */
export interface IScreenHandler {
  canvas: HTMLCanvasElement;
  setScreen(screenToDraw: any, screenArgs?: any[]): Promise<void>;
  drawScreen(): Promise<void>;
}

/**
 * Interface for sprite drawer
 */
export interface ISpriteDrawer {
  drawSprite(sprite: any, ctx: CanvasRenderingContext2D): void;
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

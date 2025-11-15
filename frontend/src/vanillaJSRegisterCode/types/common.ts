/**
 * Common type definitions used across the sprite rendering system
 */

/**
 * A 2D point with x and y coordinates
 */
export type Point2D = {
  x: number;
  y: number;
};

/**
 * A 2D size with width (x) and height (y) dimensions
 */
export type Size2D = {
  x: number;
  y: number;
};

/**
 * A 2D scale that can be either a uniform number or separate x and y values
 */
export type Scale2D = { x: number; y: number } | number;

/**
 * HSL color values, all optional
 */
export type HSL = {
  h?: number;
  s?: number;
  l?: number;
};

/**
 * Options for sprite constructors
 */
export interface SpriteConstructorOptions {
  imagePath?: string;
  parent?: HTMLCanvasElement | any; // AbstractSprite - using any to avoid circular dependency
  sizeScale?: Scale2D;
  anchorPoint?: Point2D;
  positionScale?: Point2D;
  zIndex?: number;
  rotation?: number;
  flip?: 'horizontal' | 'vertical';
  hsl?: HSL;
  isFixedSize?: boolean;
  canvas?: HTMLCanvasElement;
}

/**
 * Animation-related configuration options
 */
export interface AnimationConfig {
  animationFolder?: string;
  numFrames?: number;
  frameBuffer?: number;
  isLooped?: boolean;
}


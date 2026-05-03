/**
 * Module interfaces for singleton modules and factory function types
 */

import type {
  ICanvasRenderer,
  ISpriteRenderer,
  IScreenHandler
} from './rendering.js';

/**
 * Factory function type for getting a canvas renderer
 */
// eslint-disable-next-line no-unused-vars
export type GetCanvasRenderer = (canvas: HTMLCanvasElement) => ICanvasRenderer;

/**
 * Factory function type for getting a sprite renderer
 */
// eslint-disable-next-line no-unused-vars
export type GetSpriteRenderer = (canvas?: HTMLCanvasElement) => ISpriteRenderer;

/**
 * Factory function type for getting a screen handler instance
 */
export type GetScreenHandlerInstance = (
  // eslint-disable-next-line no-unused-vars
  canvas: HTMLCanvasElement
) => IScreenHandler;

/**
 * Interface for canvas renderer module
 */
export interface ICanvasRendererModule {
  getCanvasRenderer: GetCanvasRenderer;
}

/**
 * Interface for sprite renderer module
 */
export interface ISpriteRendererModule {
  getSpriteRenderer: GetSpriteRenderer;
}

/**
 * Interface for screen handler module
 */
export interface IScreenHandlerModule {
  getInstance: GetScreenHandlerInstance;
}

/**
 * Interface for SVG handler module
 */
export interface ISVGHandler {
  // eslint-disable-next-line no-unused-vars
  splitLayers(sourceSvg: string): Promise<string[]>;
}

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
export type GetCanvasRenderer = (canvas: HTMLCanvasElement) => ICanvasRenderer;

/**
 * Factory function type for getting a sprite renderer
 */
export type GetSpriteRenderer = (canvas?: HTMLCanvasElement) => ISpriteRenderer;

/**
 * Factory function type for getting a screen handler instance
 */
export type GetScreenHandlerInstance = (
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
  splitLayers(sourceSvg: string): Promise<string[]>;
}

// Loads in sprites onto their in specified loading order.

import type {
  IRenderableSprite,
  ISpriteRenderer
} from '../../types/rendering.ts';

import SpriteDrawer from './sprite/sprite-drawer.ts';

/**
 * Interface for animated sprites
 */
interface IAnimatedSprite extends IRenderableSprite {
  isAnimation: true;
}

/**
 * Callback function type for preload completion
 */
type PreloadCallback = () => void;

/**
 * Callback function type for pre-redraw operations
 */
type PreRedrawCallback = () => void;

/**
 * Dictionary type for sprites organized by z-index
 */
type SpriteDictionary = {
  [zIndex: number]: {
    [spriteKey: string]: IRenderableSprite | null;
  };
};

/**
 * Class for managing and rendering sprites
 */
export default class SpriteRenderer implements ISpriteRenderer {
  public numSprites: number;
  public preloadCB: PreloadCallback | null;
  private _sprites: SpriteDictionary;
  private _animatedSprites: IAnimatedSprite[];
  private _isPreloaded: boolean;
  private _preRedrawCBs: PreRedrawCallback[];
  public readonly SpriteDrawer: SpriteDrawer;

  constructor() {
    this.numSprites = 0;
    this.preloadCB = null;
    this._sprites = {};
    this._animatedSprites = [];
    this._isPreloaded = false;
    this._preRedrawCBs = [];
    this.SpriteDrawer = new SpriteDrawer();
  }

  // -------------------------------------------
  // PUBLIC METHODS
  // -------------------------------------------

  /**
   * Load the sprites images, and then add the sprite to the _sprites array
   * @param sprite - The sprite to add to the screen
   */
  async addSpriteToScreen(sprite: IRenderableSprite): Promise<void> {
    const spriteKey = `sprite${sprite.id}`;
    const zIndex = sprite.getZIndex();

    sprite.id = ++this.numSprites;

    if (!this._sprites[zIndex]) {
      this._sprites[zIndex] = {};
    }

    if (sprite.isAnimation) {
      this._animatedSprites.push(sprite as IAnimatedSprite);
    }

    this._sprites[zIndex][spriteKey] = sprite;
  }

  /**
   * Binds a method `callback` to be called before the sprites are redrawn
   * @param callback - The callback function to call before redraw
   */
  addRedrawCB(callback: PreRedrawCallback): void {
    this._preRedrawCBs.push(callback);
  }

  /**
   * Draws the sprites on the screen based on their z-indices and creation order
   * The sprite will get drawn on its specified zIndex. The higher the zindex, the more to the top of the image screen the image will be
   * On each zindex layer, the sprites created most recently will show on top.
   */
  drawSprites(): void {
    // Call all pre-redraw callbacks
    for (const callback of this._preRedrawCBs) {
      callback();
    }

    // Draw sprites by z-index
    for (const zIndexStr in this._sprites) {
      const zIndex = Number(zIndexStr);
      const spritesAtZIndex = this._sprites[zIndex];

      for (const spriteKey in spritesAtZIndex) {
        const sprite = spritesAtZIndex[spriteKey];
        if (sprite && sprite.getImage()) {
          sprite.update();
          this.SpriteDrawer.drawSprite(sprite);
        }
      }
    }
  }

  /**
   * Updates animations for all animated sprites
   */
  updateAnimations(): void {
    window.requestAnimationFrame(() => this.updateAnimations());

    for (const animatedSprite of this._animatedSprites) {
      // Update animation frames
      animatedSprite.update();
    }
  }

  /**
   * Removes all sprites from the renderer
   */
  removeAllSprites(): void {
    this.numSprites = 0;

    for (const zIndexStr in this._sprites) {
      const zIndex = Number(zIndexStr);
      const spritesAtZIndex = this._sprites[zIndex];

      for (const spriteKey in spritesAtZIndex) {
        spritesAtZIndex[spriteKey] = null;
      }
    }

    this._sprites = {};
    this._animatedSprites = [];
  }

  // -------------------------------------------
  // PRIVATE METHODS
  // -------------------------------------------
}

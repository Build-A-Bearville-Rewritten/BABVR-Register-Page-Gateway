// TODO: REMOVE SPRITE FROM SPRITES TABLE WHEN IT IS DESTROYED
// IF THERE ARE NO SPRITES AT ZINDEX GET RID OF ARRAY AT ZINDEX
// Should have change zindex functions which removes the sprite from this zindex and puts it on another zindex level

// Loads in sprites onto their in specified loading order.
export default class SpriteLoader {
  constructor() {
    this.ids = 0; // total number of unique ids created for sprites
    this.preloadCB = null;

    this._cachedImages = {}; // images cached to avoid creating multiples of the same image
    this._sprites = {}; // list of sprites to be drawn
    this._numSprites = 0;
    this._numLoaded = 0;
    this._isPreloaded = false;
    this._preRedrawCBs = []; // functions to be called before a redraw
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // Adds a sprite to the queue of images to draw on screen
  addSpriteToQueue(sprite) {
    // const zIndexKey = sprite.zIndex;
    const spriteKey = "sprite" + sprite.id;

    if (!this._sprites[sprite.zIndex]) this._sprites[sprite.zIndex] = {};

    this._sprites[sprite.zIndex][spriteKey] = sprite;
    this._numSprites++;
    this.ids++;
  }

  isSpriteInQueue(sprite) {
    return this._sprites[sprite.zIndex][sprite.id] == null;
  }

  // returnes the cached img with imgSrc as it's source, if it is already cached
  getCachedImage(imageSrc) {
    return this._cachedImages[imageSrc];
  }

  // caches imgSrc as a new image
  cacheImage(imageSrc) {
    if (this._cachedImages[imageSrc])
      throw new Error("Trying to cache an image that is already cached");

    const image = new Image();
    image.src = imageSrc;
    this._cachedImages[imageSrc] = image;

    return image;
  }

  // Binds a method `callback` to be called before the sprites are redrawn
  //  Usage: spriteLoader.addRedrawCB(myMethod.bind(this));
  addRedrawCB(callback) {
    this._preRedrawCBs.push(callback);
  }

  // Draws the sprites on the screen based on their zindecies and creation order
  // The sprite will get drawn on it's specified zIndex. The higher the zindex, the more to the top of the image screen the image will be
  // On each zindex layer, the sprites created most recently will show on top.
  redrawSprites() {
    for (const callback of this._preRedrawCBs) callback();

    for (const spritesAtZIndex in this._sprites)
      for (const spriteKey in this._sprites[spritesAtZIndex])
        this._sprites[spritesAtZIndex][spriteKey].update();
  }

  // Method that gets called when a sprite finishes loading
  // If all the sprites are loaded, calls specified `preloadCB` method, if it exists
  onSpriteLoaded() {
    this._numLoaded++;

    if (!this._isPreloaded && this._numLoaded >= this._numSprites) {
      // this._isPreloaded = true;
      if (this.preloadCB) this.preloadCB();
    }
  }

  // -------------------------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------
}

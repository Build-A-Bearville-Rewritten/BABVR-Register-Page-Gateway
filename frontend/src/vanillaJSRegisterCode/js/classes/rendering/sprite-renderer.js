// Loads in sprites onto their in specified loading order.
export default class SpriteRenderer {
  constructor() {
    this.numSprites = 0;
    this.preloadCB = null;
    this._sprites = [];
    this._animatedSprites = [];
    this._isPreloaded = false;
    this._preRedrawCBs = []; // functions to be called before a redraw
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // Load the sprites images, and then add the sprite to the _sprites array
  async addSpriteToScreen(sprite) {
    let spriteKey = null;
    const zIndex = sprite.getZIndex();

    sprite.id = ++this.numSprites;
    spriteKey = 'sprite' + sprite.id;

    if (!this._sprites[zIndex]) this._sprites[zIndex] = {};
    if (sprite.isAnimation) this._animatedSprites.push(sprite);
    this._sprites[zIndex][spriteKey] = sprite;
  }
  // Binds a method `callback` to be called before the sprites are redrawn
  //  Usage: .addRedrawCB(myMethod.bind(this));
  addRedrawCB(callback) {
    this._preRedrawCBs.push(callback);
  }

  // Draws the sprites on the screen based on their zindecies and creation order
  // The sprite will get drawn on it's specified zIndex. The higher the zindex, the more to the top of the image screen the image will be
  // On each zindex layer, the sprites created most recently will show on top.
  drawSprites() {
    for (const callback of this._preRedrawCBs) callback();

    for (const spritesAtZIndex in this._sprites)
      for (const spriteKey in this._sprites[spritesAtZIndex]) {
        let sprite = this._sprites[spritesAtZIndex][spriteKey];
        if (sprite.getImage()) sprite.update();
      }
  }

  updateAnimations() {
    window.requestAnimationFrame(this.updateAnimations.bind(this));

    for (const index in this._animatedSprites) {
      const animatedSprite = this._animatedSprites[index];
      // animatedSprite.update();
    }
  }

  removeAllSprites() {
    for (const zIndex in this._sprites) {
      for (const spriteKey in this._sprites[zIndex]) {
        let sprite = this._sprites[zIndex][spriteKey];
        sprite.destroy();
        this._sprites[zIndex][spriteKey] = null;
      }
    }

    this._sprites.length = 0;
  }

  // -------------------------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------
}

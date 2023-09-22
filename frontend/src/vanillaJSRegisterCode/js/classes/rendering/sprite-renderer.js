// TODO: REMOVE SPRITE FROM SPRITES TABLE WHEN IT IS DESTROYED
// IF THERE ARE NO SPRITES AT ZINDEX GET RID OF ARRAY AT ZINDEX
// Should have a check to move the sprite to a new zindex if their zindex doesn't match it's current zindex in the table (akak it changed zindex)

// Loads in sprites onto their in specified loading order.
export default class SpriteRenderer {
  constructor() {
    this.numSprites = 0;
    this.preloadCB = null;
    this._sprites = {};
    this._isPreloaded = false;
    this._preRedrawCBs = []; // functions to be called before a redraw
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // Load the sprites images, and then add the sprite to the _sprites array
  async addSpriteToScreen(sprite) {
    await sprite.loadImages();

    sprite.id = ++this.numSprites;
    const spriteKey = 'sprite' + sprite.id;
    if (!this._sprites[sprite.zIndex]) this._sprites[sprite.zIndex] = {};

    this._sprites[sprite.zIndex][spriteKey] = sprite;
    // console.log(this._sprites[sprite.zIndex]);
  }

  // Calls addSpriteToScreen for each sprite in sprites
  async addSpritesToScreen(sprites) {
    for (const sprite of sprites) await this.addSpriteToScreen(sprite);
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
        sprite.update();
      }
  }

  removeAllSprites() {
    for (const spritesAtZIndex in this._sprites)
      for (const spriteKey in this._sprites[spritesAtZIndex]) {
        let sprite = this._sprites[spritesAtZIndex][spriteKey];
        sprite.destroy();
      }

    this.numSprites = 0;
    this._sprites = [];
  }

  // TODO: Needs to be tested
  // removes a sprite from the sprites table
  removeSprite(sprite) {
    this.sprites[sprite.zIndex][spriteKey] = null;

    if (this.sprites[sprite.zIndex].length <= 0) {
      this.sprites[sprite.zIndex] = null;
    }

    sprite.destroy();
  }

  // -------------------------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------
}

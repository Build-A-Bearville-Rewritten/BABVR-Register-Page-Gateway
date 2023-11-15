export default class SpriteDrawer {
  constructor() {}

  // changes the image's color
  reColorHSL(sprite, innerCtx) {
    const image = sprite.getImage();
    const spriteSize = sprite.getSize();
    const hsl = sprite.getHSL() 

    innerCtx.globalCompositeOperation = 'source-over';
    innerCtx.drawImage(image, 0, 0, spriteSize.x, spriteSize.y);

    // add in hue, sat, and lightness
    innerCtx.globalCompositeOperation = 'multiply';
    innerCtx.fillStyle =
      'hsl(' +
      hsl.h +
      ',' +
      (hsl.s || 100) +
      '%, ' +
      (hsl.l || 50) +
      '%,' +
      (hsl.a || 1) +
      ')';

    innerCtx.fillRect(0, 0, spriteSize.x, spriteSize.y);

    // mask image onto canvas
    innerCtx.globalCompositeOperation = 'destination-in';
    innerCtx.drawImage(image, 0, 0, spriteSize.x, spriteSize.y);
  }

  // rotates the image based on it's rotation property
  rotateSprite(sprite) {
    const spritePosition = sprite.getPosition();
    const spriteSize = sprite.getSize();

    const ctx = sprite.canvas.getContext('2d');
    const centerx = spritePosition.x + spriteSize.x / 2;
    const centery = spritePosition.y + spriteSize.y / 2;

    ctx.translate(centerx, centery);
    ctx.rotate((sprite.getRotation() * Math.PI) / 180);

    return { x: -spriteSize.x / 2, y: -spriteSize.y / 2 };
  }

  // flips the image horizontally if the flip: "horizontal" property is set
  flipHorizontally(sprite) {
    const spriteSize = sprite.getSize();
    const spritePosition = sprite.getPosition();

    const ctx = sprite.canvas.getContext('2d');
    const centerX = spritePosition.x + spriteSize.x / 2;
    const centerY = spritePosition.y + spriteSize.y / 2;

    ctx.translate(centerX, centerY);
    ctx.scale(-1, 1);

    return { x: -spriteSize.x / 2, y: -spriteSize.y / 2 };
  }

  // draws the colored image onto the canvas
  // if the size and position haven't changed since the last frame, uses a cached version of the image
  // otherwise, draws a new colored image
  recolorSprite(sprite) {
    let imgCanvas = sprite.getImgCanvas();
    let innerCtx = null;

    const outerCtx = sprite.canvas.getContext('2d');

    const hasSizeChanged = sprite.propertiesChanged.size == true;
    const hasHSLChanged = sprite.propertiesChanged.hsl == true;
    const spriteSize = sprite.getSize();

    if (!imgCanvas) {
      imgCanvas = document.createElement('canvas');
      sprite.setImgCanvas(imgCanvas);
    }

    innerCtx = imgCanvas.getContext('2d');

    if (hasSizeChanged) {
      if (spriteSize.x === 0) return;

      imgCanvas.width = Math.max(spriteSize.x, 1);
      imgCanvas.height = Math.max(spriteSize.y, 1);
    }

    if (hasHSLChanged || hasSizeChanged) this.reColorHSL(sprite, innerCtx);

    outerCtx.drawImage(imgCanvas, sprite.getPosition().x, sprite.getPosition().y);
    innerCtx.globalCompositeOperation = 'source-over';
  }

  drawImage(sprite) {
    const ctx = sprite.canvas.getContext('2d');
    const spritePosition = sprite.getPosition();
    const spriteSize = sprite.getSize();
    const image = sprite.getImage();

    const croppedX = 0;
    //   (!this._animationFrames &&
    //     this._currentFrame * (this._image.width / this._numFrames)) ||
    //   0;
    const croppedWidth = image.width;
    //   (!this._animationFrames && this._image.width / this._numFrames) ||
    //   this._image.width;

    ctx.drawImage(
      image,
      croppedX,
      0,
      croppedWidth,
      image.height,
      spritePosition.x,
      spritePosition.y,
      spriteSize.x,
      spriteSize.y
    );
  }
  // draws the sprite onto the screen
  drawSprite(sprite) {
    let offset = null;

    const spriteSizePixels = sprite.getSize();
    const ctx = sprite.canvas.getContext('2d');

    if (sprite.getFlip() === 'horizontal')
      offset = this.flipHorizontally(sprite);
    else if (sprite.getRotation()) offset = this.rotateSprite(sprite);

    if (sprite.getHSL() != null) this.recolorSprite(sprite);
    else {
      if (offset)
        ctx.drawImage(
          sprite.getImage(),
          offset.x,
          offset.y,
          spriteSizePixels.x,
          spriteSizePixels.y
        );
      else this.drawImage(sprite);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

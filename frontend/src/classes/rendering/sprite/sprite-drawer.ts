import type { IDrawableSprite } from '../../../types/rendering.ts';

/**
 * Class responsible for drawing sprites onto the canvas
 */
export default class SpriteDrawer {
  /**
   * Changes the image's color using HSL
   * @param sprite - The sprite to recolor
   * @param innerCtx - The canvas context for the inner canvas
   */
  private reColorHSL(
    sprite: IDrawableSprite,
    innerCtx: CanvasRenderingContext2D
  ): void {
    const image = sprite.getImage();

    if (!image) return;

    const spriteSize = sprite.getSize();
    const hsl = sprite.getHSL();

    if (!hsl) return;

    innerCtx.globalCompositeOperation = 'source-over';
    innerCtx.clearRect(0, 0, spriteSize.x, spriteSize.y);
    innerCtx.drawImage(image, 0, 0, spriteSize.x, spriteSize.y);

    // Add in hue, saturation, and lightness
    innerCtx.globalCompositeOperation = 'multiply';
    innerCtx.fillStyle =
      'hsl(' +
      (hsl.h ?? 0) +
      ',' +
      (hsl.s ?? 100) +
      '%, ' +
      (hsl.l ?? 50) +
      '%,' +
      '1' +
      ')';

    innerCtx.fillRect(0, 0, spriteSize.x, spriteSize.y);

    // Mask image onto canvas
    innerCtx.globalCompositeOperation = 'destination-in';
    innerCtx.drawImage(image, 0, 0, spriteSize.x, spriteSize.y);

    innerCtx.globalCompositeOperation = 'source-over';
  }

  /**
   * Draws the colored image onto the canvas.
   * The caller is responsible for applying any canvas transformations.
   *
   * @param sprite - The sprite to recolor and draw
   */
  private recolorSprite(sprite: IDrawableSprite): void {
    if (!sprite.canvas) return;

    let imgCanvas = sprite.getImgCanvas();
    const outerCtx = sprite.canvas.getContext('2d');
    const spriteSize = sprite.getSize();

    if (!outerCtx) return;

    if (!imgCanvas) {
      imgCanvas = document.createElement('canvas');
      sprite.setImgCanvas(imgCanvas);
    }

    const innerCtx = imgCanvas.getContext('2d');
    if (!innerCtx) return;

    const hasSizeChanged = sprite.propertiesChanged.size === true;
    const hasHSLChanged = sprite.propertiesChanged.hsl === true;

    if (hasSizeChanged) {
      if (spriteSize.x === 0 || spriteSize.y === 0) return;

      imgCanvas.width = Math.max(spriteSize.x, 1);
      imgCanvas.height = Math.max(spriteSize.y, 1);
    }

    if (hasHSLChanged || hasSizeChanged) {
      this.reColorHSL(sprite, innerCtx);
    }

    // Draw relative to the sprite center. drawSprite() has already
    // translated the context to the center of the sprite.
    outerCtx.drawImage(
      imgCanvas,
      -spriteSize.x / 2,
      -spriteSize.y / 2,
      spriteSize.x,
      spriteSize.y
    );
  }

  /**
   * Draws the sprite image onto the canvas.
   * The caller is responsible for applying any canvas transformations.
   *
   * @param sprite - The sprite to draw
   */
  private drawImage(sprite: IDrawableSprite): void {
    if (!sprite.canvas) return;

    const ctx = sprite.canvas.getContext('2d');
    if (!ctx) return;

    const spriteSize = sprite.getSize();
    const image = sprite.getImage();

    if (!image) return;

    const croppedX = 0;
    const croppedWidth = image.width;

    // drawImage() is now relative to the sprite center.
    // drawSprite() translates the context to that center first.
    ctx.drawImage(
      image,
      croppedX,
      0,
      croppedWidth,
      image.height,
      -spriteSize.x / 2,
      -spriteSize.y / 2,
      spriteSize.x,
      spriteSize.y
    );
  }

  /**
   * Draws the sprite onto the screen.
   *
   * Rotation and flipping are applied around the center of the sprite,
   * allowing them to be combined correctly.
   *
   * @param sprite - The sprite to draw
   */
  drawSprite(sprite: IDrawableSprite): void {
    if (!sprite.canvas) return;

    const ctx = sprite.canvas.getContext('2d');
    if (!ctx) return;

    const spritePosition = sprite.getPosition();
    const spriteSize = sprite.getSize();

    const centerX = spritePosition.x + spriteSize.x / 2;
    const centerY = spritePosition.y + spriteSize.y / 2;

    try {
      // Move the origin to the center of the sprite.
      ctx.translate(centerX, centerY);

      // Apply rotation around the sprite center.
      const rotation = sprite.getRotation();

      if (rotation) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      // Apply the flip around the same center.
      const flip = sprite.getFlip();

      if (flip === 'horizontal') {
        ctx.scale(-1, 1);
      } else if (flip === 'vertical') {
        ctx.scale(1, -1);
      }

      // Both normal and HSL sprites are now drawn using the same
      // local coordinate system.
      if (sprite.getHSL()) {
        this.recolorSprite(sprite);
      } else {
        this.drawImage(sprite);
      }
    } finally {
      // Always restore the canvas transform, including when an
      // image/context operation exits early or throws.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}

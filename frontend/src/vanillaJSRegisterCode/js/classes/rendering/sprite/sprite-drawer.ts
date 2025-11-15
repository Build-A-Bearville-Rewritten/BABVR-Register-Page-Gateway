import type { Point2D } from '../../../../types/common.ts';
import type { IDrawableSprite } from '../../../../types/rendering.ts';

/**
 * Class responsible for drawing sprites onto the canvas
 */
export default class SpriteDrawer {
  constructor() {}

  /**
   * Changes the image's color using HSL
   * @param sprite - The sprite to recolor
   * @param innerCtx - The canvas context for the inner canvas
   */
  private reColorHSL(sprite: IDrawableSprite, innerCtx: CanvasRenderingContext2D): void {
    const image = sprite.getImage();
    if (!image) return;

    const spriteSize = sprite.getSize();
    const hsl = sprite.getHSL();
    if (!hsl) return;

    innerCtx.globalCompositeOperation = 'source-over';
    innerCtx.drawImage(image, 0, 0, spriteSize.x, spriteSize.y);

    // Add in hue, sat, and lightness
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
  }

  /**
   * Rotates the image based on its rotation property
   * @param sprite - The sprite to rotate
   * @returns The offset position for drawing, or null if rotation cannot be applied
   */
  private rotateSprite(sprite: IDrawableSprite): Point2D | null {
    if (!sprite.canvas) return null;

    const spritePosition = sprite.getPosition();
    const spriteSize = sprite.getSize();
    const rotation = sprite.getRotation();
    if (rotation === undefined) return null;

    const ctx = sprite.canvas.getContext('2d');
    if (!ctx) return null;

    const centerx = spritePosition.x + spriteSize.x / 2;
    const centery = spritePosition.y + spriteSize.y / 2;

    ctx.translate(centerx, centery);
    ctx.rotate((rotation * Math.PI) / 180);

    return { x: -spriteSize.x / 2, y: -spriteSize.y / 2 };
  }

  /**
   * Flips the image horizontally if the flip: "horizontal" property is set
   * @param sprite - The sprite to flip
   * @returns The offset position for drawing, or null if flip cannot be applied
   */
  private flipHorizontally(sprite: IDrawableSprite): Point2D | null {
    if (!sprite.canvas) return null;

    const spriteSize = sprite.getSize();
    const spritePosition = sprite.getPosition();

    const ctx = sprite.canvas.getContext('2d');
    if (!ctx) return null;

    const centerX = spritePosition.x + spriteSize.x / 2;
    const centerY = spritePosition.y + spriteSize.y / 2;

    ctx.translate(centerX, centerY);
    ctx.scale(-1, 1);

    return { x: -spriteSize.x / 2, y: -spriteSize.y / 2 };
  }

  /**
   * Draws the colored image onto the canvas
   * If the size and position haven't changed since the last frame, uses a cached version of the image
   * Otherwise, draws a new colored image
   * @param sprite - The sprite to recolor and draw
   */
  private recolorSprite(sprite: IDrawableSprite): void {
    if (!sprite.canvas) return;

    let imgCanvas = sprite.getImgCanvas();
    let innerCtx: CanvasRenderingContext2D | null = null;

    const outerCtx = sprite.canvas.getContext('2d');
    if (!outerCtx) return;

    const hasSizeChanged = sprite.propertiesChanged.size === true;
    const hasHSLChanged = sprite.propertiesChanged.hsl === true;
    const spriteSize = sprite.getSize();

    if (!imgCanvas) {
      imgCanvas = document.createElement('canvas');
      sprite.setImgCanvas(imgCanvas);
    }

    innerCtx = imgCanvas.getContext('2d');
    if (!innerCtx) return;

    if (hasSizeChanged) {
      if (spriteSize.x === 0) return;

      imgCanvas.width = Math.max(spriteSize.x, 1);
      imgCanvas.height = Math.max(spriteSize.y, 1);
    }

    if (hasHSLChanged || hasSizeChanged) {
      this.reColorHSL(sprite, innerCtx);
    }

    outerCtx.drawImage(imgCanvas, sprite.getPosition().x, sprite.getPosition().y);
    innerCtx.globalCompositeOperation = 'source-over';
  }

  /**
   * Draws the sprite image onto the canvas
   * @param sprite - The sprite to draw
   */
  private drawImage(sprite: IDrawableSprite): void {
    if (!sprite.canvas) return;

    const ctx = sprite.canvas.getContext('2d');
    if (!ctx) return;

    const spritePosition = sprite.getPosition();
    const spriteSize = sprite.getSize();
    const image = sprite.getImage();
    if (!image) return;

    const croppedX = 0;
    const croppedWidth = image.width;

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

  /**
   * Draws the sprite onto the screen
   * @param sprite - The sprite to draw
   */
  drawSprite(sprite: IDrawableSprite): void {
    if (!sprite.canvas) return;

    let offset: Point2D | null = null;

    const spriteSizePixels = sprite.getSize();
    const ctx = sprite.canvas.getContext('2d');
    if (!ctx) return;

    if (sprite.getFlip() === 'horizontal') {
      offset = this.flipHorizontally(sprite);
    } else if (sprite.getRotation()) {
      offset = this.rotateSprite(sprite);
    }

    if (sprite.getHSL() != null) {
      this.recolorSprite(sprite);
    } else {
      const image = sprite.getImage();
      if (!image) return;

      if (offset) {
        ctx.drawImage(
          image,
          offset.x,
          offset.y,
          spriteSizePixels.x,
          spriteSizePixels.y
        );
      } else {
        this.drawImage(sprite);
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}


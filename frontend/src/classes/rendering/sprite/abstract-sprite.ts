import type {
  HSL,
  Point2D,
  Scale2D,
  Size2D,
  SpriteConstructorOptions
} from '../../../types/common.js';
import type { SpriteParent } from '../../../types/rendering.js';

import screenHandlerModule from '../../../modules/screen-handler-module.ts';
import spriteRendererModule from '../../../modules/sprite-renderer-module.ts';

/**
 * Properties that can be changed in the current frame
 */
interface PropertiesChanged {
  rotation?: boolean;
  hsl?: boolean;
  size?: boolean;
  position?: boolean;
}

export default class AbstractSprite {
  // Public properties
  public canvas: HTMLCanvasElement | undefined;
  public parent: SpriteParent | undefined;
  public propertiesChanged: PropertiesChanged;
  public id: number | null;

  // Private properties
  private _image: HTMLImageElement | null;
  private _rotation: number | undefined;
  private _hsl: HSL | undefined;
  private _imgCanvas: HTMLCanvasElement | undefined;

  private readonly _anchorPoint: Point2D;
  private readonly _flip: 'horizontal' | 'vertical' | undefined;
  private readonly _imagePath: string | undefined;
  private readonly _isFixedSize: boolean;
  private readonly _position: Point2D;
  private readonly _positionScale: Point2D;
  private readonly _size: Size2D;
  private readonly _sizeScale: Scale2D;
  private readonly _zIndex: number;

  constructor({
    imagePath,
    parent,
    sizeScale = { x: 0, y: 0 },
    anchorPoint = { x: 0, y: 0 },
    positionScale = { x: 0, y: 0 },
    zIndex = 10,
    rotation,
    flip,
    hsl,
    isFixedSize = false,
    canvas
  }: SpriteConstructorOptions) {
    // Public properties
    this.canvas = canvas;
    this.parent = parent;

    // Properties that were changed in the current frame
    this.propertiesChanged = {
      rotation: true,
      hsl: true,
      size: true
    };

    this.id = null;

    // Private properties
    this._position = { x: 0, y: 0 };
    this._positionScale = positionScale;
    this._size = { x: 0, y: 0 };
    this._sizeScale = sizeScale;
    this._anchorPoint = anchorPoint;
    this._zIndex = zIndex;
    this._isFixedSize = isFixedSize;
    this._imagePath = imagePath;
    this._image = null;
    this._rotation = rotation;
    this._hsl = hsl;
    this._flip = flip;
    this._imgCanvas = undefined;

    spriteRendererModule.getSpriteRenderer().addSpriteToScreen(this);

    this.loadImage(imagePath);
  }

  // -------------------------------------------------------------------------
  //  Public methods
  // -------------------------------------------------------------------------

  /**
   * Draws the sprite on the canvas and updates its animation, size, and position
   */
  update(): void {
    this.updateSize();
    this.updatePosition();
  }

  /**
   * Gets the rotation of the sprite in degrees
   * @returns The rotation angle in degrees, or undefined if not set
   */
  getRotation(): number | undefined {
    return this._rotation;
  }

  /**
   * Sets the rotation of the sprite
   * @param newRotation - The new rotation angle in degrees
   */
  setRotation(newRotation: number): void {
    if (!this.canvas) return;

    const screenHandler = screenHandlerModule.getInstance(this.canvas);

    this._rotation = newRotation;
    this.propertiesChanged.rotation = true;

    globalThis.requestAnimationFrame(() => screenHandler.drawScreen());
  }

  /**
   * Gets the position scale of the sprite
   * @returns The position scale as a Point2D
   */
  getPositionScale(): Point2D {
    return this._positionScale;
  }

  /**
   * Sets the position scale of the sprite
   * @param positionScale - Partial position scale values
   */
  setPositionScale({ x, y }: Partial<Point2D>): void {
    if (!this.canvas) return;

    const screenHandler = screenHandlerModule.getInstance(this.canvas);

    this._positionScale.x = x ?? this._positionScale.x;
    this._positionScale.y = y ?? this._positionScale.y;

    globalThis.requestAnimationFrame(() => screenHandler.drawScreen());
  }

  /**
   * Gets the HSL color values of the sprite
   * @returns The HSL color values, or undefined if not set
   */
  getHSL(): HSL | undefined {
    return this._hsl;
  }

  /**
   * Sets the HSL color values of the sprite
   * @param hsl - Partial HSL color values
   */
  setHSL({ h, s, l }: Partial<HSL>): void {
    if (!this.canvas) return;

    const screenHandler = screenHandlerModule.getInstance(this.canvas);

    this._hsl = {
      h: h ?? this._hsl?.h,
      s: s ?? this._hsl?.s,
      l: l ?? this._hsl?.l
    };

    this.propertiesChanged.hsl = true;

    globalThis.requestAnimationFrame(() => screenHandler.drawScreen());
  }

  /**
   * Gets the current position of the sprite
   * @returns The position as a Point2D
   */
  getPosition(): Point2D {
    return this._position;
  }

  /**
   * Gets the size scale of the sprite
   * @returns The size scale as a Scale2D (number or Point2D)
   */
  getSizeScale(): Scale2D {
    return this._sizeScale;
  }

  /**
   * Gets the anchor point of the sprite
   * @returns The anchor point as a Point2D
   */
  getAnchorPoint(): Point2D {
    return this._anchorPoint;
  }

  /**
   * Gets the current size of the sprite
   * @returns The size as a Size2D
   */
  getSize(): Size2D {
    return this._size;
  }

  /**
   * Gets the image path of the sprite
   * @returns The image path, or undefined if not set
   */
  getImagePath(): string | undefined {
    return this._imagePath;
  }

  /**
   * Gets the loaded image element
   * @returns The HTMLImageElement, or null if not loaded
   */
  getImage(): HTMLImageElement | null {
    return this._image;
  }

  /**
   * Gets the z-index of the sprite
   * @returns The z-index value
   */
  getZIndex(): number {
    return this._zIndex;
  }

  /**
   * Gets the flip direction of the sprite
   * @returns The flip direction, or undefined if not set
   */
  getFlip(): 'horizontal' | 'vertical' | undefined {
    return this._flip;
  }

  /**
   * Gets the image canvas
   * @returns The HTMLCanvasElement, or undefined if not set
   */
  getImgCanvas(): HTMLCanvasElement | undefined {
    return this._imgCanvas;
  }

  /**
   * Sets the image canvas
   * @param imgCanvas - The HTMLCanvasElement to set
   */
  setImgCanvas(imgCanvas: HTMLCanvasElement): void {
    this._imgCanvas = imgCanvas;
  }

  /**
   * Loads an image from the given URL
   * @param url - The URL of the image to load
   */
  private loadImage(url: string | undefined): void {
    if (!url) return;

    const image = new Image();

    image.onload = () => {
      if (!this.canvas) return;
      const screenHandler = screenHandlerModule.getInstance(this.canvas);
      globalThis.requestAnimationFrame(() => screenHandler.drawScreen());
      this._image = image;
    };

    image.src = url;
  }

  /**
   * Gets the size of the sprite's parent
   * @returns The parent size as a Size2D
   */
  private getParentSize(): Size2D {
    let parentSizeX = 0;
    let parentSizeY = 0;

    if (this.parent instanceof HTMLCanvasElement) {
      parentSizeX = this.parent.width;
      parentSizeY = this.parent.height;
    } else if (this.parent) {
      parentSizeX = this.parent._size.x;
      parentSizeY = this.parent._size.y;
    }

    return { x: parentSizeX, y: parentSizeY };
  }

  /**
   * Gets the position of the sprite's parent
   * @returns The parent position as a Point2D
   */
  private getParentPosition(): Point2D {
    let parentPositionX = 0;
    let parentPositionY = 0;

    if (this.parent && !(this.parent instanceof HTMLCanvasElement)) {
      const parentPosition = this.parent.getPosition();
      parentPositionX = parentPosition.x;
      parentPositionY = parentPosition.y;
    }

    return { x: parentPositionX, y: parentPositionY };
  }

  /**
   * Updates the sprite's position based on the `positionScale` property
   */
  private updatePosition(): void {
    const parentPosition = this.getParentPosition();
    const parentSize = this.getParentSize();
    const positionScaleX = this._positionScale.x * parentSize.x;
    const positionScaleY = this._positionScale.y * parentSize.y;
    const anchorX = this._anchorPoint.x * this._size.x;
    const anchorY = this._anchorPoint.y * this._size.y;

    this._position.x = parentPosition.x + positionScaleX - anchorX;
    this._position.y = parentPosition.y + positionScaleY - anchorY;

    this.propertiesChanged.position = true;
  }

  /**
   * Updates the sprite's size based on the `_sizeScale` property
   */
  private updateSize(): void {
    if (this._isFixedSize || !this._image) return;

    const parentSize = this.getParentSize();

    if (typeof this._sizeScale === 'number') {
      const imgAspectRatio = this._image.width / this._image.height;
      const desiredHeight = parentSize.y * this._sizeScale;

      this._size.x = desiredHeight * imgAspectRatio;
      this._size.y = desiredHeight;
    } else {
      this._size.x = this._sizeScale.x * parentSize.x;
      this._size.y = this._sizeScale.y * parentSize.y;
    }

    this.propertiesChanged.size = true;
  }
}

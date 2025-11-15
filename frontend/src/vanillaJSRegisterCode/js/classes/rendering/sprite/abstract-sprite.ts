import spriteRendererModule from '../../../modules/sprite-renderer-module.js';
import screenHandlerModule from '../../../modules/screen-handler-module.js';
import type { SpriteConstructorOptions, Point2D, Size2D, Scale2D, HSL } from '../../../../types/common.js';
import type { SpriteParent } from '../../../../types/rendering.js';

/*
Class for drawing a Sprite onto the screen
Sprites are images with extra properties and methods to make it easier to use on the canvas
*/

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
  public id: string | null;

  // Private properties
  private _position: Point2D;
  private _positionScale: Point2D;
  private _size: Size2D;
  private _sizeScale: Scale2D;
  private _anchorPoint: Point2D;
  private _zIndex: number;
  private _isFixedSize: boolean;
  private _imagePath: string | undefined;
  private _image: HTMLImageElement | null;
  private _rotation: number | undefined;
  private _hsl: HSL | undefined;
  private _flip: 'horizontal' | 'vertical' | undefined;
  private _imgCanvas: HTMLCanvasElement | undefined;

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
    window.requestAnimationFrame(() => screenHandler.drawScreen());
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
    window.requestAnimationFrame(() => screenHandler.drawScreen());
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
    window.requestAnimationFrame(() => screenHandler.drawScreen());
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

  // -------------------------------------------------------------------------
  //  Private methods
  // -------------------------------------------------------------------------

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
      window.requestAnimationFrame(() => screenHandler.drawScreen());
      this._image = image;
    };

    image.src = url;
  }

  /**
   * Gets the size of the sprite's parent
   * @returns The parent size as a Size2D
   */
  private getParentSize(): Size2D {
    let parentSizex = 0;
    let parentSizey = 0;

    if (this.parent instanceof HTMLCanvasElement) {
      parentSizex = this.parent.width;
      parentSizey = this.parent.height;
    } else if (this.parent) {
      parentSizex = (this.parent as any)._size.x;
      parentSizey = (this.parent as any)._size.y;
    }

    return { x: parentSizex, y: parentSizey };
  }

  /**
   * Gets the position of the sprite's parent
   * @returns The parent position as a Point2D
   */
  private getParentPosition(): Point2D {
    let parentPosx = 0;
    let parentPosy = 0;

    if (this.parent && !(this.parent instanceof HTMLCanvasElement)) {
      const parentPos = (this.parent as any).getPosition();
      parentPosx = parentPos.x;
      parentPosy = parentPos.y;
    }

    return { x: parentPosx, y: parentPosy };
  }

  /**
   * Updates the sprite's position based on the `positionScale` property
   */
  private updatePosition(): void {
    const parentPosition = this.getParentPosition();
    const parentSize = this.getParentSize();

    const positionScalex = this._positionScale.x * parentSize.x;
    const positionScaley = this._positionScale.y * parentSize.y;

    const anchorx = this._anchorPoint.x * this._size.x;
    const anchory = this._anchorPoint.y * this._size.y;

    this._position.x = parentPosition.x + positionScalex - anchorx;
    this._position.y = parentPosition.y + positionScaley - anchory;

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
      const desiredWidth = desiredHeight * imgAspectRatio;

      this._size.x = desiredWidth;
      this._size.y = desiredHeight;
    } else {
      this._size.x = this._sizeScale.x * parentSize.x;
      this._size.y = this._sizeScale.y * parentSize.y;
    }

    this.propertiesChanged.size = true;
  }
}


// Color wheel portion of the page

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import Draggable from '../rendering/sprite/draggable.ts';
import type { Point2D } from '../../../types/common.ts';

/**
 * Helper type to bridge StaticSprite (which has canvas: HTMLCanvasElement | undefined)
 * with IClickableSprite/IDraggableSprite (which require canvas: HTMLCanvasElement)
 * All sprites created in createSprites() have a canvas, so this assertion is safe
 */
type SpriteWithCanvas = StaticSprite & { canvas: HTMLCanvasElement };

/**
 * Color wheel UI component for selecting colors
 */
export default class ColorWheel {
  public canvas: HTMLCanvasElement;
  
  // Sprite references
  private cogSprite!: StaticSprite;
  private whiteCircleInner!: StaticSprite;
  private colorWheelColors!: StaticSprite;
  private sliderContainer!: StaticSprite;
  private sliderColor!: StaticSprite;
  private sliderGradient!: StaticSprite;
  private sliderArrow!: StaticSprite;
  private blueColorArrow!: StaticSprite;
  private colorCircleInner!: StaticSprite;
  private topArrow!: StaticSprite;
  private bottomArrow!: StaticSprite;

  // Interaction handlers
  private _clickable: Clickable;
  private _draggable: Draggable;
  private _spriteBeingDragged: StaticSprite | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this._clickable = new Clickable();
    this._draggable = new Draggable();

    this.createSprites();
    this.bindEvents();

    // this.sliderColor.hsl = 230;
    // this.colorCircleInner.hue = this.sliderColor.hue;
  }

  // -------------------------------------------
  // PUBLIC METHODS
  // -------------------------------------------

  /**
   * Cleanup method - destroys clickable and draggable handlers
   */
  destroy(): void {
    this._clickable.destroy();
    this._draggable.destroy();
  }

  // -------------------------------------------
  // PRIVATE METHODS
  // -------------------------------------------

  /**
   * Binds any of the StaticSprite's events
   * Note: Type assertions are used because all sprites are created with a canvas
   * in createSprites(), which is called before bindEvents() in the constructor.
   */
  private bindEvents(): void {
    // All sprites have canvas at this point (created in createSprites() with canvas: this.canvas)
    this._clickable.onClick(this.bottomArrow as SpriteWithCanvas, () => {
      const nearestAngle = this.roundToNearestAngle(15);
      this.colorWheelColors.setRotation(nearestAngle);
      this.moveWheel(15);
    });

    this._clickable.onClick(this.topArrow as SpriteWithCanvas, () => {
      const nearestAngle = this.roundToNearestAngle(15);
      this.colorWheelColors.setRotation(nearestAngle);
      this.moveWheel(-15);
    });

    this._draggable.onDrag(
      this.sliderContainer as SpriteWithCanvas,
      this.onColorSliderDrag.bind(this)
    );
    this._draggable.onDragStarted(
      this.sliderContainer as SpriteWithCanvas,
      this.onDragStarted.bind(this)
    );
    this._draggable.onDragEnded(
      this.sliderContainer as SpriteWithCanvas,
      this.onDragEnded.bind(this)
    );

    this._draggable.onDrag(
      this.colorWheelColors as SpriteWithCanvas,
      this.onColorWheelDragged.bind(this)
    );
    this._draggable.onDragStarted(
      this.colorWheelColors as SpriteWithCanvas,
      this.onDragStarted.bind(this)
    );
    this._draggable.onDragEnded(
      this.colorWheelColors as SpriteWithCanvas,
      this.onDragEnded.bind(this)
    );
  }

  /**
   * Called when we started dragging a sprite
   * Tells the class that we started dragging
   * @param _ - Mouse event (unused)
   * @param whichSprite - The sprite being dragged (IDraggableSprite interface, but we know it's StaticSprite at runtime)
   */
  private onDragStarted(_: MouseEvent, whichSprite: { canvas: HTMLCanvasElement; getPosition(): Point2D; getSize(): { x: number; y: number }; _isDragging?: boolean }): void {
    if (this._spriteBeingDragged) return;
    // Type assertion: IDraggableSprite passed here is always StaticSprite in our implementation
    this._spriteBeingDragged = whichSprite as StaticSprite;
  }

  /**
   * Called when we stop dragging a sprite
   * Tells the class that we aren't dragging anymore
   */
  private onDragEnded(): void {
    this._spriteBeingDragged = null;
  }

  /**
   * Drags the slider up and down inside of its container
   * Updates color wheel color lightness/darkness when dragged
   * @param mouseEvent - The mouse event from dragging
   */
  private onColorSliderDrag(mouseEvent: MouseEvent): void {
    if (this._spriteBeingDragged !== this.sliderContainer) return;

    const parent = this.sliderArrow.parent;
    if (!parent) return;

    const topY = parent.getPosition().y;
    const bottomY = topY + parent.getSize().y;
    const mouseY = mouseEvent.clientY - 0.5 * this.sliderArrow.getSize().y;
    const scaledY = (mouseY - topY) / (bottomY - topY);
    const clampedMouseY = Math.min(Math.max(scaledY, 0), 1);

    this.sliderArrow.setPositionScale({ y: clampedMouseY });
    
    const hsl = this.colorCircleInner.getHSL();
    if (hsl) {
      const newLightness = Math.max((1 - clampedMouseY) * 100, 0.1);
      this.colorCircleInner.setHSL({ l: newLightness });
    }
  }

  /**
   * Gets the amount / direction the wheel should be rotated by
   * and then calls moveWheel to move the wheel that rotation amount
   * @param mouseEvent - The mouse event from dragging
   * @param xVelocity - Horizontal velocity of the drag
   * @param yVelocity - Vertical velocity of the drag
   */
  private onColorWheelDragged(
    mouseEvent: MouseEvent,
    xVelocity: number,
    yVelocity: number
  ): void {
    if (this._spriteBeingDragged !== this.colorWheelColors) return;

    const cogScale = this.cogSprite.getSize().x;
    const canvasPos = this.canvas.getBoundingClientRect();
    // DOMRect has x/y as aliases for left/top, but TypeScript types may not include them
    // Using top/left for type safety (maintaining original logic where y maps to X and x maps to Y)
    const cogMiddleX =
      canvasPos.top + this.cogSprite.getPosition().y + 0.5 * cogScale;
    const cogMiddleY =
      canvasPos.left + this.cogSprite.getPosition().x + 0.5 * cogScale;
    const xSign = mouseEvent.clientY > cogMiddleX ? -1 : 1;
    const ySign = mouseEvent.clientX > cogMiddleY ? -1 : 1;

    let rotationAmount = 10 * (xSign * xVelocity - ySign * yVelocity);
    rotationAmount = isFinite(rotationAmount) ? rotationAmount : 0;
    this.moveWheel(rotationAmount);
  }

  /**
   * Moves the wheel rotationAmount and sets the color to be the new color
   * @param rotationAmount - The amount to rotate the wheel in degrees
   */
  private moveWheel(rotationAmount: number): void {
    const currentRotationValue = this.colorWheelColors.getRotation() ?? 0;
    let currentRotation = (currentRotationValue + rotationAmount) % 360;

    if (currentRotation <= 0) currentRotation = 360 + currentRotation;

    const sliderHSL = this.sliderColor.getHSL();
    const currentHue = sliderHSL?.h ?? 0;
    const newHue = (currentHue + rotationAmount) % 360;

    this.colorWheelColors.setRotation(currentRotation);
    this.cogSprite.setRotation(currentRotation);

    this.sliderColor.setHSL({ h: newHue });
    this.colorCircleInner.setHSL({ h: newHue });
  }

  /**
   * Rounds rotationAmount to the nearest 15th degree
   * @param rotationAmount - The rotation amount to round
   * @returns The nearest angle rounded to 15 degrees
   */
  private roundToNearestAngle(rotationAmount: number): number {
    const currentRotationValue = this.colorWheelColors.getRotation() ?? 0;
    const nearestAngle = Math.round(currentRotationValue / 15) * 15;

    return nearestAngle;
  }

  /**
   * Creates the sprites for the color wheel
   */
  private createSprites(): void {
    this.cogSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/sprites/blueCog.png',
      sizeScale: 0.5,
      parent: this.canvas,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 1, y: 0.5 }
    });

    this.whiteCircleInner = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/shapes/whiteCircle.svg',
      sizeScale: 0.8,
      parent: this.cogSprite,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 }
    });

    this.colorWheelColors = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/sprites/colorWheelColors.png',
      sizeScale: this.whiteCircleInner.getSizeScale(),
      parent: this.cogSprite,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 },
      rotation: 285
    });

    this.sliderContainer = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/shapes/sliderContainer.svg',
      sizeScale: 0.5,
      parent: this.cogSprite,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.4, y: 0.5 }
    });

    this.sliderColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/shapes/sliderWhite.svg',
      sizeScale: 0.66,
      parent: this.sliderContainer,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.425, y: 0.5 },
      hsl: { h: 216 }
    });

    this.sliderGradient = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/shapes/sliderGradient.svg',
      sizeScale: 1,
      parent: this.sliderColor,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 }
    });

    this.sliderArrow = new StaticSprite({
      canvas: this.canvas,
      parent: this.sliderColor,
      imagePath: './assets/Register/color-wheel/sprites/sliderArrow.png',
      sizeScale: { x: 1.3, y: 0.23 },
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: -0.8, y: 0.5 }
    });

    this.blueColorArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/sprites/blueArrow.png',
      sizeScale: 0.15,
      parent: this.cogSprite,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0, y: 0.5 }
    });

    const sliderHSL = this.sliderColor.getHSL();
    this.colorCircleInner = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/sprites/colorCircleInner.png',
      sizeScale: 0.5,
      parent: this.blueColorArrow,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.26, y: 0.45 },
      hsl: { ...sliderHSL }
    });

    this.topArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/sprites/upDownArrowColored.png',
      sizeScale: 1,
      parent: this.colorCircleInner,
      positionScale: { x: 0, y: -1.8 },
      rotation: 110
    });

    this.bottomArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: this.topArrow.getImagePath(),
      sizeScale: this.topArrow.getSizeScale(),
      parent: this.colorCircleInner,
      positionScale: { x: 0, y: 2.1 },
      rotation: 250
    });
  }
}


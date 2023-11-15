import StaticSprite from '../rendering/sprite/static-sprite.js';
import Clickable from '../rendering/sprite/clickable.js';
import Draggable from '../rendering/sprite/draggable.js';

// Color wheel portion of the page

export default class ColorWheel {
  constructor(canvas) {
    this.canvas = canvas;

    this._spriteBeingDragged = null;
    this._clickable = new Clickable(canvas);
    this._draggable = new Draggable(canvas);

    this.createSprites();
    this.bindEvents();

    // this.sliderColor.hsl = 230;
    // this.colorCircleInner.hue = this.sliderColor.hue;
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // -------------------------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------

  // bind any of the StaticSprite's events
  bindEvents() {
    this._clickable.onClick(this.bottomArrow, () => {
      const nearestAngle = this.roundToNearestAngle(15);
      this.colorWheelColors.setRotation(nearestAngle);
      this.moveWheel(15);
    });

    this._clickable.onClick(this.topArrow, () => {
      const nearestAngle = this.roundToNearestAngle(15);
      this.colorWheelColors.setRotation(nearestAngle);
      this.moveWheel(-15);
    });

    this._draggable.onDrag(
      this.sliderContainer,
      this.onColorSliderDrag.bind(this)
    );
    this._draggable.onDragStarted(
      this.sliderContainer,
      this.onDragStarted.bind(this)
    );
    this._draggable.onDragEnded(
      this.sliderContainer,
      this.onDragEnded.bind(this)
    );

    this._draggable.onDrag(
      this.colorWheelColors,
      this.onColorWheelDragged.bind(this)
    );
    this._draggable.onDragStarted(
      this.colorWheelColors,
      this.onDragStarted.bind(this)
    );
    this._draggable.onDragEnded(
      this.colorWheelColors,
      this.onDragEnded.bind(this)
    );
  }

  // called when we started dragging the slider
  // tells the class that we started dragging
  onDragStarted(_, whichSprite) {
    if (this._spriteBeingDragged) return;
    this._spriteBeingDragged = whichSprite;
  }

  // called when we stop dragging the slider
  // tells the class that we arent dragging the slider anymore
  onDragEnded() {
    this._spriteBeingDragged = null;
  }

  // drags the slider up and down inside of it's container
  // updates color wheel color lightness/darkness when dragged
  onColorSliderDrag(mouseEvent) {
    if (this._spriteBeingDragged != this.sliderContainer) return;

    const topY = this.sliderArrow.parent.getPosition().y;
    const bottomY = topY + this.sliderArrow.parent.getSize().y;
    const mouseY = mouseEvent.clientY - 0.5 * this.sliderArrow.getSize().y;
    const scaledY = (mouseY - topY) / (bottomY - topY);
    const clampedMouseY = Math.min(Math.max(scaledY, 0), 1);

    this.sliderArrow.setPositionScale({ y: clampedMouseY });
    this.colorCircleInner.getHSL().l = Math.max((1 - clampedMouseY) * 100, 0.1);
  }

  // gets the amount / direction the wheel should be rotated by
  // and then calls moveWheel to move the wheel that rotation amount
  onColorWheelDragged(mouseEvent, xVelocity, yVelocity) {
    if (this._spriteBeingDragged != this.colorWheelColors) return;

    let rotationAmount = null;

    const cogScale = this.cogSprite.getSize().x;
    const canvasPos = this.canvas.getBoundingClientRect();
    const cogMiddleX =
      canvasPos.y + this.cogSprite.getPosition().y + 0.5 * cogScale;
    const cogMiddleY =
      canvasPos.x + this.cogSprite.getPosition().x + 0.5 * cogScale;
    const xSign = mouseEvent.clientY > cogMiddleX ? -1 : 1;
    const ySign = mouseEvent.clientX > cogMiddleY ? -1 : 1;

    rotationAmount = 10 * (xSign * xVelocity - ySign * yVelocity);
    rotationAmount = isFinite(rotationAmount) ? rotationAmount : 0;
    this.moveWheel(rotationAmount);
  }

  // moves the wheel rotationAmount and sets the color to be the new color
  moveWheel(rotationAmount) {
    let currentRotation =
      (this.colorWheelColors.getRotation() + rotationAmount) % 360;

    if (currentRotation <= 0) currentRotation = 360 + currentRotation;

    const newHue = (this.sliderColor.getHSL().h + rotationAmount) % 360;

    this.colorWheelColors.setRotation(currentRotation);
    this.cogSprite.setRotation(currentRotation);

    this.sliderColor.setHSL({ h: newHue });
    this.colorCircleInner.setHSL({ h: newHue });
  }

  // rounds rotationAmount to the nearest 15th degree
  roundToNearestAngle(rotationAmount) {
    const currentAngle = this.colorWheelColors.getRotation();
    const nearestAngle = Math.round(currentAngle / 15) * 15;

    return nearestAngle;
  }

  // create the sprites for the colorwheel
  createSprites() {
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

    this.colorCircleInner = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/color-wheel/sprites/colorCircleInner.png',
      sizeScale: 0.5,
      parent: this.blueColorArrow,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.26, y: 0.45 },
      hsl: { ...this.sliderColor.getHSL() }
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

  destroy() {
    this._clickable.destroy();
    this._draggable.destroy();
  }
}

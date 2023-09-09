import Sprite from "./sprite.js";

// Color wheel portion of the page

export default class ColorWheel {
  constructor(canvas) {
    this.canvas = canvas;
    this._spriteBeingDragged = null;

    this.createSprites();
    this.bindEvents();

    this.sliderColor.hue = 230;
    this.colorCircleInner.hue = this.sliderColor.hue;
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // -------------------------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------

  // bind any of the sprite's events
  bindEvents() {
    this.bottomArrow.onClick(() => {
      const nearestAngle = this.roundToNearestAngle(15);
      this.colorWheelColors.rotation = nearestAngle;
      this.moveWheel(15);
    });

    this.topArrow.onClick(() => {
      const nearestAngle = this.roundToNearestAngle(15);
      this.colorWheelColors.rotation = nearestAngle;
      this.moveWheel(-15);
    });

    this.sliderContainer.onDrag({
      dragCb: this.onColorSliderDrag.bind(this),
      dragStartCb: this.onDragStarted.bind(this),
      dragEndCb: this.onDragEnded.bind(this),
    });

    this.colorWheelColors.onDrag({
      dragCb: this.onColorWheelDragged.bind(this),
      dragStartCb: this.onDragStarted.bind(this),
      dragEndCb: this.onDragEnded.bind(this),
    });
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

    const topY = this.sliderArrow.parent.position.y;
    const bottomY = topY + this.sliderArrow.parent.size.y;
    const mouseY = mouseEvent.clientY - 0.5 * this.sliderArrow.size.y;
    const scaledY = (mouseY - topY) / (bottomY - topY);
    const clampedMouseY = Math.min(Math.max(scaledY, 0), 1);

    this.sliderArrow.positionScale.y = clampedMouseY;
    this.colorCircleInner.hsl.l = Math.max((1 - clampedMouseY) * 100, 0.1);
  }

  // gets the amount / direction the wheel should be rotated by
  // and then calls moveWheel to move the wheel that rotation amount
  onColorWheelDragged(mouseEvent, xVelocity, yVelocity) {
    if (this._spriteBeingDragged != this.colorWheelColors) return;

    let rotationAmount = null;

    const cogScale = this.cogSprite.size.x;
    const canvasPos = this.canvas.getBoundingClientRect();
    const cogMiddleX = canvasPos.y + this.cogSprite.position.y + 0.5 * cogScale;
    const cogMiddleY = canvasPos.x + this.cogSprite.position.x + 0.5 * cogScale;
    const xSign = mouseEvent.clientY > cogMiddleX ? -1 : 1;
    const ySign = mouseEvent.clientX > cogMiddleY ? -1 : 1;

    rotationAmount = 10 * (xSign * xVelocity - ySign * yVelocity);
    rotationAmount = isFinite(rotationAmount) ? rotationAmount : 0;
    this.moveWheel(rotationAmount);
  }

  // moves the wheel rotationAmount and sets the color to be the new color
  moveWheel(rotationAmount) {
    const currentRotation =
      (this.colorWheelColors.rotation + rotationAmount) % 360;

    this.colorWheelColors.rotation = currentRotation;
    this.cogSprite.rotation = currentRotation;

    this.sliderColor.hsl.h = (this.sliderColor.hsl.h + rotationAmount) % 360;
    this.colorCircleInner.hsl.h = this.sliderColor.hsl.h;
  }

  // rounds rotationAmount to the nearest 15th degree
  roundToNearestAngle(rotationAmount) {
    const currentAngle = this.colorWheelColors.rotation;
    const nearestAngle = Math.round(currentAngle / 15) * 15;

    return nearestAngle;
  }

  // create the sprites for the colorwheel
  createSprites() {
    this.cogSprite = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/sprites/blueCog.png",
      sizeScale: 0.5,
      parent: this.canvas,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 1, y: 0.5 },
    });

    this.whiteCircleInner = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/shapes/whiteCircle.svg",
      sizeScale: 0.8,
      parent: this.cogSprite,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 },
    });

    this.colorWheelColors = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/sprites/colorWheelColors.png",
      sizeScale: this.whiteCircleInner.sizeScale,
      parent: this.cogSprite,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 },
      rotation: -75,
    });

    this.sliderContainer = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/shapes/sliderContainer.svg",
      sizeScale: 0.5,
      parent: this.cogSprite,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.4, y: 0.5 },
    });

    this.sliderColor = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/shapes/sliderWhite.svg",
      sizeScale: 0.66,
      parent: this.sliderContainer,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.425, y: 0.5 },
      hsl: { h: 216 },
    });

    this.sliderGradient = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/shapes/sliderGradient.svg",
      sizeScale: 1,
      parent: this.sliderColor,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 },
    });

    this.sliderArrow = new Sprite({
      canvas: this.canvas,
      parent: this.sliderColor,
      imageSrc: "./assets/Register/color-wheel/sprites/sliderArrow.png",
      sizeScale: { x: 1.3, y: 0.23 },
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: -0.8, y: 0.5 },
    });

    this.blueColorArrow = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/sprites/blueArrow.png",
      sizeScale: 0.15,
      parent: this.cogSprite,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0, y: 0.5 },
    });

    this.colorCircleInner = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/sprites/colorCircleInner.png",
      sizeScale: 0.5,
      parent: this.blueColorArrow,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.26, y: 0.45 },
      hsl: { ...this.sliderColor.hsl },
    });

    this.topArrow = new Sprite({
      canvas: this.canvas,
      imageSrc: "./assets/Register/color-wheel/sprites/upDownArrowColored.png",
      sizeScale: 1,
      parent: this.colorCircleInner,
      positionScale: { x: 0, y: -1.8 },
      rotation: 110,
    });

    this.bottomArrow = new Sprite({
      canvas: this.canvas,
      imageSrc: this.topArrow.imageSrc,
      sizeScale: this.topArrow.sizeScale,
      anchorPoint: this.topArrow.anchorPoint,
      parent: this.colorCircleInner,
      positionScale: { x: 0, y: 2.1 },
      rotation: 250,
    });
  }
}

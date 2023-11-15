import spriteRendererModule from '../../../modules/sprite-renderer-module.js';
import screenHandlerModule from '../../../modules/screen-handler-module.js';

/*
Class for drawing a Sprite onto the screen
Sprites are images with extra properties and methods to make it easier to use on the canvas
*/

export default class AbstractSprite {
  constructor({
    imagePath, // the image you want to load onto the sprite
    parent, // what the sprite is contained inside of. can either be a canvas or another image.
    sizeScale = { x: 0, y: 0 }, // the size of the image. set as a number (0-1) to change the whole scale, or you can specify y x and y scale individually: { x: 0, y: 0 },
    anchorPoint = { x: 0, y: 0 }, // position offset. the default (0,0) will position the sprite from it's upper left corner, (.5,.5) will position the sprite from the sprite's middle position
    positionScale = { x: 0, y: 0 }, // what position you want the sprite to be at relative to it's parent, (.5,.5) will position the image in the middle of it's parent's position
    zIndex = 10, // the 'layer' that you want the image to render on. higher the zIndex, the higher on the screen the sprite will render
    rotation, // degree that you want to rotate the image by
    flip, // "horizontal" flips the image horizontally
    hsl, // the sprite's hsl color value
    isFixedSize = false, // Setting to true allows for positioning based off set pixels instead of percents
    canvas // canvas the sprite should be rendered on
  }) {
    // public properties
    this.canvas = canvas;
    this.parent = parent;

    // properties that were changed in the current frame
    this.propertiesChanged = {
      ['rotation']: true,
      ['hsl']: true,
      ['size']: true
    };

    this.id = null;

    // private properties
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
    spriteRendererModule.getSpriteRenderer().addSpriteToScreen(this);
    this.loadImage(imagePath);
  }

  // -------------------------------------------------------------------------
  //  public methods (temporarily keeping this comment here until it's converted to ts)
  // -------------------------------------------------------------------------

  // draws the sprite on the canvas
  // and updates it's animation, size, and position
  update() {
    this.updateSize();
    this.updatePosition();
  }

  getRotation() {
    return this._rotation;
  }

  setRotation(newRotation) {
    const screenHandler = screenHandlerModule.getInstance(this.canvas);
    this._rotation = newRotation;
    this.propertiesChanged['rotation'] = true;
    window.requestAnimationFrame(screenHandler.drawScreen);
  }

  getPositionScale() {
    return this._positionScale;
  }

  setPositionScale({ x, y }) {
    const screenHandler = screenHandlerModule.getInstance(this.canvas);

    this._positionScale.x = x || this._positionScale.x;
    this._positionScale.y = y || this._positionScale.y;
    window.requestAnimationFrame(screenHandler.drawScreen);
  }

  getHSL() {
    return this._hsl;
  }

  setHSL({ h, s, l }) {
    const screenHandler = screenHandlerModule.getInstance(this.canvas);

    this._hsl = {
      h: h || this._hsl.h,
      s: s || this._hsl.s,
      l: l || this._hsl.l
    };

    this.propertiesChanged['hsl'] = true;
    window.requestAnimationFrame(screenHandler.drawScreen);
  }

  getPosition() {
    return this._position;
  }

  getSizeScale() {
    return this._sizeScale;
  }

  getSize() {
    return this._size;
  }

  getImagePath() {
    return this._imagePath;
  }

  getImage() {
    return this._image;
  }

  getZIndex() {
    return this._zIndex;
  }

  getFlip() {
    return this._flip;
  }

  getImgCanvas() {
    return this._imgCanvas;
  }

  setImgCanvas(imgCanvas) {
    this._imgCanvas = imgCanvas;
  }

  // -------------------------------------------------------------------------
  //  private methods (temporarily keeping this comment here until it's converted to ts)
  // -------------------------------------------------------------------------

  loadImage(url) {
    const image = new Image();

    image.onload = () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);
      window.requestAnimationFrame(screenHandler.drawScreen);
      this._image = image;
    };

    image.src = url;
  }

  // Gets the size of the sprite's parent
  getParentSize() {
    let parentSizex = 0;
    let parentSizey = 0;

    if (this.parent instanceof HTMLCanvasElement) {
      parentSizex = this.parent.width;
      parentSizey = this.parent.height;
    } else {
      parentSizex = this.parent._size.x;
      parentSizey = this.parent._size.y;
    }

    return { x: parentSizex, y: parentSizey };
  }

  // Gets the position of the sprite's parent
  getParentPosition() {
    let parentPosx = 0;
    let parentPosy = 0;

    if (!(this.parent instanceof HTMLCanvasElement)) {
      parentPosx = this.parent.getPosition().x;
      parentPosy = this.parent.getPosition().y;
    }

    return { x: parentPosx, y: parentPosy };
  }

  getImage() {
    return this._image;
  }

  // updates the sprite's position based on the `positionScale` property
  updatePosition() {
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

  // update's the sprite's size based on the the `_sizeScale` property
  updateSize() {
    let parentSize = this.getParentSize();

    if (this._isFixedSize) return;

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
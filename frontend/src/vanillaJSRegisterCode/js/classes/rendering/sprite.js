import spriteRendererModule from '../../modules/sprite-renderer-module.js';
import screenHandler from '../../modules/screen-handler.js';

/*
Class for drawing a Sprite onto the screen
Sprites are images with extra properties and methods to make it easier to use on the canvas

See TODO: WIKI LINK GOES HERE for example usage
*/
export default class Sprite {
  constructor({
    imageSrc, // the image you want to load onto the sprite
    parent, // what the sprite is contained inside of. can either be a canvas or another image.
    sizeScale = { x: 0, y: 0 }, // the size of the image. set as a number (0-1) to change the whole scale, or you can specify y x and y scale individually: { x: 0, y: 0 },
    anchorPoint = { x: 0, y: 0 }, // position offset. the default (0,0) will position the sprite from it's upper left corner, (.5,.5) will position the sprite from the sprite's middle position
    positionScale = { x: 0, y: 0 }, // what position you want the sprite to be at relative to it's parent, (.5,.5) will position the image in the middle of it's parent's position
    zIndex = 10, // the 'layer' that you want the image to render on. higher the zIndex, the higher on the screen the sprite will render
    rotation, // degree that you want to rotate the image by
    flip, // "horizontal" flips the image horizontally
    hsl, // the sprite's hsl color value
    frameBuffer = 3, // How many frames you want to hold the current image on before moving onto the next image in the spritesheet
    numFrames = 1, // How many frames is in your animation
    animationFolder, // (WIP) location of the sprite images for bigger animated sprites
    isFixedSize = false, // Setting to true allows for positioning based off set pixels instead of percents
    canvas, // canvas the sprite should be rendered on
    isLooped = false // whether the sprite's animation should repeat
  }) {
    // public properties
    this.canvas = canvas;
    this.parent = parent;
    this.id = null;

    // private properties
    this._position = { x: 0, y: 0 };
    this._positionScale = positionScale;
    this._rotation = rotation;
    this._currentFrame = 0;
    this._elapsedFrames = 0;
    this._isFolderAnimation = false;
    this._isPlaying = false;
    this._isLooped = isLooped;
    this._animationEndedCB = null;
    this._animationFolder = animationFolder;
    this._frameBuffer = frameBuffer;
    this._numFrames = numFrames;
    this._size = { x: 0, y: 0 };
    this._hsl = hsl;
    this._sizeScale = sizeScale;
    this._anchorPoint = anchorPoint;
    this._flip = flip;
    this._zIndex = zIndex;
    this._isFixedSize = isFixedSize;
    this._imageSrc = imageSrc;
    this._image = null;

    if (!animationFolder) this.isAnimation = true;
    spriteRendererModule.getSpriteRenderer().addSpriteToScreen(this);
    this.loadImages();
  }

  // -------------------------------------------------------------------------
  //  public methods (temporarily keeping this comment here until it's converted to ts)
  // -------------------------------------------------------------------------

  // draws the sprite on the canvas
  // and updates it's animation, size, and position
  update() {
    if (!this.isAnimation && !this._image == null)
      throw Error("Tried to load sprite without image");

    this.updateSize();
    this.updatePosition();
    this.draw();
    if (this._isPlaying) this.updateFrames();
  }

  // calls dragCb, dragStartCb, and dragEndCb methods when the mouse is dragging the image, starts dragging, or ends dragging respectfully
  onDrag({ dragCb, dragStartCb, dragEndCb }) {
    this._isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let previousTime = 0;
    let velocityX = 0;
    let velocityY = 0;

    this.dragStarted(dragStartCb);
    this.dragEnded(dragEndCb);
    this._mouseMoveHandler = event => {
      if (this._isDragging && dragCb) {
        const currentTime = Date.now();
        const deltaTime = currentTime - previousTime;

        const currentX = event.clientX;
        const currentY = event.clientY;

        velocityX = (currentX - previousX) / deltaTime;
        velocityY = (currentY - previousY) / deltaTime;

        previousX = currentX;
        previousY = currentY;
        previousTime = currentTime;

        dragCb(event, velocityX, velocityY);
      }
    };

    document.addEventListener('mousemove', this._mouseMoveHandler);
  }

  onClick(callback) {
    this._clickHandler = event => {
      if (this.isMouseOnImage(event) && callback) callback();
    };

    this.canvas.addEventListener('click', this._clickHandler);
  }

  getRotation() {
    return this._rotation;
  }

  setRotation(newRotation) {
    this._rotation = newRotation;
    window.requestAnimationFrame(screenHandler.drawScreen);
  }

  getPositionScale() {
    return this._positionScale;
  }

  setPositionScale({ x, y }) {
    this._positionScale.x = x || this._positionScale.x;
    this._positionScale.y = y || this._positionScale.y;

    window.requestAnimationFrame(screenHandler.drawScreen);
  }

  getHSL() {
    return this._hsl;
  }

  setHSL({ h, s, l }) {
    this._hsl = {
      h: h || this._hsl.h,
      s: s || this._hsl.s,
      l: l || this._hsl.l
    };

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

  getImageSrc() {
    return this._imageSrc;
  }

  getZIndex() {
    return this._zIndex;
  }
  // -------------------------------------------------------------------------
  //  private methods (temporarily keeping this comment here until it's converted to ts)
  // -------------------------------------------------------------------------

  loadImages() {
    if (this._imageSrc && this._animationFolder)
      throw Error('Should only have image or animation folder, not both');
    else if (!this._imageSrc && !this._animationFolder)
      throw Error('must have either an animation folder or an image source');

    if (this._imageSrc) {
      this._image = this.loadImage(this._imageSrc);
    }

    if (this._animationFolder) {
      this.preloadFrames(this._animationFolder);
    }
  }

  loadImage(url) {
    const image = new Image();

    image.onload = () => {
      this._image = image;
      window.requestAnimationFrame(screenHandler.drawScreen);
    };

    image.src = url;
  }

  // If an animation folder is specified, creates images and stores them in this._animationFrames
  // Assumes there are `this.numFrames` images inside of the animation folder named 1.png, 2.png, ... (numberOfFrames).png
  async preloadFrames(animationFolder) {
    animationFolder = animationFolder.endsWith('/')
      ? animationFolder
      : animationFolder + '/';

    this._animationFrames = [];

    for (let i = 0; i < this._numFrames; i++) {
      const url = animationFolder + (i + 1) + '.png';
      const image = await this.loadImage(url);

      this._animationFrames.push(image);
    }

    this._image = this._animationFrames[0];
    this._isFolderAnimation = true;
  }

  // draws the sprite onto the screen
  draw() {
    let offset = null;

    const ctx = this.canvas.getContext('2d');
    const centerx = this._position.x + this._size.x / 2;
    const centery = this._position.y + this._size.y / 2;

    if (this._flip === 'horizontal') offset = this.flipHorizontally();
    else if (this._rotation) offset = this.rotate();

    if (this._hsl != null) this.drawHSL();
    else {
      if (offset)
        ctx.drawImage(
          this._image,
          offset.x,
          offset.y,
          this._size.x,
          this._size.y
        );
      else this.drawImage();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  play() {
    this._isPlaying = true;
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
    let parentPosition = this.getParentPosition();
    let parentSize = this.getParentSize();

    let positionScalex = this._positionScale.x * parentSize.x;
    let positionScaley = this._positionScale.y * parentSize.y;

    let anchorx = this._anchorPoint.x * this._size.x;
    let anchory = this._anchorPoint.y * this._size.y;

    this._position.x = parentPosition.x + positionScalex - anchorx;
    this._position.y = parentPosition.y + positionScaley - anchory;
  }

  // update's the sprite's size based on the the `_sizeScale` property
  updateSize() {
    let parentSize = this.getParentSize();

    if (this._isFixedSize) return;

    if (typeof this._sizeScale === 'number') {
      let imgAspectRatio = this._image.width / this._image.height;
      let desiredHeight = parentSize.y * this._sizeScale;
      let desiredWidth = desiredHeight * imgAspectRatio;

      this._size.x = desiredWidth;
      this._size.y = desiredHeight;
    } else {
      this._size.x = this._sizeScale.x * parentSize.x;
      this._size.y = this._sizeScale.y * parentSize.y;
    }
  }

  // changes the image's color
  updateHSL(innerCtx) {
    innerCtx.globalCompositeOperation = 'source-over';
    innerCtx.drawImage(this._image, 0, 0, this._size.x, this._size.y);

    // add in hue, sat, and lightness
    innerCtx.globalCompositeOperation = 'multiply';
    innerCtx.fillStyle =
      'hsl(' +
      this._hsl.h +
      ',' +
      (this._hsl.s || 100) +
      '%, ' +
      (this._hsl.l || 50) +
      '%,' +
      (this._hsl.a || 1) +
      ')';

    innerCtx.fillRect(0, 0, this._size.x, this._size.y);

    // mask image onto canvas
    innerCtx.globalCompositeOperation = 'destination-in';
    innerCtx.drawImage(this._image, 0, 0, this._size.x, this._size.y);
  }

  // rotates the image based on it's rotation property
  rotate() {
    const ctx = this.canvas.getContext('2d');
    const centerx = this._position.x + this._size.x / 2;
    const centery = this._position.y + this._size.y / 2;

    ctx.translate(centerx, centery);
    ctx.rotate((this._rotation * Math.PI) / 180);

    return { x: -this._size.x / 2, y: -this._size.y / 2 };
  }

  // flips the image horizontally if the flip: "horizontal" property is set
  flipHorizontally() {
    const ctx = this.canvas.getContext('2d');
    const centerx = this._position.x + this._size.x / 2;
    const centery = this._position.y + this._size.y / 2;

    ctx.translate(centerx, centery);
    ctx.scale(-1, 1);

    return { x: -this._size.x / 2, y: -this._size.y / 2 };
  }

  // draws the colored image onto the canvas
  // if the size and position haven't changed since the last frame, uses a cached version of the image
  // otherwise, draws a new colored image
  drawHSL() {
    let imgCanvas = this._imgCanvas;

    if (!imgCanvas)
      imgCanvas = this._imgCanvas = document.createElement('canvas');

    const outerCtx = this.canvas.getContext('2d');
    const innerCtx = imgCanvas.getContext('2d');

    const hasSpriteSizeChanged =
      this._prevSize == null ||
      this._prevSize.x != this._size.x ||
      this._prevSize.y != this._size.y;

    const hasHslChanged =
      this._prevHSL == null ||
      this._hsl.h != this._prevHSL.h ||
      this._hsl.s != this._prevHSL.s ||
      this._hsl.l != this._prevHSL.l;

    if (hasSpriteSizeChanged) {
      if (this._size.x === 0) return;

      imgCanvas.width = Math.max(this._size.x, 1);
      imgCanvas.height = Math.max(this._size.y, 1);
    }

    if (hasHslChanged || hasSpriteSizeChanged) this.updateHSL(innerCtx);

    this._prevHSL = { h: this._hsl.h, s: this._hsl.s, l: this._hsl.l };
    this._prevSize = { x: this._size.x, y: this._size.y };

    outerCtx.drawImage(imgCanvas, this._position.x, this._position.y);
    innerCtx.globalCompositeOperation = 'source-over';
  }

  // if the sprite is animated, and the animation hasn't ended, moves forward to the next animation frame
  updateFrames() {
    const isOnLastFrame = this._currentFrame == this._numFrames - 1;

    this._elapsedFrames++;

    if (isOnLastFrame && !this._isLooped) {
      if (this._animationEndedCB) this._animationEndedCB();
      this._currentFrame = -1;
    }

    if (this._elapsedFrames % this._frameBuffer === 0) {
      const isRunningAnimation = this._currentFrame < this._numFrames - 1;

      if (isRunningAnimation || this._isLooped) {
        if (this._isFolderAnimation)
          this._image = this._animationFrames[this._currentFrame];

        this._currentFrame = isRunningAnimation ? this._currentFrame + 1 : 0;
      }
    }
  }

  // Calls `callback` when the animation is ended
  // Only runs when the animation is not looped
  onAnimationEnded(callback) {
    this._animationEndedCB = callback;
  }

  drawImage() {
    const ctx = this.canvas.getContext('2d');
    const croppedX =
      (!this._animationFrames &&
        this._currentFrame * (this._image.width / this._numFrames)) ||
      0;
    const croppedWidth =
      (!this._animationFrames && this._image.width / this._numFrames) ||
      this._image.width;

    ctx.drawImage(
      this._image,
      croppedX,
      0,
      croppedWidth,
      this._image.height,
      this._position.x,
      this._position.y,
      this._size.x,
      this._size.y
    );
  }

  isMouseOnImage(event) {
    let isInBounds = null;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    isInBounds =
      x >= this._position.x &&
      x < this._position.x + this._size.x &&
      y >= this._position.y &&
      y < this._position.y + this._size.y;

    return isInBounds;
  }

  // check if the mouse started dragging
  dragStarted(dragStartCb) {
    this._mouseDownHandler = event => {
      if (this.isMouseOnImage(event)) {
        this._isDragging = true;
        if (dragStartCb) dragStartCb(event, this);
      }
    };

    this.canvas.addEventListener('mousedown', this._mouseDownHandler);
  }

  // check if the mouse has stopped dragging the image
  dragEnded(dragEndCb) {
    this._mouseUpHandler = event => {
      this._isDragging = false;

      if (dragEndCb) dragEndCb(event);
    };

    document.addEventListener('mouseup', this._mouseUpHandler);
  }

  // Destroys the sprite class, cleaning up for garbage collection
  // TODO: Needs to be tested, clear out all the hard references etc
  destroy() {
    this.canvas.removeEventListener('click', this._clickHandler);
    this.canvas.removeEventListener('mousedown', this._mouseDownHandler);
    document.removeEventListener('mouseup', this._mouseUpHandler);
    this.canvas.removeEventListener('mousemove', this._mouseMoveHandler);
  }
}

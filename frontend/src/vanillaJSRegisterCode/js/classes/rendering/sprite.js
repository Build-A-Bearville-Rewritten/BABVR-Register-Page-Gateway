import spriteRendererModule from '../../modules/sprite-renderer-module.js';

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
    this.position = { x: 0, y: 0 };
    this.size = { x: 0, y: 0 };
    this.sizeScale = sizeScale;
    this.positionScale = positionScale;
    this.anchorPoint = anchorPoint;
    this.flip = flip;
    this.rotation = rotation;
    this.hsl = hsl;
    this.frameBuffer = frameBuffer;
    this.numFrames = numFrames;
    this.isFixedSize = isFixedSize;
    this.zIndex = zIndex;
    this.imageSrc = imageSrc;
    this.id = null;

    // private properties
    this._currentFrame = 0;
    this._elapsedFrames = 0;
    this._isFolderAnimation = false;
    this._isPlaying = false;
    this._isLooped = isLooped;
    this._animationEndedCB = null;
    this._animationFolder = animationFolder;
  }

  // -------------------------------------------------------------------------
  //  public methods (temporarily keeping this comment here until it's converted to ts)
  // -------------------------------------------------------------------------

  // draws the sprite on the canvas
  // and updates it's animation, size, and position
  update() {
    if (this._currentFrame == -1) return;

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

  // -------------------------------------------------------------------------
  //  private methods (temporarily keeping this comment here until it's converted to ts)
  // -------------------------------------------------------------------------

  async loadImages() {
    if (this.imageSrc && this._animationFolder) {
      throw Error(
        'Should only have either a single image (spritesheet or normal image), or animation folder, not both'
      );
    }
    if (this.imageSrc) {
      this.image = await this.loadImage(this.imageSrc);
    }

    if (this._animationFolder) {
      await this.preloadFrames(this._animationFolder);
      this.image = this._animationFrames[0];
      this._isFolderAnimation = true;
    }
  }

  async loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
      image.src = url;
    });
  }

  // If an animation folder is specified, creates images and stores them in this._animationFrames
  // Assumes there are `this.numFrames` images inside of the animation folder named 1.png, 2.png, ... (numberOfFrames).png
  async preloadFrames(animationFolder) {
    animationFolder = animationFolder.endsWith('/')
      ? animationFolder
      : animationFolder + '/';

    this._animationFrames = [];

    for (let i = 0; i < this.numFrames; i++) {
      const url = animationFolder + (i + 1) + '.png';
      const image = await this.loadImage(url);
      this._animationFrames.push(image);
    }
  }

  // draws the sprite onto the screen
  draw() {
    let offset = null;

    const ctx = this.canvas.getContext('2d');
    const centerx = this.position.x + this.size.x / 2;
    const centery = this.position.y + this.size.y / 2;

    if (this.flip === 'horizontal') offset = this.flipHorizontally();
    else if (this.rotation) offset = this.rotate();

    if (this.hsl != null) this.drawHSL();
    else {
      if (offset)
        ctx.drawImage(this.image, offset.x, offset.y, this.size.x, this.size.y);
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
      parentSizex = this.parent.size.x;
      parentSizey = this.parent.size.y;
    }

    return { x: parentSizex, y: parentSizey };
  }

  // Gets the position of the sprite's parent
  getParentPosition() {
    let parentPosx = 0;
    let parentPosy = 0;

    if (!(this.parent instanceof HTMLCanvasElement)) {
      parentPosx = this.parent.position.x;
      parentPosy = this.parent.position.y;
    }

    return { x: parentPosx, y: parentPosy };
  }

  // updates the sprite's position based on the `positionScale` property
  updatePosition() {
    let parentPosition = this.getParentPosition();
    let parentSize = this.getParentSize();

    let positionScalex = this.positionScale.x * parentSize.x;
    let positionScaley = this.positionScale.y * parentSize.y;

    let anchorx = this.anchorPoint.x * this.size.x;
    let anchory = this.anchorPoint.y * this.size.y;

    this.position.x = parentPosition.x + positionScalex - anchorx;
    this.position.y = parentPosition.y + positionScaley - anchory;
  }

  // update's the sprite's size based on the the `sizeScale` property
  updateSize() {
    let parentSize = this.getParentSize();

    if (this.isFixedSize) return;

    if (typeof this.sizeScale === 'number') {
      let imgAspectRatio = this.image.width / this.image.height;
      let desiredHeight = parentSize.y * this.sizeScale;
      let desiredWidth = desiredHeight * imgAspectRatio;

      this.size.x = desiredWidth;
      this.size.y = desiredHeight;
    } else {
      this.size.x = this.sizeScale.x * parentSize.x;
      this.size.y = this.sizeScale.y * parentSize.y;
    }
  }

  // changes the image's color
  updateHSL(innerCtx) {
    innerCtx.globalCompositeOperation = 'source-over';
    innerCtx.drawImage(this.image, 0, 0, this.size.x, this.size.y);

    // add in hue, sat, and lightness
    innerCtx.globalCompositeOperation = 'multiply';
    innerCtx.fillStyle =
      'hsl(' +
      this.hsl.h +
      ',' +
      (this.hsl.s || 100) +
      '%, ' +
      (this.hsl.l || 50) +
      '%,' +
      (this.hsl.a || 1) +
      ')';

    innerCtx.fillRect(0, 0, this.size.x, this.size.y);

    // mask image onto canvas
    innerCtx.globalCompositeOperation = 'destination-in';
    innerCtx.drawImage(this.image, 0, 0, this.size.x, this.size.y);
  }

  // rotates the image based on it's rotation property
  rotate() {
    const ctx = this.canvas.getContext('2d');
    const centerx = this.position.x + this.size.x / 2;
    const centery = this.position.y + this.size.y / 2;

    ctx.translate(centerx, centery);
    ctx.rotate((this.rotation * Math.PI) / 180);

    return { x: -this.size.x / 2, y: -this.size.y / 2 };
  }

  // flips the image horizontally if the flip: "horizontal" property is set
  flipHorizontally() {
    const ctx = this.canvas.getContext('2d');
    const centerx = this.position.x + this.size.x / 2;
    const centery = this.position.y + this.size.y / 2;

    ctx.translate(centerx, centery);
    ctx.scale(-1, 1);

    return { x: -this.size.x / 2, y: -this.size.y / 2 };
  }

  // draws the colored image onto the canvas
  // if the size and position haven't changed since the last frame, uses a cached version of the image
  // otherwise, draws a new colored image
  drawHSL() {
    let imgCanvas = this.imgCanvas;

    if (!imgCanvas)
      imgCanvas = this.imgCanvas = document.createElement('canvas');

    const outerCtx = this.canvas.getContext('2d');
    const innerCtx = imgCanvas.getContext('2d');

    const hasSpriteSizeChanged =
      this.prevSize == null ||
      this.prevSize.x != this.size.x ||
      this.prevSize.y != this.size.y;

    const hasHslChanged =
      this.prevHSL == null ||
      this.hsl.h != this.prevHSL.h ||
      this.hsl.s != this.prevHSL.s ||
      this.hsl.l != this.prevHSL.l;

    if (hasSpriteSizeChanged) {
      if (this.size.x === 0) return;

      imgCanvas.width = this.size.x;
      imgCanvas.height = this.size.y;
    }

    if (hasHslChanged || hasSpriteSizeChanged) this.updateHSL(innerCtx);

    this.prevHSL = { h: this.hsl.h, s: this.hsl.s, l: this.hsl.l };
    this.prevSize = { x: this.size.x, y: this.size.y };

    outerCtx.drawImage(imgCanvas, this.position.x, this.position.y);
    innerCtx.globalCompositeOperation = 'source-over';
  }

  // if the sprite is animated, and the animation hasn't ended, moves forward to the next animation frame
  updateFrames() {
    const isOnLastFrame = this._currentFrame == this.numFrames - 1;

    this._elapsedFrames++;

    if (isOnLastFrame && !this._isLooped) {
      if (this._animationEndedCB) this._animationEndedCB();
      this._currentFrame = -1;
    }

    if (this._elapsedFrames % this.frameBuffer === 0) {
      const isRunningAnimation = this._currentFrame < this.numFrames - 1;

      if (isRunningAnimation || this._isLooped) {
        if (this._isFolderAnimation)
          this.image = this._animationFrames[this._currentFrame];

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
        this._currentFrame * (this.image.width / this.numFrames)) ||
      0;
    const croppedWidth =
      (!this._animationFrames && this.image.width / this.numFrames) ||
      this.image.width;

    ctx.drawImage(
      this.image,
      croppedX,
      0,
      croppedWidth,
      this.image.height,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  }

  isMouseOnImage(event) {
    let isInBounds = null;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    isInBounds =
      x >= this.position.x &&
      x < this.position.x + this.size.x &&
      y >= this.position.y &&
      y < this.position.y + this.size.y;

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
    console.log('destroying sprite');
    this.canvas.removeEventListener('click', this._clickHandler);
    this.canvas.removeEventListener('mousedown', this._mouseDownHandler);
    document.removeEventListener('mouseup', this._mouseUpHandler);
    this.canvas.removeEventListener('mousemove', this._mouseMoveHandler);
  }
}

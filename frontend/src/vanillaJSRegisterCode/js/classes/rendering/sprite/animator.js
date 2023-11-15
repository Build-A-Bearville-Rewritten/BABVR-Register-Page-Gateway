export default class Animator {
  constructor({
    animationFolder, // location of the sprite images for bigger animated sprites
    numFrames = 1, // How many frames is in your animation
    frameBuffer = 3, // How many frames you want to hold the current image on before moving onto the next image in the spritesheet
    isLooped = false // whether the sprite's animation should repeat
  }) {
    this._animationEndedCB = null;
    this._animationFolder = animationFolder;
    this._frameBuffer = frameBuffer;
    this._numFrames = numFrames;
    this._currentFrame = 0;
    this._elapsedFrames = 0;
    this._isFolderAnimation = false;
    this._isLooped = isLooped;
    this._isPlaying = false;

    this.loadImages();
  }

  loadImages() {
    if (this._imagePath && this._animationFolder)
      throw Error('Should only have image or animation folder, not both');
    else if (!this._imagePath && !this._animationFolder)
      throw Error('must have either an animation folder or an image source');

    if (this._imagePath) {
      this._image = this.loadImage(this._imagePath);
    }

    if (this._animationFolder) {
      this.preloadFrames(this._animationFolder);
    }
  }

  // If an animation folder is specified, creates images and stores them in this._animationFrames
  // Assumes there are `this.numFrames` images inside of the animation folder named 1.png, 2.png, ... (numberOfFrames).png
  async preloadFrames(animationFolder) {
    this._isFolderAnimation = true;
    this._animationFrames = [];

    animationFolder = animationFolder.endsWith('/')
      ? animationFolder
      : animationFolder + '/';

    for (let i = 0; i < this._numFrames; i++) {
      const url = animationFolder + (i + 1) + '.png';
      this.loadImage(url);
    }
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

  play() {
    this._isPlaying = true;
  }

  destroy() {}
}

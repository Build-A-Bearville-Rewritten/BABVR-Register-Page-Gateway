import type { AnimationConfig } from '../../../types/common.js';

/**
 * Callback function type for when animation ends
 */
type AnimationEndedCallback = () => void;

/**
 * Class responsible for managing sprite animation state, frame buffers, and timing
 */
export default class Animator {
  // Image properties (may be set by parent class)
  protected _image: HTMLImageElement | null;
  protected _imagePath: string | undefined;

  private _animationEndedCB: AnimationEndedCallback | null;
  private _animationFrames: HTMLImageElement[];
  private _currentFrame: number;
  private _elapsedFrames: number;
  private _isPlaying: boolean;
  private _isFolderAnimation: boolean;

  private readonly _isLooped: boolean;
  private readonly _frameBuffer: number;
  private readonly _numFrames: number;
  private readonly _animationFolder: string | undefined;

  constructor({
    animationFolder,
    numFrames = 1,
    frameBuffer = 3,
    isLooped = false
  }: AnimationConfig) {
    // Animation state management
    this._currentFrame = 0;
    this._elapsedFrames = 0;
    this._isPlaying = false;
    this._isLooped = isLooped;
    this._isFolderAnimation = false;

    // Frame buffer and timing
    this._frameBuffer = frameBuffer;
    this._numFrames = numFrames;

    // Animation data
    this._animationFolder = animationFolder;
    this._animationFrames = [];
    this._animationEndedCB = null;

    // Image properties (may be set by parent class)
    this._imagePath = undefined;
    this._image = null;

    this.loadImages();
  }

  public get image(): HTMLImageElement | null {
    return this._image;
  }

  /**
   * Loads images based on configuration
   * @throws Error if both imagePath and animationFolder are provided, or neither is provided
   */
  protected loadImages(): void {
    if (this._imagePath && this._animationFolder) {
      throw new Error('Should only have image or animation folder, not both');
    } else if (!this._imagePath && !this._animationFolder) {
      throw new Error(
        'must have either an animation folder or an image source'
      );
    }

    if (this._imagePath) {
      this._image = this.loadImage(this._imagePath);
    }

    if (this._animationFolder) {
      this.preloadFrames(this._animationFolder).catch(console.error);
    }
  }

  /**
   * Loads a single image from a URL
   * @param url - The URL of the image to load
   * @returns The loaded HTMLImageElement
   */
  protected loadImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;
    return image;
  }

  /**
   * If an animation folder is specified, creates images and stores them in this._animationFrames
   * Assumes there are `this.numFrames` images inside of the animation folder named 1.png, 2.png, ... (numberOfFrames).png
   * @param animationFolder - The folder path containing animation frames
   */
  async preloadFrames(animationFolder: string): Promise<void> {
    this._isFolderAnimation = true;
    this._animationFrames = [];

    const normalizedFolder = animationFolder.endsWith('/')
      ? animationFolder
      : animationFolder + '/';

    for (let i = 0; i < this._numFrames; i++) {
      const url = normalizedFolder + (i + 1) + '.png';
      const image = this.loadImage(url);
      this._animationFrames.push(image);
    }
  }

  /**
   * If the sprite is animated, and the animation hasn't ended, moves forward to the next animation frame
   * Updates frame timing based on frame buffer
   */
  updateFrames(): void {
    if (!this._isPlaying) {
      return;
    }

    const isOnLastFrame = this._currentFrame === this._numFrames - 1;

    this._elapsedFrames++;

    if (isOnLastFrame && !this._isLooped) {
      if (this._animationEndedCB) {
        this._animationEndedCB();
      }
      this._isPlaying = false;
      return;
    }

    // Update frame when frame buffer threshold is reached
    if (this._elapsedFrames % this._frameBuffer === 0) {
      const isRunningAnimation = this._currentFrame < this._numFrames - 1;

      if (isRunningAnimation || this._isLooped) {
        if (this._isFolderAnimation && this._animationFrames.length > 0) {
          this._image = this._animationFrames[this._currentFrame];
        }

        this._currentFrame = isRunningAnimation ? this._currentFrame + 1 : 0;
      }
    }
  }

  /**
   * Calls `callback` when the animation is ended
   * Only runs when the animation is not looped
   * @param callback - The callback function to call when animation ends
   */
  onAnimationEnded(callback: AnimationEndedCallback): void {
    this._animationEndedCB = callback;
  }

  /**
   * Starts playing the animation
   */
  play(): void {
    this._isPlaying = true;
  }

  /**
   * Gets the current playing state
   * @returns True if animation is playing, false otherwise
   */
  getIsPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Gets the current frame index
   * @returns The current frame index (0-based)
   */
  getCurrentFrame(): number {
    return this._currentFrame;
  }

  /**
   * Gets the elapsed frames count
   * @returns The number of elapsed frames
   */
  getElapsedFrames(): number {
    return this._elapsedFrames;
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    this._animationFrames = [];
    this._animationEndedCB = null;
    this._image = null;
  }
}

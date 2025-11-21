import AbstractSprite from './abstract-sprite.js';
import Animator from './animator.js';
import type { SpriteConstructorOptions, AnimationConfig } from '../../../types/common.js';

/**
 * Callback function type for when animation ends
 */
export type AnimationEndedCallback = () => void;

/**
 * Combined options for animated sprite constructor
 */
export interface AnimatedSpriteOptions extends SpriteConstructorOptions, AnimationConfig {}

/**
 * Animated sprite class that extends AbstractSprite and uses Animator for animation management
 */
export default class AnimatedSprite extends AbstractSprite {
  private _animator: Animator;
  public readonly isAnimation: boolean = true;

  constructor(options: AnimatedSpriteOptions) {
    // Extract animation config
    const {
      animationFolder,
      numFrames,
      frameBuffer,
      isLooped,
      ...spriteOptions
    } = options;

    // Call parent constructor with sprite options
    super(spriteOptions);

    // Create animator instance
    this._animator = new Animator({
      animationFolder,
      numFrames,
      frameBuffer,
      isLooped
    });
  }

  /**
   * Override getImage to return the animator's current image
   * @returns The current animation frame image, or null if not loaded
   */
  getImage(): HTMLImageElement | null {
    // Access the animator's protected _image property
    // This will be the current frame when using folder animations
    const animatorImage = (this._animator as any)._image;
    return animatorImage || super.getImage();
  }

  /**
   * Override update to include animation frame updates
   */
  update(): void {
    // Update animation frames
    this._animator.updateFrames();
    
    // Call parent update for size and position
    super.update();
  }

  /**
   * Starts playing the animation
   */
  play(): void {
    this._animator.play();
  }

  /**
   * Gets whether the animation is currently playing
   * @returns True if animation is playing, false otherwise
   */
  getIsPlaying(): boolean {
    return this._animator.getIsPlaying();
  }

  /**
   * Gets the current frame index
   * @returns The current frame index (0-based)
   */
  getCurrentFrame(): number {
    return this._animator.getCurrentFrame();
  }

  /**
   * Sets a callback to be called when the animation ends
   * Only runs when the animation is not looped
   * @param callback - The callback function to call when animation ends
   */
  onAnimationEnded(callback: AnimationEndedCallback): void {
    this._animator.onAnimationEnded(callback);
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    this._animator.destroy();
  }
}


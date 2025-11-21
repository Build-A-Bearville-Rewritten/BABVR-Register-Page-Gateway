import AbstractSprite from './abstract-sprite.js';
import type { SpriteConstructorOptions } from '../../../types/common.js';

/**
 * Static sprite class that extends AbstractSprite
 * Used for sprites that don't have animation
 */
export default class StaticSprite extends AbstractSprite {
  constructor(options: SpriteConstructorOptions) {
    super(options);
  }

  /**
   * Cleanup method
   */
  destroy(): void {}
}


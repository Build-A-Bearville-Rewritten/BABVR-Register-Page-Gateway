import type { SpriteConstructorOptions } from '../../../types/common.js';

import AbstractSprite from './abstract-sprite.js';

export default class StaticSprite extends AbstractSprite {
  constructor(options: SpriteConstructorOptions) {
    super(options);
  }

  destroy(): void {}
}

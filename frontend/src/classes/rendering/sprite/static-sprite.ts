import type { SpriteConstructorOptions } from '../../../types/common.ts';

import AbstractSprite from './abstract-sprite.ts';

export default class StaticSprite extends AbstractSprite {
  constructor(options: SpriteConstructorOptions) {
    super(options);
  }

  destroy(): void {
    super.destroy();
  }
}

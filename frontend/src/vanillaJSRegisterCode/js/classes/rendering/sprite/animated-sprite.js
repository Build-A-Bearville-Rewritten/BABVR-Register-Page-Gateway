import AbstractSprite from './abstract-sprite.js';

export default class StaticSprite extends AbstractSprite {
  constructor({
    animationFolderPath,
    spriteSheetPath,
    parent,
    sizeScale,
    anchorPoint,
    positionScale,
    zIndex,
    rotation,
    flip,
    hsl,
    isFixedSize,
    canvas
  }) {
    super({
      parent,
      sizeScale,
      anchorPoint,
      positionScale,
      zIndex,
      rotation,
      flip,
      hsl,
      isFixedSize,
      canvas
    });

    this._animationFolderPath = animationFolderPath;
    this._spriteSheetPath = spriteSheetPath;
  }
}

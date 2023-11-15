import AbstractSprite from './abstract-sprite.js';

export default class StaticSprite extends AbstractSprite {
  constructor({
    imagePath,
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
      imagePath,
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
  }

  destroy() {}
}

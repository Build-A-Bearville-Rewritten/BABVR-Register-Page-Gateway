// Creates the character creator creator frame

import StaticSprite from '../rendering/sprite/static-sprite.ts';

export default class CharacterCreator {
  constructor(canvas) {
    this.canvas = canvas;
    this.createSprites();
  }

  // Draw arrow prites at heightScale, and leaves spaceBetweenScale space between the arrows
  createArrows(heightScale, spaceBetweenScale) {
    const leftArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/color-wheel/sprites/upDownArrowColored.png',
      parent: this.registerScreen,
      sizeScale: 0.04,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.6, y: heightScale }
    });

    const rightArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: leftArrow.getImagePath(),
      parent: this.registerScreen,
      sizeScale: leftArrow.sizeScale,
      anchorPoint: leftArrow.anchorPoint,
      positionScale: {
        x: leftArrow.getPositionScale().x + spaceBetweenScale,
        y: heightScale
      },
      flip: 'horizontal'
    });

    return { left: leftArrow, right: rightArrow };
  }

  createSprites() {
    this.registerScreen = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/registerStep1.png',
      parent: this.canvas,
      sizeScale: 0.78,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
    });
    this.genderButton = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/genderTemp.png',
      parent: this.registerScreen,
      sizeScale: 0.035,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.734, y: 0.89 }
    });

    this.eyeColorSquare = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/colorSquare.png',
      parent: this.registerScreen,
      sizeScale: 0.05,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.645, y: 0.62 }
    });

    this.skinColorSquare = new StaticSprite({
      canvas: this.canvas,
      imagePath: this.eyeColorSquare.getImagePath(),
      parent: this.registerScreen,
      sizeScale: this.eyeColorSquare.getSizeScale(),
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.645, y: 0.77 }
    });

    this.characterContainer = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Character/container.png',
      parent: this.registerScreen,
      sizeScale: 0.65,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.83, y: 0.475 }
    });

    this.hairArrows = this.createArrows(0.275, 0.057);
    this.headArrows = this.createArrows(0.418, 0.057);
    this.eyeArrows = this.createArrows(0.62, 0.095);
    this.skinArrows = this.createArrows(0.77, 0.095);
  }

  showScreen() {
    this.createArrows();
    this.createSprites();
  }
}

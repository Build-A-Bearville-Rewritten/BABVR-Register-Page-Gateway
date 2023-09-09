import Sprite from "./sprite.js";

// Creates the character creator creator frame
export default class CharacterCreator {
  constructor(canvas) {
    this.canvas = canvas;
    this.createSprites();
  }

  // Draw arrow sprites at heightScale, and leaves spaceBetweenScale space between the arrows
  createArrows(heightScale, spaceBetweenScale) {
    let leftArrow = new Sprite({
      canvas: this.canvas,
      imageSrc: "assets/Register/color-wheel/sprites/upDownArrowColored.png",
      parent: this.registerScreen,
      sizeScale: 0.04,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.6, y: heightScale },
    });

    let rightArrow = new Sprite({
      canvas: this.canvas,
      imageSrc: leftArrow.imageSrc,
      parent: this.registerScreen,
      sizeScale: leftArrow.sizeScale,
      anchorPoint: leftArrow.anchorPoint,
      positionScale: {
        x: leftArrow.positionScale.x + spaceBetweenScale,
        y: heightScale,
      },
      flip: "horizontal",
    });

    return { left: leftArrow, right: rightArrow };
  }

  createSprites() {
    (this.registerScreen = new Sprite({
      canvas: this.canvas,
      imageSrc: "assets/Register/sprites/registerStep1.png",
      parent: this.canvas,
      sizeScale: 0.78,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 },
    })),
      (this.genderButton = new Sprite({
        canvas: this.canvas,
        imageSrc: "assets/Register/sprites/genderTemp.png",
        parent: this.registerScreen,
        sizeScale: 0.035,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.734, y: 0.89 },
      }));

    this.eyeColorSquare = new Sprite({
      canvas: this.canvas,
      imageSrc: "assets/Register/sprites/colorSquare.png",
      parent: this.registerScreen,
      sizeScale: 0.05,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.645, y: 0.62 },
    });

    this.skinColorSquare = new Sprite({
      canvas: this.canvas,
      imageSrc: this.eyeColorSquare.imageSrc,
      parent: this.registerScreen,
      sizeScale: this.eyeColorSquare.sizeScale,
      anchorPoint: this.eyeColorSquare.anchorPoint,
      positionScale: { x: 0.645, y: 0.77 },
    });

    this.characterContainer = new Sprite({
      canvas: this.canvas,
      imageSrc: "assets/Character/container.png",
      parent: this.registerScreen,
      sizeScale: 0.65,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.83, y: 0.475 },
    });

    this.hairArrows = this.createArrows(0.275, 0.057);
    this.headArrows = this.createArrows(0.418, 0.057);
    this.eyeArrows = this.createArrows(0.62, 0.095);
    this.skinArrows = this.createArrows(0.77, 0.095);
  }
}

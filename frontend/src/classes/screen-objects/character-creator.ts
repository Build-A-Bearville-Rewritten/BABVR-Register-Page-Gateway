// Character creator UI component - responsible for drawing the selection frame
// and related controls on the registration screen

import StaticSprite from '../rendering/sprite/static-sprite.ts';

/**
 * Convenience type describing the arrow sprites that appear in pairs
 */
type ArrowSprites = {
  left: StaticSprite;
  right: StaticSprite;
};

/**
 * CharacterCreator renders the UI container, color squares, and selection arrows
 * that surround the character preview on the registration screen.
 */
export default class CharacterCreator {
  public canvas: HTMLCanvasElement;

  public registerScreen!: StaticSprite;
  public genderButton!: StaticSprite;
  public eyeColorSquare!: StaticSprite;
  public skinColorSquare!: StaticSprite;
  public characterContainer!: StaticSprite;

  public hairArrows!: ArrowSprites;
  public headArrows!: ArrowSprites;
  public eyeArrows!: ArrowSprites;
  public skinArrows!: ArrowSprites;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.createSprites();
  }

  /**
   * Draw arrow sprites at a specific vertical scale and horizontal spacing.
   */
  private createArrows(
    heightScale: number,
    spaceBetweenScale: number
  ): ArrowSprites {
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
      sizeScale: leftArrow.getSizeScale(),
      anchorPoint: leftArrow.getAnchorPoint(),
      positionScale: {
        x: leftArrow.getPositionScale().x + spaceBetweenScale,
        y: heightScale
      },
      flip: 'horizontal'
    });

    return { left: leftArrow, right: rightArrow };
  }

  /**
   * Create all sprites that compose the character creator UI component.
   */
  private createSprites(): void {
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

  /**
   * Public entry point used by screens to redraw the component.
   */
  public showScreen(): void {
    this.createSprites();
  }
}

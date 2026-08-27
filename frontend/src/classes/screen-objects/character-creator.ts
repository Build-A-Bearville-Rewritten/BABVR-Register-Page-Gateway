// Character creator UI component - responsible for drawing the selection frame
// and related controls on the registration screen

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import GenderBar from './gender-bar.ts';

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
  public characterFrame!: StaticSprite;
  public genderBar!: GenderBar;
  public genderButton!: StaticSprite;
  public eyeColorSquare!: StaticSprite;
  public skinColorSquare!: StaticSprite;
  public characterContainer!: StaticSprite;

  public headContainer!: StaticSprite;
  public skinContainer!: StaticSprite;
  public hairIcon!: StaticSprite;
  public headIcon!: StaticSprite;
  public eyeIcon!: StaticSprite;
  public skinIcon!: StaticSprite;

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
    spaceBetweenScale: number,
    parent: StaticSprite
  ): ArrowSprites {
    const leftArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/color-wheel/sprites/upDownArrowColored.png',
      parent,
      sizeScale: 0.18,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.13, y: heightScale }
    });

    const rightArrow = new StaticSprite({
      canvas: this.canvas,
      imagePath: leftArrow.getImagePath(),
      parent: parent,
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

    //TODO: remove this component
    this.registerScreen = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/registerStep1.png',
      parent: this.canvas,
      sizeScale: 0.78,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
    });

    this.characterFrame = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/characterFrame.png',
      parent: this.canvas,
      sizeScale: 0.8,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.6, y: 0.5 }
    });

    this.headContainer = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/headSelectorsContainer.png',
      parent: this.characterFrame,
      sizeScale: 0.3,
      positionScale: { x: 0.13, y: 0.17 }
    });

    this.hairIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/hairIcon.png',
      parent: this.headContainer,
      sizeScale: 0.17,
      anchorPoint: { x: -1.5, y: 0 },
      positionScale: { x: 0, y: 0.05 }
    });

    this.headIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/headIcon.png',
      parent: this.headContainer,
      sizeScale: 0.17,
      anchorPoint: { x: -1.5, y: -3 },
      positionScale: { x: 0, y: 0.05 }
    });

    this.skinContainer = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/skinSelectorsContainer.png',
      parent: this.characterFrame,
      sizeScale: 0.3,
      positionScale: { x: 0.13, y: 0.52 }
    });

    this.eyeIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/eyeColorIcon.png',
      parent: this.skinContainer,
      sizeScale: 0.1,
      anchorPoint: { x: -2, y: 0 },
      positionScale: { x: 0, y: 0.07 }
    });

    this.skinIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/skinToneIcon.png',
      parent: this.skinContainer,
      sizeScale: 0.15,
      anchorPoint: { x: -4, y: -3.5 },
      positionScale: { x: 0, y: 0.03 }
    });

    this.genderBar = new GenderBar({
      canvas: this.canvas,
      parent: this.characterFrame
    });

    // this.genderButton = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: 'assets/Register/sprites/genderTemp.png',
    //   parent: this.registerScreen,
    //   sizeScale: 0.035,
    //   anchorPoint: { x: 0.5, y: 0.5 },
    //   positionScale: { x: 0.734, y: 0.89 }
    // });

    this.eyeColorSquare = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/colorSquare.png',
      parent: this.skinContainer,
      sizeScale: 0.18,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.385, y: 0.3 }
    });

    this.skinColorSquare = new StaticSprite({
      canvas: this.canvas,
      imagePath: this.eyeColorSquare.getImagePath(),
      parent: this.skinContainer,
      sizeScale: this.eyeColorSquare.getSizeScale(),
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.385, y: 0.83 }
    });

    this.characterContainer = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Character/container.png',
      parent: this.registerScreen,
      sizeScale: 0.65,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.83, y: 0.475 }
    });

    this.hairArrows = this.createArrows(0.35, 0.4, this.headContainer);
    this.headArrows = this.createArrows(0.85, 0.4, this.headContainer);
    this.eyeArrows = this.createArrows(0.3, 0.5, this.skinContainer);
    this.skinArrows = this.createArrows(0.83, 0.5, this.skinContainer);
  }

  /**
   * Public entry point used by screens to redraw the component.
   */
  public showScreen(): void {
    this.createSprites();
  }

  public destroy(): void {
    this.genderBar.destroy();
  }
}

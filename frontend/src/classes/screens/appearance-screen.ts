// Character creator UI component - responsible for drawing the selection frame
// and related controls on the registration screen

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import { AbstractScreen } from '../../types/rendering.ts';
import { MouseCallback } from '../rendering/sprite/clickable.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Arrow from '../rendering/sprite/widgets/arrow.ts';
import NextButton from '../rendering/sprite/widgets/next-button.ts';
import PrevButton from '../rendering/sprite/widgets/prev-button.ts';
import ColorWheel from '../screen-objects/color-wheel.ts';
import GenderBar from '../screen-objects/gender-bar.ts';
import ChloeIntroScreen from './chloe-intro-screen.ts';
import Character from '../screen-objects/character.ts';
import ClothingScreen from './clothing-screen.ts';

/**
 * Convenience type describing the arrow sprites that appear in pairs
 */
type ArrowSprites = {
  left: Arrow;
  right: Arrow;
};

/**
 * CharacterCreator renders the UI container, color squares, and selection arrows
 * that surround the character preview on the registration screen.
 */
export default class AppearanceScreen extends AbstractScreen {
  public canvas: HTMLCanvasElement;

  private _nextButton!: NextButton;
  private _backButton!: PrevButton;
  private colorWheel!: ColorWheel;

  public step1Sprite!: StaticSprite;
  public step2Sprite!: StaticSprite;
  public step3Sprite!: StaticSprite;
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
    super(canvas);
    this.canvas = canvas;
    this.createSprites();
  }

  /**
   * Draw arrow sprites at a specific vertical scale and horizontal spacing.
   */
  private createArrows(
    heightScale: number,
    spaceBetweenScale: number,
    parent: StaticSprite,
    onLeft: MouseCallback,
    onRight: MouseCallback
  ): ArrowSprites {
    const leftArrow = new Arrow({
      canvas: this.canvas,
      parent,
      sizeScale: 0.18,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.13, y: heightScale },
      isAnimated: true,
      onClick: onLeft
    });

    const rightArrow = new Arrow({
      canvas: this.canvas,
      parent: parent,
      sizeScale: 0.18,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.13 + spaceBetweenScale, y: heightScale },
      flip: 'horizontal',
      isAnimated: true,
      onClick: onRight
    });

    return { left: leftArrow, right: rightArrow };
  }

  /**
   * Create all sprites that compose the character creator UI component.
   */
  private createSprites(): void {

    new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsTop.png',
      parent: this.canvas,
      sizeScale: 0.144,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.29 }
    });

    new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsMiddle.png',
      parent: this.canvas,
      sizeScale: {x: 0.348, y: 0.3},
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.5 }
    });

    new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsTopBottom.png',
      parent: this.canvas,
      sizeScale: 0.144,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.63 }
    });

    new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsHeader.png',
      parent: this.canvas,
      sizeScale: { x: 0.21, y: 0.04 },
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.32 }
    });

    this.step1Sprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/step1Selected.png',
      parent: this.canvas,
      sizeScale: 0.06,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.095, y: 0.17 }
    });

    this.step2Sprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/step2Deselected.png',
      parent: this.canvas,
      sizeScale: 0.04,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.135, y: 0.17 }
    });

    this.step3Sprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/step3Deselected.png',
      parent: this.canvas,
      sizeScale: 0.04,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.175, y: 0.17 }
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
      parent: this.characterFrame,
      sizeScale: 0.65,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.68, y: 0.475 }
    });

    // TODO: update arrow onClicks
    this.hairArrows = this.createArrows(
      0.35,
      0.4,
      this.headContainer,
      () => {
        console.log('hair left');
      },
      () => {
        console.log('hair right');
      }
    );
    this.headArrows = this.createArrows(
      0.85,
      0.4,
      this.headContainer,
      () => {
        console.log('head left');
      },
      () => {
        console.log('head right');
      }
    );
    this.eyeArrows = this.createArrows(
      0.3,
      0.48,
      this.skinContainer,
      () => {
        console.log('eye left');
      },
      () => {
        console.log('eye right');
      }
    );
    this.skinArrows = this.createArrows(
      0.83,
      0.48,
      this.skinContainer,
      () => {
        console.log('skin left');
      },
      () => {
        console.log('skin right');
      }
    );

    new Character(this.canvas, this.characterContainer);
    this.colorWheel = new ColorWheel(this.canvas);

    this._nextButton = new NextButton({
      canvas: this.canvas,
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(ClothingScreen);
      }
    });

    this._backButton = new PrevButton({
      canvas: this.canvas,
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(ChloeIntroScreen);
      }
    })
  }

  public destroy(): void {
    super.destroy();
    this.step1Sprite.destroy();
    this.step2Sprite.destroy();
    this.step3Sprite.destroy();
    this.genderBar.destroy();
    this.hairArrows.left.destroy();
    this.hairArrows.right.destroy();
    this.headArrows.left.destroy();
    this.headArrows.right.destroy();
    this.skinArrows.left.destroy();
    this.skinArrows.right.destroy();
    this.eyeArrows.left.destroy();
    this.eyeArrows.right.destroy();

    this.colorWheel.destroy();
    this._nextButton.destroy();
    this._backButton.destroy();
  }
}

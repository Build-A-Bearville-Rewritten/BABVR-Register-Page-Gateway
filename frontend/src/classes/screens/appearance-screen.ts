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
import CharacterDesignInstructions from '../rendering/sprite/widgets/character-design-instructions.ts';
import AnimatedSprite from '../rendering/sprite/animated-sprite.ts';
import { basePath, EyeColor, EyeColorId, paths, SkinColor, SkinColorId } from '../../types/character.ts';
import { Observer } from '../../types/observer.ts';
import CharacterState from '../../modules/character-state.ts';

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
export default class AppearanceScreen extends AbstractScreen implements Observer {
  public canvas: HTMLCanvasElement;
  public character!: Character;
  public characterState: CharacterState;

  private _nextButton!: NextButton;
  private _backButton!: PrevButton;
  private colorWheel!: ColorWheel;

  public instructions!: CharacterDesignInstructions;

  public step1Sprite!: StaticSprite;
  public step2Sprite!: StaticSprite;
  public step3Sprite!: StaticSprite;
  public characterFrame!: StaticSprite;
  public genderBar!: GenderBar;
  public genderButton!: StaticSprite;
  public eyeColorSquareBorder!: StaticSprite;
  public eyeColorSquare?: StaticSprite;
  public skinColorSquareBorder!: StaticSprite;
  public skinColorSquare?: StaticSprite;

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

  private _chloeAnimation!: AnimatedSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.canvas = canvas;
    this.characterState = CharacterState.getInstance();
    this.characterState.addObserver(this);
    this.createSprites();
  }

  onSubjectUpdate(): void {
    if(this.eyeColorSquare?.getHSL() != EyeColor[this.characterState.eyeColorId].hsl){
      this.eyeColorSquare?.setHSL(EyeColor[this.characterState.eyeColorId].hsl);
    }

    if(this.skinColorSquare?.getHSL() != SkinColor[this.characterState.skinColorId].hsl){
      this.skinColorSquare?.setHSL(SkinColor[this.characterState.skinColorId].hsl);
    }
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

    this.instructions = new CharacterDesignInstructions(
      this.canvas,
      'Choose "Girl" or "Boy".\n\nClick the arrows to see the cool looks.\n\nUse the color wheel to change your hair\ncolor!\n\nWhen you\'re done, click "Next".',
      'Appearance'
    );

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

    this.character = new Character(this.canvas, this.characterFrame);

    this.eyeColorSquareBorder = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/colorSquareBorder.png',
      parent: this.skinContainer,
      sizeScale: 0.18,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.385, y: 0.3 },
    });

    this.eyeColorSquare = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/colorSquare.png',
      parent: this.skinContainer,
      sizeScale: 0.16,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.4, y: 0.3 },
      hsl: EyeColor[this.character.state.eyeColorId].hsl
    });

    this.skinColorSquareBorder = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/colorSquareBorder.png',
      parent: this.skinContainer,
      sizeScale: 0.18,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.385, y: 0.83 },
      hsl: SkinColor[this.character.state.skinColorId].hsl
    });

    this.skinColorSquare = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/colorSquare.png',
      parent: this.skinContainer,
      sizeScale: 0.16,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.4, y: 0.83 },
      hsl: SkinColor[1].hsl
    });

    // TODO: update arrow onClicks
    this.hairArrows = this.createArrows(
      0.35,
      0.4,
      this.headContainer,
      () => {
        this.characterState.hairPath = this.characterState.getNewPath('hair', this.characterState.hairPath, 'left');
      },
      () => {
        this.characterState.hairPath = this.characterState.getNewPath('hair', this.characterState.hairPath, 'right');
      }
    );
    this.headArrows = this.createArrows(
      0.85,
      0.4,
      this.headContainer,
      () => {
        this.characterState.headPath = this.characterState.getNewPath('head', this.characterState.headPath, 'left');
      },
      () => {
        this.characterState.headPath = this.characterState.getNewPath('head', this.characterState.headPath, 'right');
      }
    );
    this.eyeArrows = this.createArrows(
      0.3,
      0.48,
      this.skinContainer,
      () => {
        this.character.state.eyeColorId = this.character.state.eyeColorId === 1 ? 8 : this.character.state.eyeColorId - 1 as EyeColorId;
      },
      () => {
        this.character.state.eyeColorId = this.character.state.eyeColorId === 8 ? 1 : this.character.state.eyeColorId + 1 as EyeColorId;
      }
    );
    this.skinArrows = this.createArrows(
      0.83,
      0.48,
      this.skinContainer,
      () => {
        this.character.state.skinColorId = this.character.state.skinColorId === 1 ? 6 : this.character.state.skinColorId - 1 as SkinColorId;
      },
      () => {
        this.character.state.skinColorId = this.character.state.skinColorId === 6 ? 1 : this.character.state.skinColorId + 1 as SkinColorId;
      }
    );

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
    });

    // TODO: need new asset
    // this._chloeAnimation = new AnimatedSprite({
    //   canvas: this.canvas,
    //   parent: this.canvas,
    //   sizeScale: { x: 1, y: 1 },
    //   numFrames: 553, // the number of frames in the animation
    //   frameBuffer: 3, // the amount of times the canvas should draw before loading the next frames
    //   animationFolder: 'assets/Register/chloe/talk8/frames/' // folder containing the animations
    // });

    // this._chloeAnimation.play();
  }

  public destroy(): void {
    super.destroy();
    this.characterState.removeObserver(this);
    // this._chloeAnimation.destroy();

    this.instructions.destroy();
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

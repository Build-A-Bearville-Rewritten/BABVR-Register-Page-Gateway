import screenHandlerModule from '../../modules/screen-handler-module.ts';
import { AbstractScreen } from '../../types/rendering.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import NextButton from '../rendering/sprite/widgets/next-button.ts';
import PrevButton from '../rendering/sprite/widgets/prev-button.ts';
import ColorWheel from '../screen-objects/color-wheel.ts';
import NamingScreen from './naming-screen.ts';
import AppearanceScreen from './appearance-screen.ts';
import CharacterDesignInstructions from '../rendering/sprite/widgets/character-design-instructions.ts';
import { Observer } from '../../types/observer.ts';
import Character from '../screen-objects/character.ts';
import CharacterState from '../../modules/character-state.ts';
import {
  ArrowSprites,
  createArrows
} from '../rendering/sprite/widgets/arrow.ts';
import AnimatedSprite from '../rendering/sprite/animated-sprite.ts';

/**
 * CharacterCreator renders the UI container, color squares, and selection arrows
 * that surround the character preview on the registration screen.
 */
export default class ClothingScreen extends AbstractScreen implements Observer {
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

  public clothingContainer!: StaticSprite;
  public shirtIcon!: StaticSprite;
  public bottomsIcon!: StaticSprite;
  public shoesIcon!: StaticSprite;

  public shirtArrows!: ArrowSprites;
  public bottomsArrows!: ArrowSprites;
  public shoesArrows!: ArrowSprites;

  private _chloeAnimation!: AnimatedSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.canvas = canvas;
    this.characterState = CharacterState.getInstance();
    this.characterState.addObserver(this);
    this.createSprites();
  }

  onSubjectUpdate(): void {}

  /**
   * Create all sprites that compose the character creator UI component.
   */
  private createSprites(): void {
    this.instructions = new CharacterDesignInstructions(
      this.canvas,
      'Click the arrows to see the cool looks.\n\nUse the color wheel to change your\nclothing color!\n\nWhen you\'re done, click "Next".',
      'Clothing',
      10
    );

    this.step1Sprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/step1DeSelected.png',
      parent: this.canvas,
      sizeScale: 0.04,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.098, y: 0.17 }
    });

    this.step2Sprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/step2Selected.png',
      parent: this.canvas,
      sizeScale: 0.06,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.13, y: 0.17 }
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

    this.clothingContainer = new StaticSprite({
      canvas: this.canvas,
      imagePath:
        'assets/Register/character-creator/clothingSelectorsContainer.png',
      parent: this.characterFrame,
      sizeScale: 0.4,
      anchorPoint: { x: 0, y: 0.5 },
      positionScale: { x: 0.15, y: 0.5 }
    });

    this.shirtIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/shirtIcon.png',
      parent: this.clothingContainer,
      sizeScale: 0.12,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.1 }
    });

    this.bottomsIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/bottomsIcon.png',
      parent: this.clothingContainer,
      sizeScale: 0.12,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.42 }
    });

    this.shoesIcon = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/character-creator/shoesIcon.png',
      parent: this.clothingContainer,
      sizeScale: 0.11,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.73 }
    });

    this.shirtArrows = createArrows(
      this.canvas,
      0.08,
      0.25,
      0.15,
      0.45,
      this.clothingContainer,
      () => {
        this.characterState.shirtPath = this.characterState.getNewClothingPath(
          'shirt',
          this.characterState.shirtPath,
          'left'
        );
      },
      () => {
        this.characterState.shirtPath = this.characterState.getNewClothingPath(
          'shirt',
          this.characterState.shirtPath,
          'right'
        );
      }
    );

    this.bottomsArrows = createArrows(
      this.canvas,
      0.08,
      0.57,
      0.15,
      0.45,
      this.clothingContainer,
      () => {
        this.characterState.bottomsPath =
          this.characterState.getNewClothingPath(
            'bottoms',
            this.characterState.bottomsPath,
            'left'
          );
      },
      () => {
        this.characterState.bottomsPath =
          this.characterState.getNewClothingPath(
            'bottoms',
            this.characterState.bottomsPath,
            'right'
          );
      }
    );

    this.shoesArrows = createArrows(
      this.canvas,
      0.08,
      0.88,
      0.15,
      0.45,
      this.clothingContainer,
      () => {
        this.characterState.shoesPath = this.characterState.getNewClothingPath(
          'shoes',
          this.characterState.shoesPath,
          'left'
        );
      },
      () => {
        this.characterState.shoesPath = this.characterState.getNewClothingPath(
          'shoes',
          this.characterState.shoesPath,
          'right'
        );
      }
    );

    this.character = new Character(this.canvas, this.characterFrame);

    this.colorWheel = new ColorWheel(this.canvas);

    this._nextButton = new NextButton({
      canvas: this.canvas,
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(NamingScreen);
      }
    });

    this._backButton = new PrevButton({
      canvas: this.canvas,
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(AppearanceScreen);
      }
    });
  }

  public destroy(): void {
    super.destroy();
    this.characterState.removeObserver(this);

    this.instructions.destroy();
    this.step1Sprite.destroy();
    this.step2Sprite.destroy();
    this.step3Sprite.destroy();
    this.shirtArrows.left.destroy();
    this.shirtArrows.right.destroy();
    this.bottomsArrows.left.destroy();
    this.bottomsArrows.right.destroy();
    this.shoesArrows.left.destroy();
    this.shoesArrows.right.destroy();

    this.colorWheel.destroy();
    this._nextButton.destroy();
    this._backButton.destroy();

    this.character.destroy();
  }
}

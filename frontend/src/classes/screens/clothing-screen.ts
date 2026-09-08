import screenHandlerModule from '../../modules/screen-handler-module.ts';
import { AbstractScreen } from '../../types/rendering.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import NextButton from '../rendering/sprite/widgets/next-button.ts';
import PrevButton from '../rendering/sprite/widgets/prev-button.ts';
import ColorWheel from '../screen-objects/color-wheel.ts';
import NamingScreen from './naming-screen.ts';
import AppearanceScreen from './appearance-screen.ts';
import CharacterDesignInstructions from '../rendering/sprite/widgets/character-design-instructions.ts';

/**
 * CharacterCreator renders the UI container, color squares, and selection arrows
 * that surround the character preview on the registration screen.
 */
export default class ClothingScreen extends AbstractScreen {
  public canvas: HTMLCanvasElement;

  private _nextButton!: NextButton;
  private _backButton!: PrevButton;
  private colorWheel!: ColorWheel;

  public instructions!: CharacterDesignInstructions;

  public step1Sprite!: StaticSprite;
  public step2Sprite!: StaticSprite;
  public step3Sprite!: StaticSprite;
  public characterFrame!: StaticSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.canvas = canvas;
    this.createSprites();
  }

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
    })
  }

  public destroy(): void {
    super.destroy();
    this.instructions.destroy();
    this.step1Sprite.destroy();
    this.step2Sprite.destroy();
    this.step3Sprite.destroy();

    this.colorWheel.destroy();
    this._nextButton.destroy();
    this._backButton.destroy();
  }
}

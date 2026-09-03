import ChloeIntroScreen from './chloe-intro-screen.ts';
import Character from '../screen-objects/character.ts';
import ColorWheel from '../screen-objects/color-wheel.ts';
import CharacterCreator from '../screen-objects/character-creator.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import screenHandlerModule from '../../modules/screen-handler-module.ts';
import NamingScreen from './naming-screen.ts';
import { AbstractScreen } from '../../types/rendering.ts';
import PrevButton from '../rendering/sprite/widgets/prev-button.ts';
import NextButton from '../rendering/sprite/widgets/next-button.ts';

// Color wheel portion of the page

export default class CharacterCreatorScreen extends AbstractScreen {
  private _clickable: Clickable;

  private _nextButton!: NextButton;
  private _backButton!: PrevButton;

  private characterCreator!: CharacterCreator;
  private colorWheel!: ColorWheel;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._clickable = new Clickable();

    this.createSprites();
  }

  private createSprites(): void {
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
        void screenHandler.setScreen(ChloeIntroScreen);
      }
    });

    this.characterCreator = new CharacterCreator(this.canvas);
    new Character(this.canvas, this.characterCreator.characterContainer);
    this.colorWheel = new ColorWheel(this.canvas);
  }

  public destroy(): void {
    super.destroy();
    this.characterCreator.destroy();
    this._clickable.destroy();
    this.colorWheel.destroy();
    this._nextButton.destroy();
    this._backButton.destroy();
  }
}

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import ChloeIntroScreen from './chloe-intro-screen.ts';
import Character from '../screen-objects/character.ts';
import ColorWheel from '../screen-objects/color-wheel.ts';
import CharacterCreator from '../screen-objects/character-creator.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import screenHandlerModule from '../../modules/screen-handler-module.ts';
import NamingScreen from './naming-screen.ts';
import { AbstractScreen } from '../../types/rendering.ts';

// Color wheel portion of the page

export default class CharacterCreatorScreen extends AbstractScreen {
  private _clickable: Clickable;

  private _backgroundImage!: StaticSprite;
  private _nextButton!: StaticSprite;
  private _backButton!: StaticSprite;
  private loginHUD!: StaticSprite;

  private characterCreator!: CharacterCreator;
  private colorWheel!: ColorWheel;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._clickable = new Clickable();

    this.createSprites();
    this.bindEvents();
  }

  private bindEvents(): void {
    this._clickable.onClick(this._backButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      void screenHandler.setScreen(ChloeIntroScreen);
    });

    this._clickable.onClick(this._nextButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      void screenHandler.setScreen(NamingScreen);
    });
  }

  private createSprites(): void {
    this._backgroundImage = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });

    this._nextButton = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/emptyButton.png',
      sizeScale: 0.05,
      parent: this.canvas,
      anchorPoint: { x: 0.5, y: -1 },
      positionScale: { x: 0.83, y: 0.85 }
    });

    this._backButton = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/emptyButton.png',
      sizeScale: 0.05,
      parent: this.canvas,
      anchorPoint: { x: 5.5, y: -1 },
      positionScale: { x: 0.83, y: 0.85 }
    });

    this.characterCreator = new CharacterCreator(this.canvas);
    new Character(this.canvas, this.characterCreator.characterContainer);
    this.colorWheel = new ColorWheel(this.canvas);

    this.loginHUD = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 }
    });
  }

  public destroy(): void {
    this._clickable.destroy();
    this.colorWheel.destroy();
  }
}

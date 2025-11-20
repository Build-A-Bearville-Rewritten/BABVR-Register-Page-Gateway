import screenHandlerModule from '../../modules/screen-handler-module.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import CharacterCreatorScreen from './character-creator-screen.ts';
import TOSScreen from './tos-screen.ts';
import { AbstractScreen } from '../../../types/rendering.ts';

export default class NamingScreen extends AbstractScreen {
  private _clickable: Clickable;

  private _backgroundImage!: StaticSprite;
  private _testSprite!: StaticSprite;
  private _nextButton!: StaticSprite;
  private _backButton!: StaticSprite;
  private _loginHUD!: StaticSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._clickable = new Clickable();

    this.createSprites();
    this.bindEvents();
  }

  private bindEvents(): void {
    this._clickable.onClick(this._backButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      void screenHandler.setScreen(CharacterCreatorScreen);
    });

    this._clickable.onClick(this._nextButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      void screenHandler.setScreen(TOSScreen);
    });
  }

  private createSprites(): void {
    this._backgroundImage = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });

    this._testSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/NamingScreen.png',
      parent: this.canvas,
      sizeScale: 0.6,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
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

    this._loginHUD = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 }
    });
  }

  public destroy(): void {
    this._clickable.destroy();
  }
}

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import { AbstractScreen } from '../../../types/rendering.ts';

export default class TOSScreen extends AbstractScreen {
  private _clickable: Clickable;

  private _backgroundImage!: StaticSprite;
  private _testSprite!: StaticSprite;
  private _loginHUD!: StaticSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._clickable = new Clickable();

    this.createSprites();
    this.bindEvents();
  }

  private bindEvents(): void {
    
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
      imagePath: 'assets/Register/sprites/TOSscreen.png',
      parent: this.canvas,
      sizeScale: 0.6,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
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

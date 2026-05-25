import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import { AbstractScreen } from '../../types/rendering.ts';

export default class TOSScreen extends AbstractScreen {
  private _clickable: Clickable;

  private _testSprite!: StaticSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._clickable = new Clickable();

    this.createSprites();
    this.bindEvents();
  }

  private bindEvents(): void {}

  private createSprites(): void {
    this._testSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/TOSscreen.png',
      parent: this.canvas,
      sizeScale: 0.6,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
    });
  }

  public destroy(): void {
    super.destroy();
    this._clickable.destroy();
  }
}

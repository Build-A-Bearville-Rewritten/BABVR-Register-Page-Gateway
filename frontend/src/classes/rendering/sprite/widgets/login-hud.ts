import StaticSprite from '../static-sprite.ts';
import TextSprite from './text-sprite.ts';

export default class LoginHUD {
  public canvas: HTMLCanvasElement;

  private hudSprite!: StaticSprite;
  private textSprite!: TextSprite;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.createSprites();
  }

  private createSprites(): void {
    this.hudSprite = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 },
      zIndex: 1000 // always on top
    });

    this.textSprite = new TextSprite({
      canvas: this.canvas,
      text: 'Character Design',
      color: '#ffffff',
      fontFamily: 'Futura',
      fontSize: 14,
      textAlign: 'center',
      textBaseline: 'middle',
      zIndex: this.hudSprite.getZIndex() + 1,
      position: {
        relativeTo: this.canvas,
        anchor: { x: 1 / 2, y: 1 / 20 }
      }
    });
  }

  public destroy(): void {
    this.hudSprite.destroy();
    this.textSprite.destroy();
  }
}

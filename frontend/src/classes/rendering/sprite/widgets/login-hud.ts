import StaticSprite from "../static-sprite.ts";
import AbstractTextWidget from './abstract-text-widget.ts';

export default class LoginHUD extends AbstractTextWidget {
  public canvas: HTMLCanvasElement;

  private hudSprite!: StaticSprite;

  constructor(canvas: HTMLCanvasElement) {
    super({
      canvas,
      text: 'Character Design',
      color: '#ffffff',
      fontFamily: 'Futura',
      fontSize: 14,
      textAlign: 'center',
      textBaseline: 'middle',
      position: () => ({
        x: canvas.width/2,
        y: canvas.height/20
      })
    });

    this.canvas = canvas;

    this.createSprites();
  }

  private createSprites(): void {
    this.hudSprite = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 },
      zIndex: 1000, // always on top
    });
  }

  public destroy(): void {
    super.destroy();
  }
}

import spriteRendererModule from '../../../../modules/sprite-renderer-module.ts';
import { Point2D } from "../../../../types/common";
import StaticSprite from "../static-sprite";

export default class LoginHUD {
  public canvas: HTMLCanvasElement;

  // Sprite references
  private hudSprite!: StaticSprite;
  private titleText!: string;
  private readonly _drawTextBound = (): void => {
    this.drawText();
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.createSprites();

    document.fonts.load(`16px 'Futura'`);
      spriteRendererModule
        .getSpriteRenderer()
        .addPostRedrawCB(this._drawTextBound);
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

  private drawText(): void {
    if (!this.canvas) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const position: Point2D = {
      x: this.canvas.width/2,
      y: 23
    };
    const fontSize = 14;

    ctx.font = `${fontSize}px 'Futura', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      'Character Design',
      position.x,
      position.y
    );
  }

  public destroy(): void {
    spriteRendererModule
      .getSpriteRenderer()
      .removePostRedrawCB(this._drawTextBound);
  }
}

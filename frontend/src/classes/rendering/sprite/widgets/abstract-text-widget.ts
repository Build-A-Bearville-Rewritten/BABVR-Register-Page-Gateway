import spriteRendererModule from "../../../../modules/sprite-renderer-module";
import { Point2D, TextConstructorOptions } from "../../../../types/common";

export default class AbstractTextWidget {
  public canvas: HTMLCanvasElement | undefined;

  private text: string;
  private color: string;
  private fontFamily: string;
  private fontSize: number;
  private textAlign: CanvasTextAlign;
  private textBaseline: CanvasTextBaseline;
  private position: () => Point2D;

  private readonly _drawTextBound = (): void => {
    this.drawText();
  };

  constructor(
    {
      canvas,
      text = '',
      color = '#ffffff',
      fontFamily = 'Futura',
      fontSize = 12,
      textAlign = 'center',
      textBaseline = 'middle',
      position = () => ({
        x: 0,
        y: 0
      })
    }: TextConstructorOptions) {
      this.canvas = canvas;
      this.text = text;
      this.color = color;
      this.fontFamily = fontFamily;
      this.fontSize = fontSize;
      this.textAlign = textAlign;
      this.textBaseline = textBaseline;
      this.position = position;

      document.fonts.load(`${this.fontSize}px '${this.fontFamily}'`);
      spriteRendererModule
        .getSpriteRenderer()
        .addPostRedrawCB(this._drawTextBound);
  }

  private drawText(): void {
    if (!this.canvas) {
      return;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.font = `${this.fontSize}px '${this.fontFamily}', sans-serif`;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.textAlign;
    ctx.textBaseline = this.textBaseline;
    ctx.fillText(
      this.text,
      this.position().x,
      this.position().y
    );
  }

  public destroy(): void {
    spriteRendererModule
      .getSpriteRenderer()
      .removePostRedrawCB(this._drawTextBound);
  }
}

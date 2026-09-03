import Button, { ButtonOptions } from "./button";

export default class NextButton {
  public canvas: HTMLCanvasElement;
  private _buttonSprite!: Button;
  constructor(options: ButtonOptions) {
    const { onClick, canvas } = options;
    if(!canvas) {
      throw new Error('Canvas is required');
    }
    this.canvas = canvas;
    this._buttonSprite = new Button({
      canvas,
      parent: this.canvas,
      sizeScale: 0.07,
      anchorPoint: { x: 0.5, y: -0.5 },
      positionScale: { x: 0.83, y: 0.85 },
      textOptions: {
        canvas,
        text: 'NEXT',
        color: '#ffffff',
        fontFamily: 'Funhouse',
        fontSize: 12,
        textAlign: 'center',
        textBaseline: 'middle'
      },
      onClick
    });
  }

  public destroy(): void {
    this._buttonSprite.destroy();
  }
}

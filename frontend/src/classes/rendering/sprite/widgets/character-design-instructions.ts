import StaticSprite from "../static-sprite";
import AbstractTextWidget from "./abstract-text-widget";

export default class CharacterDesignInstructions extends AbstractTextWidget {
  public canvas: HTMLCanvasElement;

  public top!: StaticSprite;
  public middle!: StaticSprite;
  public bottom!: StaticSprite;
  public header!: StaticSprite;

  public headerText: string;
  public headerTextWidget!: AbstractTextWidget;

  constructor(canvas: HTMLCanvasElement, text: string, headerText: string, yOffset = 0) {
    super({
      canvas,
      text: text,
      color: '#ffffff',
      fontFamily: 'Futura',
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      position: () => ({
        x: 65,
        y: 240-yOffset
      })
    });

    this.canvas = canvas;
    this.headerText = headerText;
    this.createSprites();
  }

  private createSprites(): void {
    this.top = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsTop.png',
      parent: this.canvas,
      sizeScale: 0.144,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.29 }
    });

    this.middle = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsMiddle.png',
      parent: this.canvas,
      sizeScale: {x: 0.348, y: 0.3},
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.5 }
    });

    this.bottom = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsTopBottom.png',
      parent: this.canvas,
      sizeScale: 0.144,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.63 }
    });

    this.header = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/instructionsHeader.png',
      parent: this.canvas,
      sizeScale: { x: 0.21, y: 0.05 },
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.225, y: 0.32 }
    });

    this.headerTextWidget = new AbstractTextWidget({
      canvas: this.canvas,
      text: this.headerText,
      color: '#ffffff',
      fontFamily: 'Funhouse',
      fontSize: 12,
      textAlign: 'center',
      textBaseline: 'middle',
      position: () => ({
        x: 160,
        y: 157
      })
    });
  }

  public destroy(): void {
    super.destroy();
    this.headerTextWidget.destroy();
  }
}

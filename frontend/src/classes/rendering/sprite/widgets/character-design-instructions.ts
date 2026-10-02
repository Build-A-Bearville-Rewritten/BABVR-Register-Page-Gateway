import StaticSprite from '../static-sprite';
import TextSprite from './text-sprite';

export default class CharacterDesignInstructions {
  public canvas: HTMLCanvasElement;

  private textSprite!: TextSprite;
  public top!: StaticSprite;
  public middle!: StaticSprite;
  public bottom!: StaticSprite;
  public header!: StaticSprite;
  public leftPaw!: StaticSprite;
  public rightPaw!: StaticSprite;

  public headerText: string;
  public headerTextWidget!: TextSprite;

  constructor(
    canvas: HTMLCanvasElement,
    text: string,
    headerText: string,
    yOffset = 0
  ) {
    this.canvas = canvas;
    this.headerText = headerText;
    this.createSprites(text, yOffset);
  }

  private createSprites(text: string, yOffset: number): void {
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
      sizeScale: { x: 0.348, y: 0.3 },
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

    this.leftPaw = new StaticSprite({
      canvas: this.canvas,
      parent: this.header,
      imagePath: 'assets/Register/sprites/bluePaw3.png',
      sizeScale: 0.4,
      positionScale: { x: 0.08, y: 0.3 },
      flip: 'horizontal',
      rotation: 30,
      hsl: { h: 216, s: 80, l: 80 }
    });

    this.rightPaw = new StaticSprite({
      canvas: this.canvas,
      parent: this.header,
      imagePath: 'assets/Register/sprites/bluePaw3.png',
      sizeScale: 0.4,
      positionScale: { x: 0.85, y: 0.3 },
      rotation: -30,
      hsl: { h: 216, s: 80, l: 80 }
    });

    this.textSprite = new TextSprite({
      canvas: this.canvas,
      text,
      color: '#ffffff',
      fontFamily: 'Futura',
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      zIndex: this.middle.getZIndex() + 1,
      position: {
        relativeTo: this.middle,
        anchor: { x: 1 / 12, y: 1 / 2 },
        offset: { x: 0, y: -yOffset }
      }
    });

    this.headerTextWidget = new TextSprite({
      canvas: this.canvas,
      text: this.headerText,
      color: '#ffffff',
      fontFamily: 'Funhouse',
      fontSize: 12,
      textAlign: 'center',
      textBaseline: 'middle',
      zIndex: this.header.getZIndex() + 1,
      position: {
        relativeTo: this.header,
        anchor: { x: 1 / 2, y: 1 / 2 }
      }
    });
  }

  public destroy(): void {
    this.textSprite.destroy();
    this.headerTextWidget.destroy();
    this.top.destroy();
    this.middle.destroy();
    this.bottom.destroy();
    this.header.destroy();
    this.leftPaw.destroy();
    this.rightPaw.destroy();
  }
}

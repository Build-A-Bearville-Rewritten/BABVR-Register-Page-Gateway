import StaticSprite from "../rendering/sprite/static-sprite";
import AbstractTextWidget from "../rendering/sprite/widgets/abstract-text-widget";
import { Point2D, SpriteConstructorOptions } from "../../types/common";
import AbstractSprite from "../rendering/sprite/abstract-sprite";

export default class GenderBar {
  private canvas: HTMLCanvasElement | undefined;
  private parent: HTMLCanvasElement | AbstractSprite | undefined;
  private bar!: StaticSprite;
  private genderLabel!: GenderLabel;
  private girlButton!: GenderButton;
  private boyButton!: GenderButton;

  constructor({canvas, parent}: SpriteConstructorOptions) {
    this.canvas = canvas;
    this.parent = parent;
    this.createSprites();
  }

  private createSprites(): void {
    this.bar = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/251.png',
      sizeScale: 0.08,
      positionScale: { x: 0.165, y: 0.85 }
    });
    this.genderLabel = new GenderLabel({canvas: this.canvas, parent: this.bar});

    this.girlButton = new GenderButton({
      canvas: this.canvas,
      parent: this.bar,
      positionScale: { x: 0.4, y: 0.1 },
      text: 'Girl'
    });

    this.boyButton = new GenderButton({
      canvas: this.canvas,
      parent: this.bar,
      positionScale: { x: 0.68, y: 0.1 },
      text: 'Boy'
    });
  }

  public destroy(): void {
    this.genderLabel.destroy();
    this.girlButton.destroy();
    this.boyButton.destroy();
  }
}

class GenderLabel extends AbstractTextWidget {
  private parent: HTMLCanvasElement | AbstractSprite | undefined;
  private genderLabel!: StaticSprite;
  constructor({canvas, parent}: SpriteConstructorOptions) {
    super({
      canvas,
      text: 'Gender',
      color: '#ffffff',
      fontFamily: 'Funhouse',
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      position: () => ({
        x: this.genderLabel.getPosition().x+this.genderLabel.getSize().x/8,
        y: this.genderLabel.getPosition().y+this.genderLabel.getSize().y/2
      })
    });
    this.canvas = canvas;
    this.parent = parent;
    this.createSprites();
  }

  private createSprites(): void {
    this.genderLabel = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/252.png',
      sizeScale: 0.75,
      positionScale: { x: 0.02, y: 0.13 }
    });
  }

  public destroy(): void {
    super.destroy();
  }
}

class GenderButton extends AbstractTextWidget {
  private parent: HTMLCanvasElement | AbstractSprite | undefined;
  private genderLabel!: StaticSprite;
  private positionScale?: Point2D;
  constructor({
    canvas,
    parent,
    positionScale,
    text
  }: SpriteConstructorOptions & { text: string }) {
    super({
      canvas,
      text,
      color: '#966121',
      fontFamily: 'Futura',
      fontSize: 14,
      textAlign: 'left',
      textBaseline: 'middle',
      position: () => ({
        x: this.genderLabel.getPosition().x+this.genderLabel.getSize().x+1,
        y: this.genderLabel.getPosition().y+this.genderLabel.getSize().y/2
      })
    });
    this.canvas = canvas;
    this.parent = parent;
    this.positionScale = positionScale;
    this.createSprites();
  }

  private createSprites(): void {
    this.genderLabel = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/256.png',
      sizeScale: 0.8,
      positionScale: this.positionScale
    });
  }

  public destroy(): void {
    super.destroy();
  }
}

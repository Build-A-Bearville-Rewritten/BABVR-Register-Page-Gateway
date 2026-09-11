import StaticSprite from "../rendering/sprite/static-sprite";
import AbstractTextWidget from "../rendering/sprite/widgets/abstract-text-widget";
import { Point2D, SpriteConstructorOptions } from "../../types/common";
import AbstractSprite from "../rendering/sprite/abstract-sprite";
import Clickable from "../rendering/sprite/clickable";
import { Observer } from "../../types/observer";
import CharacterState from "../../modules/character-state";
import { Gender } from "../../types/character";

export default class GenderBar implements Observer {
  private canvas: HTMLCanvasElement | undefined;
  private parent: HTMLCanvasElement | AbstractSprite | undefined;
  public characterState: CharacterState;

  private bar!: StaticSprite;
  private genderLabel!: GenderLabel;
  private girlButton?: GenderButton;
  private boyButton?: GenderButton;

  private gender!: Gender; // private copy of characterState.gender to prevent unnecessary duplicate calls, should not be exposed

  constructor({ canvas, parent }: SpriteConstructorOptions) {
    this.canvas = canvas;
    this.parent = parent;
    this.characterState = CharacterState.getInstance();
    this.characterState.addObserver(this);
    this.createSprites();
  }

  onSubjectUpdate(): void {
    if (this.characterState.gender !== this.gender) {
      this.gender = this.characterState.gender;
      this.toggleGender(this.gender);
    }
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
      text: 'Girl',
      genderBar: this,
      gender: 'girl'
    });

    this.boyButton = new GenderButton({
      canvas: this.canvas,
      parent: this.bar,
      positionScale: { x: 0.68, y: 0.1 },
      text: 'Boy',
      genderBar: this,
      gender: 'boy'
    });
  }

  toggleGender(newGender: Gender) {
    if (newGender === 'girl') {
      this.girlButton?.toggle();
      this.boyButton?.untoggle();
    }

    if (newGender === 'boy') {
      this.boyButton?.toggle();
      this.girlButton?.untoggle();
    }
  }

  public destroy(): void {
    this.characterState.removeObserver(this);
    this.genderLabel.destroy();
    this.girlButton?.destroy();
    this.boyButton?.destroy();
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
        x: this.genderLabel.getPosition().x+this.genderLabel.getSize().x/12,
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
  private genderBar!: GenderBar;
  private gender!: Gender;
  private parent: HTMLCanvasElement | AbstractSprite | undefined;

  //TODO: instead of the two static sprites, use genderButtonAnimation
  private genderSelectedSprite?: StaticSprite;
  private genderRadioSprite!: StaticSprite;
  private readonly _clickable: Clickable;
  private positionScale?: Point2D;

  private _isToggled: boolean;
  private _isHovered: boolean;
  constructor({
    canvas,
    parent,
    positionScale,
    text,
    genderBar,
    gender
  }: SpriteConstructorOptions & { text: string, genderBar: GenderBar, gender: Gender }) {
    super({
      canvas,
      text,
      color: '#966121',
      fontFamily: 'Futura',
      fontSize: 14,
      textAlign: 'left',
      textBaseline: 'middle',
      position: () => ({
        x: this.genderRadioSprite.getPosition().x+this.genderRadioSprite.getSize().x+1,
        y: this.genderRadioSprite.getPosition().y+this.genderRadioSprite.getSize().y/2
      })
    });
    this.canvas = canvas;
    this.parent = parent;
    this.genderBar = genderBar;
    this.gender = gender;
    this.positionScale = positionScale;

    this._clickable = new Clickable();
    this._isToggled = this.gender === this.genderBar.characterState.gender;
    this._isHovered = false;

    this.createSprites();
    this.bindEvents();
  }

  private createSprites(): void {
    this.genderRadioSprite = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/256.png',
      sizeScale: 0.8,
      positionScale: this.positionScale
    });

    if (this._isToggled) {
      this.createToggledSprites();
    }
  }

  private createToggledSprites(): void {
    this.genderSelectedSprite = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/259.png',
      sizeScale: 0.6,
      anchorPoint: { x: -0.15, y: -0.13 },
      positionScale: this.positionScale
    });
  }

  private bindEvents(): void {
    this._clickable.onClick(this.genderRadioSprite, () => {
      this.genderBar.characterState.gender = this.gender;
    });

    this._clickable.onHoverStart(this.genderRadioSprite, () => {
      this.hover();
    });

    this._clickable.onHoverEnd(this.genderRadioSprite, () => {
      this.unhover();
    });
  }

  public toggle(): void {
    this._isToggled = true;
    if (!this._isHovered) {
      this.createToggledSprites();
    }
  }

  public untoggle(): void {
    this._isToggled = false;
    this.genderSelectedSprite?.removeFromScreen();
  }

  private hover(): void {
    this._isHovered = true;
    if (!this._isToggled) {
      this.createToggledSprites();
    }
  }

  private unhover(): void {
    this._isHovered = false;
    if (!this._isToggled) {
      this.untoggle();
    }
  }

  public destroy(): void {
    super.destroy();
    this._clickable.destroy();
  }
}

import StaticSprite from '../rendering/sprite/static-sprite';
import TextSprite from '../rendering/sprite/widgets/text-sprite';
import { Point2D, SpriteConstructorOptions } from '../../types/common';
import AbstractSprite from '../rendering/sprite/abstract-sprite';
import Clickable from '../rendering/sprite/clickable';
import { Observer } from '../../types/observer';
import CharacterState from '../../modules/character-state';
import { Gender } from '../../types/character';
import AnimatedSprite from '../rendering/sprite/animated-sprite';

export default class GenderBar implements Observer {
  public canvas: HTMLCanvasElement | undefined;
  public parent: HTMLCanvasElement | AbstractSprite | undefined;
  public characterState: CharacterState;

  private _bar!: StaticSprite;
  private _genderLabel!: GenderLabel;
  private _girlButton?: GenderButton;
  private _boyButton?: GenderButton;

  private _gender!: Gender; // private copy of characterState.gender to prevent unnecessary duplicate calls, should not be exposed

  constructor({ canvas, parent }: SpriteConstructorOptions) {
    this.canvas = canvas;
    this.parent = parent;
    this.characterState = CharacterState.getInstance();
    this.characterState.addObserver(this);
    this.createSprites();
  }

  onSubjectUpdate(): void {
    if (this.characterState.gender !== this._gender) {
      this._gender = this.characterState.gender;
      this.toggleGender(this._gender);
    }
  }

  private createSprites(): void {
    this._bar = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/251.png',
      sizeScale: 0.08,
      positionScale: { x: 0.165, y: 0.85 }
    });
    this._genderLabel = new GenderLabel({
      canvas: this.canvas,
      parent: this._bar
    });

    this._girlButton = new GenderButton({
      canvas: this.canvas,
      parent: this._bar,
      positionScale: { x: 0.4, y: 0.1 },
      text: 'Girl',
      genderBar: this,
      gender: 'girl'
    });

    this._boyButton = new GenderButton({
      canvas: this.canvas,
      parent: this._bar,
      positionScale: { x: 0.68, y: 0.1 },
      text: 'Boy',
      genderBar: this,
      gender: 'boy'
    });
  }

  toggleGender(newGender: Gender) {
    if (newGender === 'girl') {
      this._girlButton?.toggle();
      this._boyButton?.untoggle();
    }

    if (newGender === 'boy') {
      this._boyButton?.toggle();
      this._girlButton?.untoggle();
    }
  }

  public destroy(): void {
    this.characterState.removeObserver(this);
    this._genderLabel.destroy();
    this._girlButton?.destroy();
    this._boyButton?.destroy();
    this._bar.destroy();
  }
}

class GenderLabel {
  public canvas: HTMLCanvasElement | undefined;
  public parent: HTMLCanvasElement | AbstractSprite | undefined;
  private _genderLabel!: StaticSprite;
  private _textSprite!: TextSprite;

  constructor({ canvas, parent }: SpriteConstructorOptions) {
    this.canvas = canvas;
    this.parent = parent;
    this.createSprites();
  }

  private createSprites(): void {
    this._genderLabel = new StaticSprite({
      canvas: this.canvas,
      parent: this.parent,
      imagePath: 'assets/Register/character-creator/gender-selector/252.png',
      sizeScale: 0.75,
      positionScale: { x: 0.02, y: 0.13 }
    });

    this._textSprite = new TextSprite({
      canvas: this.canvas,
      text: 'Gender',
      color: '#ffffff',
      fontFamily: 'Funhouse',
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      zIndex: this._genderLabel.getZIndex() + 1,
      position: {
        relativeTo: this._genderLabel,
        anchor: { x: 1 / 12, y: 1 / 2 }
      }
    });
  }

  public destroy(): void {
    this._genderLabel.destroy();
    this._textSprite.destroy();
  }
}

class GenderButton {
  public canvas: HTMLCanvasElement | undefined;
  public parent: HTMLCanvasElement | AbstractSprite | undefined;

  private _genderBar!: GenderBar;
  private _gender!: Gender;

  private _genderSelectedSprite?: AnimatedSprite;
  private _genderRadioSprite!: AnimatedSprite;
  private _textSprite!: TextSprite;
  private readonly _clickable: Clickable;
  private _positionScale?: Point2D;

  private _isToggled: boolean;
  private _isHovered: boolean;
  constructor({
    canvas,
    parent,
    positionScale,
    text,
    genderBar,
    gender
  }: SpriteConstructorOptions & {
    text: string;
    genderBar: GenderBar;
    gender: Gender;
  }) {
    this.canvas = canvas;
    this.parent = parent;
    this._genderBar = genderBar;
    this._gender = gender;
    this._positionScale = positionScale;

    this._clickable = new Clickable();
    this._isToggled = this._gender === this._genderBar.characterState.gender;
    this._isHovered = false;

    this.createSprites(text);
    this.bindEvents();
  }

  private createSprites(text: string): void {
    this._genderSelectedSprite = new AnimatedSprite({
      canvas: this.canvas,
      parent: this.parent,
      animationFolder:
        'assets/Register/sprites/animationFrames/genderButtonHoverEndAnimation/',
      sizeScale: 0.8,
      positionScale: this._positionScale,
      numFrames: 6
    });

    this._genderRadioSprite = new AnimatedSprite({
      canvas: this.canvas,
      parent: this.parent,
      animationFolder:
        'assets/Register/sprites/animationFrames/genderButtonHoverStartAnimation/',
      sizeScale: 0.8,
      positionScale: this._positionScale,
      numFrames: 6
    });

    this._textSprite = new TextSprite({
      canvas: this.canvas,
      text,
      color: '#966121',
      fontFamily: 'Futura',
      fontSize: 14,
      textAlign: 'left',
      textBaseline: 'middle',
      zIndex: this._genderRadioSprite.getZIndex() + 1,
      position: {
        relativeTo: this._genderRadioSprite,
        anchor: { x: 1 / 2, y: 1 / 2 }
      }
    });

    if (this._isToggled) {
      this.createToggledSprites();
    }
  }

  private createToggledSprites(): void {
    this._genderSelectedSprite?.destroy();

    this._genderRadioSprite?.onAnimationEnded(() => {
      this._genderRadioSprite?.resetAnimation();
      this._genderSelectedSprite = new AnimatedSprite({
        canvas: this.canvas,
        parent: this.parent,
        animationFolder:
          'assets/Register/sprites/animationFrames/genderButtonHoverEndAnimation/',
        sizeScale: 0.8,
        positionScale: this._positionScale,
        numFrames: 6
      });
    });

    this._genderRadioSprite?.play();
  }

  private bindEvents(): void {
    if (this._genderRadioSprite) {
      this._clickable.onClick(this._genderRadioSprite, () => {
        this._genderBar.characterState.gender = this._gender;
      });

      this._clickable.onHoverStart(this._genderRadioSprite, () => {
        this.hover();
      });

      this._clickable.onHoverEnd(this._genderRadioSprite, () => {
        this.unhover();
      });
    }
  }

  public toggle(): void {
    this._isToggled = true;
    if (!this._isHovered) {
      this.createToggledSprites();
    }
  }

  public untoggle(): void {
    this._isToggled = false;
    this._genderRadioSprite.resetAnimation();
    this._genderSelectedSprite?.play();
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
    this._textSprite.destroy();
    this._genderSelectedSprite?.destroy();
    this._genderRadioSprite.destroy();
    this._clickable.destroy();
  }
}

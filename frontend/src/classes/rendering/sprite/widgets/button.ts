import { SpriteConstructorOptions } from '../../../../types/common.js';
import spriteRendererModule from '../../../../modules/sprite-renderer-module.ts';
import AnimatedSprite, {
  type AnimatedSpriteOptions
} from '../animated-sprite.js';
import Clickable, { MouseCallback } from '../clickable.js';

export interface ButtonOptions extends SpriteConstructorOptions {
  text?: string;
  onClick?: MouseCallback;
}

class ButtonAnimatedSprite extends AnimatedSprite {
  private _suppressed = false;
  private readonly _display: boolean; // true if it is the default (non-animation) sprite

  constructor(
    options: AnimatedSpriteOptions & { display: boolean }
  ) {
    const { display, ...animatedOptions } = options;
    super(animatedOptions);
    this._display = display;
  }

  setSuppressed(suppressed: boolean): void {
    this._suppressed = suppressed;
  }

  getImage(): HTMLImageElement | null {
    if (this._suppressed) {
      return null;
    }

    if (!this._display && !this.getIsPlaying()) {
      return null;
    }

    return super.getImage();
  }
}

export default class Button {
  private readonly _text: string;
  private readonly _canvas: HTMLCanvasElement | undefined;
  private readonly _clickable: Clickable;
  private readonly _onClick: MouseCallback;
  private readonly _drawTextBound = (): void => {
    this.drawText();
  };
  private _isHovered = false;

  private _clickAnimation!: ButtonAnimatedSprite;
  private _hoverStartAnimation!: ButtonAnimatedSprite;
  private _hoverEndAnimation!: ButtonAnimatedSprite;

  constructor(options: ButtonOptions) {
    const { text, onClick, ...spriteOptions } = options;

    this._canvas = spriteOptions.canvas;

    this._clickAnimation = new ButtonAnimatedSprite({
      animationFolder:
        'assets/Register/sprites/animationFrames/buttonClickAnimation/',
      numFrames: 6,
      frameBuffer: 3,
      isLooped: false,
      display: false,
      ...spriteOptions
    });

    this._hoverStartAnimation = new ButtonAnimatedSprite({
      animationFolder:
        'assets/Register/sprites/animationFrames/buttonHoverStartAnimation/',
      numFrames: 8,
      frameBuffer: 3,
      isLooped: false,
      display: true,
      ...spriteOptions
    });

    this._hoverEndAnimation = new ButtonAnimatedSprite({
      animationFolder:
        'assets/Register/sprites/animationFrames/buttonHoverEndAnimation/',
      numFrames: 8,
      frameBuffer: 3,
      isLooped: false,
      display: false,
      ...spriteOptions
    });

    this._text = text ?? '';
    this._onClick = onClick ?? (() => {});
    this._clickable = new Clickable();

    this._clickAnimation.onAnimationEnded(() => this.showIdle());
    this._hoverStartAnimation.onAnimationEnded(() => {
      if (!this._isHovered) {
        this.showIdle();
      }
    });
    this._hoverEndAnimation.onAnimationEnded(() => this.showIdle());

    this.showIdle();
    this.bindEvents();

    if (this._text) {
      document.fonts.load(`16px 'Funhouse'`);
      spriteRendererModule
        .getSpriteRenderer()
        .addPostRedrawCB(this._drawTextBound);
    }
  }

  private drawText(): void {
    if (!this._text || !this._canvas) {
      return;
    }

    const ctx = this._canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const sprite = this._hoverStartAnimation;
    const size = sprite.getSize();
    if (size.x === 0 || size.y === 0) {
      return;
    }

    const position = sprite.getPosition();
    const fontSize = Math.max(size.y * 0.35, 12);

    ctx.font = `${fontSize}px 'Funhouse', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this._text,
      position.x + size.x / 2,
      position.y + size.y / 2
    );
  }

  private showIdle(): void {
    this._hoverStartAnimation.setSuppressed(false);
    this._hoverStartAnimation.resetAnimation();
  }

  private playClick(): void {
    this._hoverStartAnimation.setSuppressed(true);
    this._clickAnimation.resetAnimation();
    this._clickAnimation.play();
  }

  private playHoverStart(): void {
    if (this._clickAnimation.getIsPlaying()) {
      return;
    }

    this._hoverStartAnimation.setSuppressed(false);
    this._hoverStartAnimation.resetAnimation();
    this._hoverStartAnimation.play();
  }

  private playHoverEnd(): void {
    if (this._clickAnimation.getIsPlaying()) {
      return;
    }

    this._hoverStartAnimation.setSuppressed(true);
    this._hoverEndAnimation.resetAnimation();
    this._hoverEndAnimation.play();
  }

  private bindEvents(): void {
    const interactionSprite = this._hoverStartAnimation;

    this._clickable.onClick(interactionSprite, (e: MouseEvent) => {
      this.playClick();
      this._onClick(e);
    });

    this._clickable.onHoverStart(interactionSprite, () => {
      this._isHovered = true;
      this.playHoverStart();
    });

    this._clickable.onHoverEnd(interactionSprite, () => {
      this._isHovered = false;
      this.playHoverEnd();
    });
  }

  public destroy(): void {
    spriteRendererModule
      .getSpriteRenderer()
      .removePostRedrawCB(this._drawTextBound);

    this._clickable.destroy();
    this._clickAnimation.destroy();
    this._hoverStartAnimation.destroy();
    this._hoverEndAnimation.destroy();
  }
}

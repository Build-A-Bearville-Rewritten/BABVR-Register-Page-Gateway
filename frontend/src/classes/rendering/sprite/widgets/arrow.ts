import { SpriteConstructorOptions } from '../../../../types/common.js';
import AnimatedSprite, {
  type AnimatedSpriteOptions
} from '../animated-sprite.js';
import Clickable, { MouseCallback } from '../clickable.js';
import StaticSprite from '../static-sprite.js';

export interface ArrowAnimatedSpriteOptions extends AnimatedSpriteOptions {
  display: boolean;
}

export interface ArrowOptions extends SpriteConstructorOptions {
  isAnimated: boolean;
  onClick?: MouseCallback;
}

class ArrowAnimatedSprite extends AnimatedSprite {
  private _suppressed = false;
  private readonly _display: boolean; // true if it is the default (non-animation) sprite
  constructor(
    options: ArrowAnimatedSpriteOptions
  ) {
    const { display, ...animatedSpriteOptions } = options;
    super(animatedSpriteOptions);
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

export default class Arrow {
  private readonly _clickable: Clickable;
  private readonly _onClick: MouseCallback;
  private _isHovered = false;
  private readonly _isAnimated: boolean;

  private _staticSprite?: StaticSprite;
  private _clickAnimation?: ArrowAnimatedSprite;
  private _hoverStartAnimation?: ArrowAnimatedSprite;
  private _hoverEndAnimation?: ArrowAnimatedSprite;

  constructor(options: ArrowOptions) {
    const { onClick, isAnimated = false, ...spriteOptions } = options;
    this._isAnimated = isAnimated;

    if (this._isAnimated) {
      this._clickAnimation = new ArrowAnimatedSprite({
        animationFolder:
          'assets/Register/sprites/animationFrames/arrowClickAnimation/',
        numFrames: 4,
        frameBuffer: 1,
        isLooped: false,
        display: false,
        ...spriteOptions
      });

      this._hoverStartAnimation = new ArrowAnimatedSprite({
        animationFolder:
          'assets/Register/sprites/animationFrames/arrowHoverStartAnimation/',
        numFrames: 10,
        frameBuffer: 1,
        isLooped: false,
        display: true,
        ...spriteOptions
      });

      this._hoverEndAnimation = new ArrowAnimatedSprite({
        animationFolder:
          'assets/Register/sprites/animationFrames/arrowHoverEndAnimation/',
        numFrames: 10,
        frameBuffer: 1,
        isLooped: false,
        display: false,
        ...spriteOptions
      });

      this._clickAnimation.onAnimationEnded(() => this.showIdle());
      this._hoverStartAnimation.onAnimationEnded(() => {
        if (!this._isHovered) {
          this.showIdle();
        }
      });
      this._hoverEndAnimation.onAnimationEnded(() => this.showIdle());
    } else {
      this._staticSprite = new StaticSprite({
        imagePath: 'assets/Register/sprites/animationFrames/arrowHoverStartAnimation/1.png',
        ...spriteOptions
      });
    }

    this._onClick = onClick ?? (() => {});
    this._clickable = new Clickable();

    this.showIdle();
    this.bindEvents();
  }

  private showIdle(): void {
    if (this._isAnimated) {
      this._hoverStartAnimation?.setSuppressed(false);
      this._hoverStartAnimation?.resetAnimation();
    }
  }

  private playClick(): void {
    if (this._isAnimated) {
      this._hoverStartAnimation?.setSuppressed(true);
      this._clickAnimation?.resetAnimation();
      this._clickAnimation?.play();
    }
  }

  private playHoverStart(): void {
    if (this._clickAnimation?.getIsPlaying()) {
      return;
    }

    this._hoverStartAnimation?.setSuppressed(false);
    this._hoverStartAnimation?.resetAnimation();
    this._hoverStartAnimation?.play();
  }

  private playHoverEnd(): void {
    if (this._clickAnimation?.getIsPlaying()) {
      return;
    }

    this._hoverStartAnimation?.setSuppressed(true);
    this._hoverEndAnimation?.resetAnimation();
    this._hoverEndAnimation?.play();
  }

  private bindEvents(): void {
    const interactionSprite = this._hoverStartAnimation ?? this._staticSprite;

    if (!interactionSprite) {
      return;
    }

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
    this._clickable.destroy();
    this._clickAnimation?.destroy();
    this._hoverStartAnimation?.destroy();
    this._hoverEndAnimation?.destroy();
    this._staticSprite?.destroy();
  }
}

/**
 * Convenience type describing the arrow sprites that appear in pairs
 */
export type ArrowSprites = {
  left: Arrow;
  right: Arrow;
};

/**
   * Draw arrow sprites at a specific vertical scale and horizontal spacing.
   */
export function createArrows(
  canvas: HTMLCanvasElement,
  xOffset: number,
  yOffset: number,
  sizeScale: number,
  spaceBetweenScale: number,
  parent: StaticSprite,
  onLeft: MouseCallback,
  onRight: MouseCallback
): ArrowSprites {
  const leftArrow = new Arrow({
    canvas,
    parent,
    sizeScale,
    anchorPoint: { x: 0, y: 0.5 },
    positionScale: { x: xOffset, y: yOffset },
    isAnimated: true,
    onClick: onLeft
  });

  const rightArrow = new Arrow({
    canvas,
    parent: parent,
    sizeScale,
    anchorPoint: { x: 0, y: 0.5 },
    positionScale: { x: xOffset + spaceBetweenScale, y: yOffset },
    flip: 'horizontal',
    isAnimated: true,
    onClick: onRight
  });

  return { left: leftArrow, right: rightArrow };
}

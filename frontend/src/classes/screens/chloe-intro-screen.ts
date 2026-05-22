// Chloe intro screen implementation - handles the introductory dialogue UI
// and transitions into the character creator flow.

import { AbstractScreen } from '../../types/rendering.ts';

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import CharacterCreatorScreen from '../screens/character-creator-screen.ts';
import AnimatedSprite from '../rendering/sprite/animated-sprite.ts';

/**
 * ChloeIntroScreen draws Chloe's intro art and advances to the
 * character creator when the player taps the next button.
 */
export default class ChloeIntroScreen extends AbstractScreen {
  private _backgroundImage!: StaticSprite;
  private _chloeAnimation!: AnimatedSprite;
  private _chloeSound!: HTMLAudioElement;
  private _chloeSoundTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _nextButton!: StaticSprite;
  private _loginHUD!: StaticSprite;

  private readonly _clickable: Clickable;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this._clickable = new Clickable();

    this.createSprites();
    this.bindEvents();
  }

  /**
   * Register click interactions for screen controls.
   */
  private bindEvents(): void {
    this._clickable.onClick(this._nextButton, () => {
      this._clickable.destroy();
      const screenHandler = screenHandlerModule.getInstance(this.canvas);
      void screenHandler.setScreen(CharacterCreatorScreen);
    });
  }

  /**
   * Build the static sprites that compose this screen.
   */
  private createSprites(): void {
    this._backgroundImage = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });

    this._nextButton = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/emptyButton.png',
      sizeScale: 0.05,
      parent: this.canvas,
      anchorPoint: { x: 0.5, y: -1 },
      positionScale: { x: 0.83, y: 0.85 }
    });

    this._loginHUD = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 },
      zIndex: 1000, // load this image before the chloe animation but draw it on top
    });

    this._chloeAnimation = new AnimatedSprite({
      canvas: this.canvas,
      parent: this.canvas,
      sizeScale: { x: 1, y: 1 },
      numFrames: 337, // the number of frames in the animation
      frameBuffer: 3, // the amount of times the canvas should draw before loading the next frames
      animationFolder: 'assets/Register/chloe/talk1/frames/' // folder containing the animations
    });

    this._chloeSound = new Audio(
      'assets/Register/chloe/talk1/sounds/162.mp3'
    );

    this._chloeAnimation.play();
    this._chloeSoundTimeoutId = setTimeout(() => {
      this._chloeSoundTimeoutId = null;
      void this._chloeSound.play();
    }, 700);
  }

  /**
   * Cleanup resources when the screen is replaced.
   */
  public destroy(): void {
    this._chloeAnimation.destroy();
    if (this._chloeSoundTimeoutId !== null) {
      clearTimeout(this._chloeSoundTimeoutId);
      this._chloeSoundTimeoutId = null;
    }
    this._chloeSound.pause();
    this._chloeSound.currentTime = 0;
    this._clickable.destroy();
  }
}

// Chloe intro screen implementation - handles the introductory dialogue UI
// and transitions into the character creator flow.

import { AbstractScreen } from '../../types/rendering.ts';

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import CharacterCreatorScreen from '../screens/character-creator-screen.ts';
import AnimatedSprite from '../rendering/sprite/animated-sprite.ts';
import Button from '../rendering/sprite/widgets/button.ts';

/**
 * ChloeIntroScreen draws Chloe's intro art and advances to the
 * character creator when the player taps the next button.
 */
export default class ChloeIntroScreen extends AbstractScreen {
  private _backgroundImage!: StaticSprite;
  private _chloeAnimation!: AnimatedSprite;
  private _chloeSound!: HTMLAudioElement;
  private _chloeSoundTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _nextButton!: Button;
  private _loginHUD!: StaticSprite;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.createSprites();
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

    this._loginHUD = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 },
      zIndex: 1000, // load this image before the animations but draw it on top
    });

    this._nextButton = new Button({
      canvas: this.canvas,
      parent: this.canvas,
      sizeScale: 0.07,
      anchorPoint: { x: 0.5, y: -0.5 },
      positionScale: { x: 0.83, y: 0.85 },
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(CharacterCreatorScreen);
      }
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
    this._nextButton.destroy();
    this._chloeAnimation.destroy();
    if (this._chloeSoundTimeoutId !== null) {
      clearTimeout(this._chloeSoundTimeoutId);
      this._chloeSoundTimeoutId = null;
    }
    this._chloeSound.pause();
    this._chloeSound.currentTime = 0;
  }
}

// Chloe intro screen implementation - handles the introductory dialogue UI
// and transitions into the character creator flow.

import { AbstractScreen } from '../../types/rendering.ts';

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import AnimatedSprite from '../rendering/sprite/animated-sprite.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import NextButton from '../rendering/sprite/widgets/next-button.ts';
import TextSprite from '../rendering/sprite/widgets/text-sprite.ts';
import AppearanceScreen from './appearance-screen.ts';

class ChloeSpeechBox {
  public canvas: HTMLCanvasElement;
  private _boxSprite!: StaticSprite;
  private _arrowSprite!: StaticSprite;
  private _textSprite!: TextSprite;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.createSprites();
  }

  private createSprites(): void {
    this._boxSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/speechBox.png',
      parent: this.canvas,
      sizeScale: { x: 0.3, y: 0.2 },
      positionScale: { x: 0.5, y: 0.4 }
    });

    this._arrowSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/speechArrow.png',
      parent: this._boxSprite,
      sizeScale: 0.4,
      positionScale: { x: -0.06, y: 0.4 },
      rotation: 180
    });

    this._textSprite = new TextSprite({
      canvas: this.canvas,
      text: "Hi, I'm ChloeRocks, and I'll help \nyou get started.",
      color: '#0e2b59',
      fontFamily: 'Futura',
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      zIndex: this._boxSprite.getZIndex() + 1,
      position: {
        relativeTo: this._boxSprite,
        anchor: { x: 1 / 8, y: 1 / 2 }
      }
    });
  }

  public destroy(): void {
    this._boxSprite.destroy();
    this._arrowSprite.destroy();
    this._textSprite.destroy();
  }
}

/**
 * ChloeIntroScreen draws Chloe's intro art and advances to the
 * character creator when the player taps the next button.
 */
export default class ChloeIntroScreen extends AbstractScreen {
  private _chloeAnimation!: AnimatedSprite;
  private _chloeSound!: HTMLAudioElement;
  private _chloeSoundTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _chloeSpeechBox!: ChloeSpeechBox;
  private _nextButton!: NextButton;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.createSprites();
  }

  /**
   * Build the static sprites that compose this screen.
   */
  private createSprites(): void {
    this._nextButton = new NextButton({
      canvas: this.canvas,
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(AppearanceScreen);
      }
    });

    this._chloeSpeechBox = new ChloeSpeechBox(this.canvas);

    this._chloeAnimation = new AnimatedSprite({
      canvas: this.canvas,
      parent: this.canvas,
      sizeScale: { x: 1, y: 1 },
      zIndex: 12,
      numFrames: 337, // the number of frames in the animation
      frameBuffer: 3, // the amount of times the canvas should draw before loading the next frames
      animationFolder: 'assets/Register/chloe/talk1/frames/' // folder containing the animations
    });

    this._chloeSound = new Audio('assets/Register/chloe/talk1/sounds/162.mp3');

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
    super.destroy();
    this._nextButton.destroy();
    this._chloeSpeechBox.destroy();
    this._chloeAnimation.destroy();
    if (this._chloeSoundTimeoutId !== null) {
      clearTimeout(this._chloeSoundTimeoutId);
      this._chloeSoundTimeoutId = null;
    }
    this._chloeSound.pause();
    this._chloeSound.currentTime = 0;
  }
}

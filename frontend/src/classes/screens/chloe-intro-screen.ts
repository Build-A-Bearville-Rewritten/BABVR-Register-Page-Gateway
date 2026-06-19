// Chloe intro screen implementation - handles the introductory dialogue UI
// and transitions into the character creator flow.

import { AbstractScreen } from '../../types/rendering.ts';

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import CharacterCreatorScreen from '../screens/character-creator-screen.ts';
import AnimatedSprite from '../rendering/sprite/animated-sprite.ts';
import Button from '../rendering/sprite/widgets/button.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import AbstractTextWidget from '../rendering/sprite/widgets/abstract-text-widget.ts';

class ChloeSpeechBox extends AbstractTextWidget {
  public canvas: HTMLCanvasElement;
  private _boxSprite!: StaticSprite;
  private _arrowSprite!: StaticSprite;

  constructor(canvas: HTMLCanvasElement){
    super({
      canvas,
      text: 'Hi, I\'m ChloeRocks, and I\'ll help \nyou get started.',
      color: '#0e2b59',
      fontFamily: 'Futura',
      fontSize: 12,
      textAlign: 'left',
      textBaseline: 'middle',
      position: () => ({
        x: this._boxSprite.getPosition().x+this._boxSprite.getSize().x/8,
        y: this._boxSprite.getPosition().y+this._boxSprite.getSize().y/2
      })
    });

    this.canvas = canvas;
    this.createSprites();
  }

  private createSprites(): void {
    this._boxSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/speechBox.png',
      parent: this.canvas,
      sizeScale: {x: 0.3, y: 0.2},
      positionScale: { x: 0.5, y: 0.4 }
    })

    this._arrowSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/speechArrow.png',
      parent: this._boxSprite,
      sizeScale: 0.4,
      positionScale: { x: -0.06, y: 0.4 },
      rotation: 180,
    })
  }

  public destroy(): void {
    super.destroy();
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
  private _nextButton!: Button;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.createSprites();
  }

  /**
   * Build the static sprites that compose this screen.
   */
  private createSprites(): void {
    this._nextButton = new Button({
      canvas: this.canvas,
      parent: this.canvas,
      text: 'NEXT',
      sizeScale: 0.07,
      anchorPoint: { x: 0.5, y: -0.5 },
      positionScale: { x: 0.83, y: 0.85 },
      onClick: () => {
        const screenHandler = screenHandlerModule.getInstance(this.canvas);
        void screenHandler.setScreen(CharacterCreatorScreen);
      }
    });

    this._chloeSpeechBox = new ChloeSpeechBox(this.canvas);

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

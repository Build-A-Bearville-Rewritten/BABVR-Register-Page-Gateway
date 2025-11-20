// Chloe intro screen implementation - handles the introductory dialogue UI
// and transitions into the character creator flow.

import screenHandlerModule from '../../modules/screen-handler-module.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import CharacterCreatorScreen from '../screens/character-creator-screen.ts';
import { AbstractScreen } from '../../../types/rendering.ts';

/**
 * ChloeIntroScreen draws Chloe's intro art and advances to the
 * character creator when the player taps the next button.
 */
export default class ChloeIntroScreen extends AbstractScreen {
  private _clickable: Clickable;

  private _backgroundImage!: StaticSprite;
  private _chloeSprite!: StaticSprite;
  private _nextButton!: StaticSprite;
  private _loginHUD!: StaticSprite;

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

    this._chloeSprite = new StaticSprite({
      canvas: this.canvas,
      imagePath: 'assets/Register/sprites/chloeTest.png',
      parent: this.canvas,
      sizeScale: 0.6,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
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
      sizeScale: { x: 1, y: 1 }
    });

    // this._chloeAnimation = new Sprite({
    //   canvas: this.canvas,
    //   parent: this.canvas,
    //   sizeScale: { x: 1, y: 1 },
    //   numFrames: 337, // the number of frames in the animation
    //   frameBuffer: 5, // the amount of times the canvas should draw before loading the next frames
    //   animationFolder: 'assets/Register/chloe/talk1/frames/' // folder containing the animations
    // });

    // this._chloeAnimation.play()
  }

  /**
   * Cleanup resources when the screen is replaced.
   */
  public destroy(): void {
    this._clickable.destroy();
  }
}



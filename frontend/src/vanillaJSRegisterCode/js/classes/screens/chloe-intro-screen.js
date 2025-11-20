import screenHandlerModule from '../../modules/screen-handler-module.ts';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import CharacterCreatorScreen from '../screens/character-creator-screen.js';

export default class ChloeIntroScreen {
  constructor(canvas) {
    this.canvas = canvas;

    this._clickable = new Clickable(canvas);

    this.createSprites();
    this.bindEvents();
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // ------------------w-------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------

  bindEvents() {
    this._clickable.onClick(this._nextButton, () => {
      this._clickable.destroy();
      const screenHandler = screenHandlerModule.getInstance(this.canvas);
      screenHandler.setScreen(CharacterCreatorScreen);
    });
  }

  async createSprites() {
    this._backgroundImage = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });

    this._testSprite = new StaticSprite({
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

  destroy() {
    this._clickable.destroy();
  }
}

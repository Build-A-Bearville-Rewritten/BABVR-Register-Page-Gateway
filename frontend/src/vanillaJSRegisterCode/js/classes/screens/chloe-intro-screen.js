import Sprite from '../rendering/sprite.js';
import CharacterCreatorScreen from './character-creator-screen.js';
import screenHandlerModule from '../../modules/screen-handler-module.js';

// Color wheel portion of the page

export default class ColorWheel {
  constructor(canvas) {
    this.canvas = canvas;

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
    this._nextButton.onClick(() => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas)
      screenHandler.setScreen(CharacterCreatorScreen);
    });
  }

  async createSprites() {
    this._backgroundImage = new Sprite({
      canvas: this.canvas,
      parent: this.canvas,
      imageSrc: 'assets/Register/sprites/BABW_Register_Background.png',
      sizeScale: { x: 1, y: 1 }
    });

    this._testSprite = new Sprite({
      canvas: this.canvas,
      imageSrc: 'assets/Register/sprites/chloeTest.png',
      parent: this.canvas,
      sizeScale: 0.6,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.42, y: 0.5 }
    });

    this._nextButton = new Sprite({
      canvas: this.canvas,
      imageSrc: './assets/Register/sprites/emptyButton.png',
      sizeScale: 0.05,
      parent: this.canvas,
      anchorPoint: { x: 0.5, y: -1 },
      positionScale: { x: 0.83, y: 0.85 }
    });

    this._loginHUD = new Sprite({
      canvas: this.canvas,
      parent: this.canvas,
      imageSrc: 'assets/Register/sprites/loginHUD.png',
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
}

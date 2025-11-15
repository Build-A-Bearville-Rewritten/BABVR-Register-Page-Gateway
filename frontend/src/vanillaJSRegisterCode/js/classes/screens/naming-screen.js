import screenHandlerModule from '../../modules/screen-handler-module.js';
import StaticSprite from '../rendering/sprite/static-sprite.ts';
import Clickable from '../rendering/sprite/clickable.ts';
import CharacterCreatorScreen from './character-creator-screen.js';
import TOSScreen from './tos-screen.js'

export default class NamingScreen {
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
    this._clickable.onClick(this._backButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      screenHandler.setScreen(CharacterCreatorScreen);
    });

    this._clickable.onClick(this._nextButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      screenHandler.setScreen(TOSScreen);
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
      imagePath: 'assets/Register/sprites/NamingScreen.png',
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

    this._backButton = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/emptyButton.png',
      sizeScale: 0.05,
      parent: this.canvas,
      anchorPoint: { x: 5.5, y: -1 },
      positionScale: { x: 0.83, y: 0.85 }
    });

    this._loginHUD = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 }
    });
  }

  destroy() {
    this._clickable.destroy();
  }
}

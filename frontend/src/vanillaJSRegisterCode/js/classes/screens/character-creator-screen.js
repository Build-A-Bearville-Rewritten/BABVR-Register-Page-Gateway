import StaticSprite from '../rendering/sprite/static-sprite.ts';
import ChloeIntroScreen from './chloe-intro-screen.js';
import Character from '../screen-objects/character.js';
import ColorWheel from '../screen-objects/color-wheel.js';
import CharacterCreator from '../screen-objects/character-creator.js';
import Clickable from '../rendering/sprite/clickable.ts';

import screenHandlerModule from '../../modules/screen-handler-module.js';
import NamingScreen from './naming-screen.js';

// Color wheel portion of the page

export default class CharacterCreatorScreen {
  constructor(canvas) {
    this.canvas = canvas;

    this._clickable = new Clickable(canvas);

    this.createSprites();
    this.bindEvents();
  }

  // -------------------------------------------
  // PUBLIC METHODS (remove when we add ts)
  // -------------------------------------------

  // -------------------------------------------
  // PRIVATE METHODS (remove when we add ts)
  // -------------------------------------------

  bindEvents() {
    this._clickable.onClick(this._backButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      screenHandler.setScreen(ChloeIntroScreen);
    });

    this._clickable.onClick(this._nextButton, () => {
      const screenHandler = screenHandlerModule.getInstance(this.canvas);

      screenHandler.setScreen(NamingScreen);
    });
  }

  async createSprites() {
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

    this._backButton = new StaticSprite({
      canvas: this.canvas,
      imagePath: './assets/Register/sprites/emptyButton.png',
      sizeScale: 0.05,
      parent: this.canvas,
      anchorPoint: { x: 5.5, y: -1 },
      positionScale: { x: 0.83, y: 0.85 }
    });

    this.characterCreator = new CharacterCreator(this.canvas);
    new Character(this.canvas, this.characterCreator.characterContainer);
    this.ColorWheel = new ColorWheel(this.canvas);

    this.loginHUD = new StaticSprite({
      canvas: this.canvas,
      parent: this.canvas,
      imagePath: 'assets/Register/sprites/loginHUD.png',
      sizeScale: { x: 1, y: 1 }
    });
  }

  destroy() {
    this._clickable.destroy();
    this.ColorWheel.destroy();
  }
}

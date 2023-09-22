import Sprite from '../rendering/sprite.js';
import ChloeIntro from './chloe-intro-screen.js';

import Character from '../screenObjects/character.js';
import ColorWheel from '../screenObjects/color-wheel.js';
import CharacterCreator from '../screenObjects/character-creator.js';

import spriteRendererModule from '../../modules/sprite-renderer-module.js';
import screenHandler from '../../modules/screen-handler.js';

// Color wheel portion of the page

export default class CharacterCreatorScreen {
  constructor(canvas) {
    this.canvas = canvas;

    this.sprites = [];
    this.objects = [];
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
    this._backButton.onClick(() => {
      const chloeIntro = new ChloeIntro(this.canvas);
      screenHandler.setScreen(this.canvas, chloeIntro);
    });
    this._nextButton.onClick(() => {
      console.log('clicked next button in character creator');
    });
  }

  async createSprites() {
    this.sprites.push(
      (this._backgroundImage = new Sprite({
        canvas: this.canvas,
        parent: this.canvas,
        imageSrc: 'assets/Register/sprites/BABW_Register_Background.png',
        sizeScale: { x: 1, y: 1 }
      })),
      (this._nextButton = new Sprite({
        canvas: this.canvas,
        imageSrc: './assets/Register/sprites/emptyButton.png',
        sizeScale: 0.05,
        parent: this.canvas,
        anchorPoint: { x: 0.5, y: -1 },
        positionScale: { x: 0.83, y: 0.85 }
      })),
      (this._backButton = new Sprite({
        canvas: this.canvas,
        imageSrc: './assets/Register/sprites/emptyButton.png',
        sizeScale: 0.05,
        parent: this.canvas,
        anchorPoint: { x: 5.5, y: -1 },
        positionScale: { x: 0.83, y: 0.85 }
      }))
    );

    this.objects.push(
      new ColorWheel(this.canvas)
      // (this.characterCreator = new CharacterCreator(this.canvas))
      // new Character(this.canvas, this.characterCreator.characterContainer)
    );

    this.sprites.push(
      (this.loginHUD = new Sprite({
        canvas: this.canvas,
        parent: this.canvas,
        imageSrc: 'assets/Register/sprites/loginHUD.png',
        sizeScale: { x: 1, y: 1 }
      }))
    );
  }
}

// Character instance

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import spriteRendererModule from '../../modules/sprite-renderer-module.ts';
import svgHandler from '../../modules/svg-handler.ts';
import type { SpriteParent } from '../../types/rendering.ts';
import CharacterState from '../../modules/character-state.ts';
import { Observer } from '../../types/observer.ts';

/**
 * Dictionary type for storing SVG URLs by key
 */
type SVGDictionary = {
  [key: string]: string | undefined;
};

/**
 * Character class for rendering character sprites with SVG handling
 */
export default class Character implements Observer {
  public state: CharacterState;

  public canvas: HTMLCanvasElement;
  public parent: SpriteParent;
  // Head sprites
  public headNoColor?: StaticSprite;
  public headColored?: StaticSprite;
  // Hair sprites
  public hairNoColor?: StaticSprite;
  public hairColored?: StaticSprite;
  // Torso and body sprites (commented out in original, but typed for future use)
  public torso?: StaticSprite;
  public rightUpperArm?: StaticSprite;
  public rightLowerArm?: StaticSprite;
  public leftUpperArm?: StaticSprite;
  public leftLowerArm?: StaticSprite;
  public hips?: StaticSprite;
  public rightUpLeg?: StaticSprite;
  public rightLowLeg?: StaticSprite;
  public leftUpLeg?: StaticSprite;
  public leftLowLeg?: StaticSprite;

  private _isCharacterLoaded: boolean = false;

  // SVG storage - maps SVG part names to their blob URLs
  private readonly _svgs: SVGDictionary = {};

  constructor(canvas: HTMLCanvasElement, parent: SpriteParent) {
    this.canvas = canvas;
    this.parent = parent;

    this.state = CharacterState.getInstance();
    this.state.addObserver(this);

    // splits the default character _svgs, then draws the sprites with those _svgs
    // this.splitSvgs()
    //   .then(this.createSprites.bind(this))
    //   .catch(error => {
    //     throw error;
    //   });

    this.createSprites().then(() => {
      spriteRendererModule
        .getSpriteRenderer()
        .addRedrawCB(this.onPreRedraw.bind(this));
    });
  }

  onSubjectUpdate(): void {
    // TODO: this gets called every time the character state updates
  }

  /**
   * Pre-redraw callback - called before sprites are redrawn
   */
  onPreRedraw(): void {
    // Override in subclasses or add logic here
  }

  /**
   * Splits SVGs where each layer of the SVG is turned into a new SVG
   * and saves the SVGs in the _svgs dictionary
   * @returns Promise that resolves when all SVGs are split
   */
  async splitSvgs(): Promise<void> {
    // Example implementation (commented out in original):
    // const assetsFolder = 'assets/Character/';
    // let urls = await svgHandler.splitLayers(assetsFolder + 'Character/torsoWomen.svg');
    // this._svgs['torsoWomen'] = urls[0];
    // urls = await svgHandler.splitLayers(assetsFolder + 'Character/arms/upArmTemp.svg');
    // this._svgs['upArmTemp'] = urls[0];
    // urls = await svgHandler.splitLayers(assetsFolder + 'Character/arms/lowArmTemp.svg');
    // this._svgs['lowArmTemp'] = urls[0];
    // urls = await svgHandler.splitLayers(assetsFolder + '/Character/hips/testHips.svg');
    // this._svgs['hips'] = urls[0];
    // urls = await svgHandler.splitLayers(assetsFolder + 'Character/legs/upLeg.svg');
    // this._svgs['upLeg'] = urls[0];
    // urls = await svgHandler.splitLayers(assetsFolder + 'Character/legs/lowLeg.svg');
    // this._svgs['lowLeg'] = urls[0];
  }

  /**
   * Creates head sprites from SVG layers
   * @returns Promise that resolves when head sprites are created
   */
  async createHeadSprites(): Promise<void> {
    const headNoColorPath = `${this.state.headPath}/8.svg`;
    const headColorPath =  `${this.state.headPath}/10.svg`;

    this.headNoColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: headNoColorPath,
      parent: this.parent,
      sizeScale: 0.18,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.7, y: 0.17 },
      hsl: { h: 30, s: 100, l: 93 },
      zIndex: 15
    });

    this.headColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: headColorPath,
      parent: this.headNoColor,
      sizeScale: 0.6,
      anchorPoint: { x: 0.8, y: 0.3 },
      positionScale: { x: 0.5, y: 0.5 },
      zIndex: this.headNoColor.getZIndex()
    });
  }

  /**
   * Creates hair sprites from SVG layers
   * @returns Promise that resolves when hair sprites are created
   */
  async createHairSprites(): Promise<void> {
    const hairPath = `${this.state.hairPath}/4.svg`;

    if (!this.headNoColor) {
      throw new Error('headNoColor must be created before hair sprites');
    }

    this.hairNoColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: hairPath,
      parent: this.headNoColor,
      sizeScale: 1.25,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.65, y: 0.31 },
      hsl: { h: 38, s: 91, l: 78 },
      zIndex: this.headNoColor.getZIndex()
    });
  }

  /**
   * Creates all character sprites
   * @returns Promise that resolves when all sprites are created
   */
  async createSprites(): Promise<void> {
    await this.createHeadSprites();
    await this.createHairSprites();

    // Example sprite creation (commented out in original):
    // if (!this.headNoColor) {
    //   throw new Error('headNoColor must be created first');
    // }

    // this.torso = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: './Test.svg',
    //   parent: this.headNoColor,
    //   sizeScale: 1.4,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.85 },
    //   hsl: this.headNoColor.getHSL(),
    //   zIndex: this.headNoColor.getZIndex() - 1
    // });

    // this.rightUpperArm = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.upArmTemp,
    //   parent: this.torso,
    //   sizeScale: 0.5,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.2, y: 0.1 },
    //   hsl: { h: 0, s: 100, l: 50 }
    // });

    // this.rightLowerArm = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: characterFolder + '/arms/upArmTemp.svg',
    //   parent: this.rightUpperArm,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.9 },
    //   hsl: { h: 200, s: 100, l: 50 }
    // });

    // this.leftUpperArm = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.upArmTemp,
    //   parent: this.torso,
    //   sizeScale: 0.5,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 1, y: 0.2 },
    //   hsl: { h: 0, s: 100, l: 50 },
    //   zIndex: this.torso.getZIndex()
    // });

    // this.leftLowerArm = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.upArmTemp,
    //   parent: this.leftUpperArm,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.9 },
    //   hsl: { h: 200, s: 100, l: 50 },
    //   zIndex: this.torso.getZIndex()
    // });

    // this.hips = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.hips,
    //   parent: this.torso,
    //   sizeScale: 0.45,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.9 },
    //   hsl: { h: 170, s: 100, l: 50 },
    //   zIndex: this.torso.getZIndex() - 1
    // });

    // this.rightUpLeg = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.upLeg,
    //   parent: this.hips,
    //   sizeScale: 1.1,
    //   anchorPoint: { x: 0, y: 0 },
    //   positionScale: { x: 0.1, y: 0.7 },
    //   hsl: { h: 150, s: 100, l: 50 }
    // });

    // this.rightLowLeg = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.lowLeg,
    //   parent: this.rightUpLeg,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.7 },
    //   hsl: this.rightUpLeg.getHSL()
    // });

    // this.leftUpLeg = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.upLeg,
    //   parent: this.hips,
    //   sizeScale: this.rightUpLeg.getSizeScale(),
    //   anchorPoint: { x: 1, y: 0 },
    //   positionScale: { x: 1, y: 0.7 },
    //   hsl: { h: 140, s: 100, l: 50 }
    // });

    // this.leftLowLeg = new StaticSprite({
    //   canvas: this.canvas,
    //   imagePath: this._svgs.lowLeg,
    //   parent: this.leftUpLeg,
    //   sizeScale: this.rightLowLeg.getSizeScale(),
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.7 },
    //   hsl: this.leftUpLeg.getHSL()
    // });
  }

  public destroy(): void {
    this.state.removeObserver(this);
  }
}

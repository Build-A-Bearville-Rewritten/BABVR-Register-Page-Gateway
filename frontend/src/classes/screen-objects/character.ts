// Character instance

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import spriteRendererModule from '../../modules/sprite-renderer-module.ts';
import svgHandler from '../../modules/svg-handler.ts';
import type { SpriteParent } from '../../types/rendering.ts';

/**
 * Dictionary type for storing SVG URLs by key
 */
type SVGDictionary = {
  [key: string]: string | undefined;
};

/**
 * Character class for rendering character sprites with SVG handling
 */
export default class Character {
  public canvas: HTMLCanvasElement;
  public parent: SpriteParent;
  
  // SVG storage - maps SVG part names to their blob URLs
  private _svgs: SVGDictionary = {};
  private _isCharacterLoaded: boolean = false;

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

  constructor(canvas: HTMLCanvasElement, parent: SpriteParent) {
    this.canvas = canvas;
    this.parent = parent;

    // splits the default character _svgs, then draws the sprites with those _svgs
    // this.splitSvgs()
    //   .then(this.createSprites.bind(this))
    //   .catch(error => {
    //     throw error;
    //   });

    this.createSprites().then(() => {
      spriteRendererModule.getSpriteRenderer().addRedrawCB(this.onPreRedraw.bind(this));
    });
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
    const characterFolder = 'assets/Character';

    // Split SVG layers - returns array of blob URLs
    const headSVGs: string[] = await svgHandler.splitLayers(
      characterFolder + '/head/testHead.svg'
    );

    this.headNoColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: headSVGs[0],
      parent: this.parent,
      sizeScale: 0.22,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.05 },
      hsl: { h: 30, s: 100, l: 93 },
      zIndex: 15
    });

    this.headColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: headSVGs[1],
      parent: this.headNoColor,
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0 },
      zIndex: this.headNoColor.getZIndex()
    });
  }

  /**
   * Creates hair sprites from SVG layers
   * @returns Promise that resolves when hair sprites are created
   */
  async createHairSprites(): Promise<void> {
    const characterFolder = 'assets/Character';

    // Split SVG layers - returns array of blob URLs
    const hairSVGs: string[] = await svgHandler.splitLayers(
      characterFolder + '/hair/womenHair5.svg'
    );

    if (!this.headNoColor) {
      throw new Error('headNoColor must be created before hair sprites');
    }

    this.hairNoColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: hairSVGs[1],
      parent: this.headNoColor,
      sizeScale: 1.15,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.575, y: -0.175 },
      hsl: { h: 38, s: 91, l: 78 },
      zIndex: this.headNoColor.getZIndex()
    });

    if (hairSVGs[2]) {
      this.hairColored = new StaticSprite({
        canvas: this.canvas,
        imagePath: hairSVGs[2],
        parent: this.hairNoColor,
        sizeScale: 1,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: 0 },
        zIndex: this.hairNoColor.getZIndex()
      });
    }
  }

  /**
   * Creates all character sprites
   * @returns Promise that resolves when all sprites are created
   */
  async createSprites(): Promise<void> {
    const characterFolder = 'assets/Character';

    // await this.createHeadSprites();
    // await this.createHairSprites();
    
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
}


import Sprite from '../rendering/sprite.js';
import spriteRendererModule from '../../modules/sprite-renderer-module.js';
import svgHandler from '../../modules/svg-handler.js';

// Character instance
export default class Character {
  constructor(canvas, parent) {
    this.canvas = canvas;
    this.parent = parent;
    this._svgs = {};
    this._isCharacterLoaded = false;

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

  onPreRedraw() {
    // console.log(this.headNoColor.getPosition().x);
  }

  // splits _svgs where each layer of the svg is turned into a new svg
  // and saves the _svgs in the _svgs array
  async splitSvgs() {
    // this._svgs['torsoWomen'] = urls[0];
    // urls = await svgHandler.splitLayers(
    //   assetsFolder + 'Character/arms/upArmTemp.svg'
    // );
    // this._svgs['upArmTemp'] = urls[0];
    // urls = await svgHandler.splitLayers(
    //   assetsFolder + 'Character/arms/lowArmTemp.svg'
    // );
    // this._svgs['lowArmTemp'] = urls[0];
    // urls = await svgHandler.splitLayers(
    //   assetsFolder + '/Character/hips/testHips.svg'
    // );
    // this._svgs['hips'] = urls[0];
    // urls = await svgHandler.splitLayers(
    //   assetsFolder + 'Character/legs/upLeg.svg'
    // );
    // this._svgs['upLeg'] = urls[0];
    // urls = await svgHandler.splitLayers(
    //   assetsFolder + 'Character/legs/lowLeg.svg'
    // );
    // this._svgs['lowLeg'] = urls[0];
  }

  // Draws the sprites for the characterw

  async createHeadSprites() {
    const characterFolder = 'assets/Character';

    const headSVGs = await svgHandler.splitLayers(
      characterFolder + '/head/testHead.svg'
    );

    this.headNoColor = new Sprite({
      canvas: this.canvas,
      imageSrc: headSVGs[0],
      parent: this.parent,
      sizeScale: 0.22,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.05 },
      hsl: { h: 30, s: 100, l: 93 },
      zIndex: 15
    });

    this.headColored = new Sprite({
      canvas: this.canvas,
      imageSrc: headSVGs[1],
      parent: this.headNoColor,
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0 },
      zIndex: this.headNoColor.getZIndex()
    });
  }

  async createHairSprites() {
    const characterFolder = 'assets/Character';

    const hairSVGs = await svgHandler.splitLayers(
      characterFolder + '/hair/womenHair5.svg'
    );

    this.hairNoColor = new Sprite({
      canvas: this.canvas,
      imageSrc: hairSVGs[1],
      parent: this.headNoColor,
      sizeScale: 1.15,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.575, y: -0.175 },
      hsl: { h: 38, s: 91, l: 78 },
      zIndex: this.headNoColor.getZIndex()
    });

    if (this._svgs.hairColored)
      this.hairColored = new Sprite({
        canvas: this.canvas,
        imageSrc: hairSVGs[2],
        parent: this.hairNoColor,
        sizeScale: 1,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: 0 },
        zIndex: ret.hairNoColor.getZIndex()
      });
  }

  async createSprites() {
    const characterFolder = 'assets/Character';

    // await this.createHeadSprites();
    // await this.createHairSprites();
    
    // this.torso = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: './Test.svg',
    //   parent: this.headNoColor,
    //   sizeScale: 1.4,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.85 },
    //   hsl: this.headNoColor.hsl,
    //   zIndex: this.headNoColor.getZIndex() -1
    // });

    // (this.rightUpperArm = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.upArmTemp,
    //   parent: this.torso,
    //   sizeScale: 0.5,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.2, y: 0.1 },
    //   hsl: { h: 0, s: 100, l: 50 }
    // })),

    // (this.rightLowerArm = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc:  characterFolder + '/arms/upArmTemp.svg',
    //   parent: this.rightUpperArm,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.9 },
    //   hsl: { h: 200, s: 100, l: 50 }
    // })),

    // (this.leftUpperArm = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.upArmTemp,
    //   parent: this.torso,
    //   sizeScale: 0.5,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 1, y: 0.2 },
    //   hsl: { h: 0, s: 100, l: 50 },
    //   zIndex: this.torso.getZIndex()
    // })),

    // (this.leftLowerArm = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.upArmTemp,
    //   parent: this.leftUpperArm,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.9 },
    //   hsl: { h: 200, s: 100, l: 50 },
    //   zIndex: this.torso.getZIndex()
    // })),

    // (this.hips = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.hips,
    //   parent: this.torso,
    //   sizeScale: 0.45,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.9 },
    //   hsl: { h: 170, s: 100, l: 50 },
    //   zIndex: this.torso.getZIndex() - 1
    // })),

    // (this.rightUpLeg = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.upLeg,
    //   parent: this.hips,
    //   sizeScale: 1.1,
    //   anchorPoint: { x: 0, y: 0 },
    //   positionScale: { x: 0.1, y: 0.7 },
    //   hsl: { h: 150, s: 100, l: 50 }
    // })),

    // (this.rightLowLeg = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.lowLeg,
    //   parent: this.rightUpLeg,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.7 },
    //   hsl: this.rightUpLeg.hsl
    // })),

    // (this.leftUpLeg = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.upLeg,
    //   parent: this.hips,
    //   sizeScale: this.rightUpLeg.sizeScale,
    //   anchorPoint: { x: 1, y: 0 },
    //   positionScale: { x: 1, y: 0.7 },
    //   hsl: { h: 140, s: 100, l: 50 }
    // })),

    // (this.leftLowLeg = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.lowLeg,
    //   parent: this.leftUpLeg,
    //   sizeScale: this.rightLowLeg.sizeScale,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0.7 },
    //   hsl: this.leftUpLeg.hsl
    // }))
  }
}

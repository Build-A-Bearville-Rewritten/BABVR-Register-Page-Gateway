import svgHandler from "../modules/svg-handler.js";
import spriteModule from "../modules/sprite-loader-module.js";

import Sprite from "./sprite.js";

// Character instance
export default class Character {
  constructor(canvas, parent) {
    this.canvas = canvas;
    this.parent = parent;
    this._svgs = {};
    this._isCharacterLoaded = false;

    const spriteLoader = spriteModule.getSpriteLoader(this.canvas);
    spriteLoader.addRedrawCB(this.beforeRedraw.bind(this));

    // splits the default character _svgs, then draws the sprites with those _svgs
    this.splitSvgs()
      .then(this.createSprites.bind(this))
      .catch(error => {
        throw error;
      });
  }

  // method that gets called before the sprite redraws
  beforeRedraw() {
    if (!this._isCharacterLoaded) return;
  }

  // splits _svgs where each layer of the svg is turned into a new svg
  // and saves the _svgs in the _svgs array
  async splitSvgs() {
    // let urls = await svgHandler.splitLayers("../assets/Character/hair/maleHair5.svg");
    let urls = await svgHandler.splitLayers(
      "../assets/Character/hair/womenHair5.svg"
    );
    this._svgs["hairNoColor"] = urls[1];
    this._svgs["hairColored"] = urls[2];

    urls = await svgHandler.splitLayers(
      "../assets/Character/head/testHead.svg"
    );
    this._svgs["headNoColor"] = urls[0];
    this._svgs["headColored"] = urls[1];

    urls = await svgHandler.splitLayers(
      "../assets/Character/torso/testWomenTorso.svg"
    );
    this._svgs["torsoWomen"] = urls[0];

    urls = await svgHandler.splitLayers(
      "../assets/Character/arms/upArmTemp.svg"
    );
    this._svgs["upArmTemp"] = urls[0];

    urls = await svgHandler.splitLayers(
      "../assets/Character/arms/lowArmTemp.svg"
    );
    this._svgs["lowArmTemp"] = urls[0];

    urls = await svgHandler.splitLayers(
      "../assets/Character/hips/testHips.svg"
    );
    this._svgs["hips"] = urls[0];

    urls = await svgHandler.splitLayers("../assets/Character/legs/upLeg.svg");
    this._svgs["upLeg"] = urls[0];

    urls = await svgHandler.splitLayers("../assets/Character/legs/lowLeg.svg");
    this._svgs["lowLeg"] = urls[0];
  }

  // Draws the sprites for the characterw
  createSprites() {
    const characterFolder = "assets/Character";

    this.headNoColor = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.headNoColor,
      parent: this.parent,
      sizeScale: 0.22,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.05 },
      hsl: { h: 30, s: 100, l: 93 },
      // zIndex: 15,
    });

    // this.headColored = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.headColored,
    //   parent: this.headNoColor,
    //   sizeScale: 1,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.5, y: 0 },
    //   zIndex: this.headNoColor.zIndex,
    // });

    // this.hairNoColor = new Sprite({
    //   canvas: this.canvas,
    //   imageSrc: this._svgs.hairNoColor,
    //   parent: this.headNoColor,
    //   sizeScale: 1.15,
    //   anchorPoint: { x: 0.5, y: 0 },
    //   positionScale: { x: 0.575, y: -.175 },
    //   hsl: { h: 38, s: 91, l: 78 },
    //   zIndex: this.headNoColor.zIndex,
    // });

    // if (this._svgs.hairColored)
    //   this.hairColored = new Sprite({
    //     canvas: this.canvas,
    //     imageSrc: this._svgs.hairColored,
    //     parent: this.hairNoColor,
    //     sizeScale: 1,
    //     anchorPoint: { x: 0.5, y: 0 },
    //     positionScale: { x: 0.5, y: 0 },
    //     zIndex: ret.hairNoColor.zIndex,
    //   });

    this.torso = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.torsoWomen,
      parent: this.headNoColor,
      sizeScale: 1.4,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.85 },
      hsl: this.headNoColor.hsl,
      // zIndex: this.headNoColor.zIndex - 1,
    });

    this.rightUpperArm = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.upArmTemp,
      parent: this.torso,
      sizeScale: 0.5,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.2, y: 0.1 },
      hsl: { h: 0, s: 100, l: 50 },
    });

    this.rightLowerArm = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.upArmTemp,
      parent: this.rightUpperArm,
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.9 },
      hsl: { h: 200, s: 100, l: 50 },
    });

    this.leftUpperArm = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.upArmTemp,
      parent: this.torso,
      sizeScale: 0.5,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 1, y: 0.2 },
      hsl: { h: 0, s: 100, l: 50 },
      // zIndex: this.torso.zIndex,
    });

    this.leftLowerArm = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.upArmTemp,
      parent: this.leftUpperArm,
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.9 },
      hsl: { h: 200, s: 100, l: 50 },
      // zIndex: this.torso.zIndex,
    });

    this.hips = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.hips,
      parent: this.torso,
      sizeScale: 0.45,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.9 },
      hsl: { h: 170, s: 100, l: 50 },
    });

    this.rightUpLeg = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.upLeg,
      parent: this.hips,
      sizeScale: 1.1,
      anchorPoint: { x: 0, y: 0 },
      positionScale: { x: 0.1, y: 0.7 },
      hsl: { h: 150, s: 100, l: 50 },
    });

    this.rightLowLeg = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.lowLeg,
      parent: this.rightUpLeg,
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.7 },
      hsl: this.rightUpLeg.hsl,
    });

    this.leftUpLeg = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.upLeg,
      parent: this.hips,
      sizeScale: this.rightUpLeg.sizeScale,
      anchorPoint: { x: 1, y: 0 },
      positionScale: { x: 1, y: 0.7 },
      hsl: { h: 140, s: 100, l: 50 },
    });

    this.leftLowLeg = new Sprite({
      canvas: this.canvas,
      imageSrc: this._svgs.lowLeg,
      parent: this.leftUpLeg,
      sizeScale: this.rightLowLeg.sizeScale,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: 0.7 },
      hsl: this.leftUpLeg.hsl,
    });

    this._isCharacterLoaded = true
  }
}

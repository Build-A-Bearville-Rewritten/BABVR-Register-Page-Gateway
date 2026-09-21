// Character instance

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import type { SpriteParent } from '../../types/rendering.ts';
import CharacterState from '../../modules/character-state.ts';
import { Observer } from '../../types/observer.ts';
import { basePath, EyeColor, SkinColor } from '../../types/character.ts';
import { HSL, SpriteConstructorOptions } from '../../types/common.ts';

/**
 * Character class for rendering character sprites with SVG handling
 */
export default class Character implements Observer {
  public state: CharacterState;

  public canvas: HTMLCanvasElement;
  public parent: SpriteParent;
  public headNoColor?: StaticSprite;
  public headColored?: StaticSprite;
  public eyes?: StaticSprite;
  public hairNoColor?: StaticSprite;
  public hairColored?: StaticSprite;
  public torso?: StaticSprite;
  public rightArm?: StaticSprite;
  public leftArm?: StaticSprite;
  public rightHand?: StaticSprite;
  public leftHand?: StaticSprite;
  public rightLeg?: StaticSprite;
  public rightFoot?: StaticSprite;
  public leftLeg?: StaticSprite;
  public leftFoot?: StaticSprite;

  public shirtColored?: StaticSprite;
  public shirtNoColor?: StaticSprite;
  public rightUpArm?: StaticSprite;
  public rightUpArmNoColor?: StaticSprite;
  public rightLowArm?: StaticSprite;
  public leftUpArm?: StaticSprite;
  public leftUpArmNoColor?: StaticSprite;
  public leftLowArm?: StaticSprite;

  public rightUpLegPants?: StaticSprite;
  public rightLowLegPants?: StaticSprite;
  public leftUpLegPants?: StaticSprite;
  public leftLowLegPants?: StaticSprite;
  public skirt?: StaticSprite;

  public rightShoeColored?: StaticSprite;
  public rightShoeNoColor?: StaticSprite;
  public leftShoeColored?: StaticSprite;
  public leftShoeNoColor?: StaticSprite;

  constructor(canvas: HTMLCanvasElement, parent: SpriteParent) {
    this.canvas = canvas;
    this.parent = parent;

    this.state = CharacterState.getInstance();
    this.state.addObserver(this);

    // Do not call any functions to create sprites
    // Adding the observer will trigger onSubjectUpdate already
  }

  onSubjectUpdate(): void {
    const headPath = `${this.state.headPath}/8.svg`;
    const hairPath = `${this.state.hairPath}/1.svg`;
    const shirtPath = `${this.state.shirtPath}/2.svg`;
    const bottomsPathSubstr = `${this.state.bottomsPath}`;
    const shoesPath = `${this.state.shoesPath}/2.svg`;

    if (this.headNoColor?.getImagePath() !== headPath || !this.headNoColor) {
      this.headNoColor?.destroy();
      this.headColored?.destroy();
      this.createHeadSprites();

      this.hairNoColor?.destroy();
      this.hairColored?.destroy();
      this.createHairSprites();
    }

    if (this.eyes?.getHSL() !== EyeColor[this.state.eyeColorId].hsl) {
      this.eyes?.setHSL(EyeColor[this.state.eyeColorId].hsl);
    }

    if (this.headNoColor?.getHSL() !== SkinColor[this.state.skinColorId].hsl) {
      this.updateSkinTone(SkinColor[this.state.skinColorId].hsl);
    }

    if (this.hairNoColor?.getImagePath() !== hairPath || !this.hairNoColor) {
      this.hairNoColor?.destroy();
      this.hairColored?.destroy();
      this.createHairSprites();
    }

    if (!this.torso) {
      this.createBodySprites();
    }

    if (this.shirtColored?.getImagePath() !== shirtPath || !this.shirtColored) {
      this.shirtColored?.destroy();
      this.shirtNoColor?.destroy();
      this.rightUpArm?.destroy();
      this.rightUpArmNoColor?.destroy();
      this.rightLowArm?.destroy();
      this.leftUpArm?.destroy();
      this.leftUpArmNoColor?.destroy();
      this.leftLowArm?.destroy();
      this.createShirtSprites();
    }

    // use skirt and pant leg ids as sprite could be defined without being drawn
    if (
      (this.skirt?.id &&
        !this.skirt.getImagePath()?.includes(bottomsPathSubstr)) ||
      (this.rightUpLegPants?.id &&
        !this.rightUpLegPants.getImagePath()?.includes(bottomsPathSubstr)) ||
      (!this.skirt?.id && !this.rightUpLegPants?.id)
    ) {
      this.rightUpLegPants?.destroy();
      this.rightLowLegPants?.destroy();
      this.leftUpLegPants?.destroy();
      this.leftLowLegPants?.destroy();
      this.skirt?.destroy();
      this.createBottomsSprites();
    }

    if (
      this.rightShoeColored?.getImagePath() !== shoesPath ||
      !this.rightShoeColored
    ) {
      this.rightShoeColored?.destroy();
      this.rightShoeNoColor?.destroy();
      this.leftShoeColored?.destroy();
      this.leftShoeNoColor?.destroy();
      this.createShoesSprites();
    }
  }

  private updateSkinTone(hsl: HSL) {
    this.headNoColor?.setHSL(hsl);
    this.torso?.setHSL(hsl);
    this.rightArm?.setHSL(hsl);
    this.leftArm?.setHSL(hsl);
    this.rightHand?.setHSL(hsl);
    this.leftHand?.setHSL(hsl);
    this.leftLeg?.setHSL(hsl);
    this.leftFoot?.setHSL(hsl);
    this.rightLeg?.setHSL(hsl);
    this.rightFoot?.setHSL(hsl);
  }

  /**
   * Creates head sprites from state
   */
  private createHeadSprites(): void {
    const headNoColorPath = `${this.state.headPath}/8.svg`;
    const headColorPath = `${this.state.headPath}/10.svg`;

    this.headNoColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: headNoColorPath,
      parent: this.parent,
      sizeScale: 0.18,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.7, y: 0.17 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: 20
    });

    const headColoredProps = this.getHeadColoredProps(headNoColorPath);

    this.headColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: headColorPath,
      parent: this.headNoColor,
      sizeScale: headColoredProps.sizeScale,
      anchorPoint: headColoredProps.anchorPoint,
      positionScale: headColoredProps.positionScale,
      zIndex: this.headNoColor.getZIndex()
    });

    const eyesPath = `${this.state.headPath}/12.svg`;

    const eyesProps = this.getEyesProps(headNoColorPath);

    this.eyes = new StaticSprite({
      canvas: this.canvas,
      imagePath: eyesPath,
      parent: this.headNoColor,
      sizeScale: eyesProps.sizeScale,
      anchorPoint: eyesProps.anchorPoint,
      positionScale: eyesProps.positionScale,
      zIndex: this.headNoColor.getZIndex(),
      hsl: EyeColor[this.state.eyeColorId].hsl
    });
  }

  private getHeadColoredProps(
    headNoColorPath: string
  ): Partial<SpriteConstructorOptions> {
    if (headNoColorPath.includes('head4')) {
      return {
        sizeScale: 0.57,
        anchorPoint: { x: 0.8, y: 0.25 },
        positionScale: { x: 0.5, y: 0.5 }
      };
    } else if (headNoColorPath.includes('head18')) {
      return {
        sizeScale: 0.63,
        anchorPoint: { x: 0.8, y: 0.3 },
        positionScale: { x: 0.52, y: 0.5 }
      };
    } else {
      return {
        sizeScale: 0.58,
        anchorPoint: { x: 0.8, y: 0.3 },
        positionScale: { x: 0.52, y: 0.5 }
      };
    }
  }

  private getEyesProps(
    headNoColorPath: string
  ): Partial<SpriteConstructorOptions> {
    if (headNoColorPath.includes('head4')) {
      return {
        sizeScale: 0.135,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.07, y: 0.59 }
      };
    } else if (headNoColorPath.includes('head1')) {
      return {
        sizeScale: 0.235,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.05, y: 0.56 }
      };
    } else {
      return {
        sizeScale: 0.235,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.04, y: 0.56 }
      };
    }
  }

  /**
   * Creates hair sprites from state
   */
  private createHairSprites(): void {
    const hairPath = `${this.state.hairPath}/1.svg`;

    if (!this.headNoColor) {
      throw new Error('headNoColor must be created before hair sprites');
    }

    const hairProps = this.getHairProps(hairPath);

    this.hairNoColor = new StaticSprite({
      canvas: this.canvas,
      imagePath: hairPath,
      parent: this.headNoColor,
      sizeScale: hairProps.sizeScale,
      anchorPoint: hairProps.anchorPoint,
      positionScale: hairProps.positionScale,
      hsl: this.state.hairColor,
      zIndex: this.headNoColor.getZIndex()
    });

    if (this.hasHairColored(hairPath)) {
      const hairColoredPath = `${this.state.hairPath}/2.svg`;
      const hairColoredProps = this.getHairColoredProps(this.state.hairPath);

      this.hairColored = new StaticSprite({
        canvas: this.canvas,
        imagePath: hairColoredPath,
        parent: this.hairNoColor,
        sizeScale: hairColoredProps.sizeScale,
        anchorPoint: hairColoredProps.anchorPoint,
        positionScale: hairColoredProps.positionScale,
        hsl: this.state.hairSecondColor,
        zIndex: this.headNoColor.getZIndex()
      });
    }
  }

  private getHairProps(hairPath: string): Partial<SpriteConstructorOptions> {
    if (hairPath.includes('hair7')) {
      return {
        sizeScale: 1.25,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.65, y: 0.31 }
      };
    } else if (hairPath.includes('hair8')) {
      return {
        sizeScale: 1.2,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.6, y: 0.35 }
      };
    } else if (hairPath.includes('hair10')) {
      return {
        sizeScale: 1.4,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.55, y: 0.55 }
      };
    } else if (hairPath.includes('hair12')) {
      return {
        sizeScale: 1,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.63, y: 0.39 }
      };
    } else if (hairPath.includes('hair13')) {
      return {
        sizeScale: 1.32,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.67, y: 0.31 }
      };
    } else if (hairPath.includes('hair1')) {
      return {
        sizeScale: 0.7,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.3 }
      };
    } else if (hairPath.includes('hair2')) {
      return {
        sizeScale: 0.85,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.38, y: 0.28 }
      };
    } else if (hairPath.includes('hair3')) {
      return {
        sizeScale: 0.63,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.55, y: 0.32 }
      };
    } else if (hairPath.includes('hair5')) {
      return {
        sizeScale: 0.78,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.45, y: 0.3 }
      };
    } else if (hairPath.includes('hair6')) {
      return {
        sizeScale: 0.82,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.53, y: 0.28 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0,
      anchorPoint: { x: 0, y: 0 },
      positionScale: { x: 0, y: 0 }
    };
  }

  private getHairColoredProps(
    hairPath: string
  ): Partial<SpriteConstructorOptions> {
    if (hairPath.includes('hair10')) {
      return {
        sizeScale: 0.28,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.225 }
      };
    } else if (hairPath.includes('hair12')) {
      return {
        sizeScale: 0.3,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.6, y: 0.1 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0,
      anchorPoint: { x: 0, y: 0 },
      positionScale: { x: 0, y: 0 }
    };
  }

  private hasHairColored(hairPath: string): boolean {
    return hairPath.includes('hair10') || hairPath.includes('hair12');
  }

  private createBodySprites(): void {
    const torsoPath = `${basePath}/body/torso.svg`;
    const handPath = `${basePath}/body/hand.svg`;
    const armLegPath = `${basePath}/body/arm_leg.svg`;
    const footPath = `${basePath}/body/foot.svg`;

    if (!this.headNoColor) {
      throw new Error('headNoColor must be created before body sprites');
    }

    this.torso = new StaticSprite({
      canvas: this.canvas,
      imagePath: torsoPath,
      parent: this.headNoColor,
      sizeScale: 1.5,
      anchorPoint: { x: 0.5, y: 0.11 },
      positionScale: { x: 0.5, y: 1 },
      //hsl: {h:0,s:0,l:100},
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.headNoColor.getZIndex() - 4
    });

    this.rightArm = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: { x: 0.284, y: 0.8 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.2, y: 0.1 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() - 2
    });

    this.leftArm = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: { x: 0.284, y: 0.8 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.9, y: 0.18 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() + 2
    });

    this.rightHand = new StaticSprite({
      canvas: this.canvas,
      imagePath: handPath,
      parent: this.torso, // parent is torso because arm is unevenly scaled
      sizeScale: { x: 0.57, y: 0.284 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.1, y: 0.7 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.rightArm.getZIndex()
    });

    this.leftHand = new StaticSprite({
      canvas: this.canvas,
      imagePath: handPath,
      parent: this.torso, // parent is torso because arm is unevenly scaled
      sizeScale: { x: 0.57, y: 0.284 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.8, y: 0.78 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.leftArm.getZIndex()
    });

    this.rightLeg = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: { x: 0.284, y: 0.8 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.3, y: 0.72 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() - 1
    });

    this.leftLeg = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: { x: 0.284, y: 0.8 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.7, y: 0.8 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() - 1
    });

    // TODO: replace with a better foot sprite if possible
    this.rightFoot = new StaticSprite({
      canvas: this.canvas,
      imagePath: footPath,
      parent: this.rightLeg,
      sizeScale: { x: 0.9, y: 0.35 },
      anchorPoint: { x: 1, y: 0.5 },
      positionScale: { x: 0.5, y: 1.05 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.rightLeg.getZIndex() - 1,
      rotation: 230
    });

    this.leftFoot = new StaticSprite({
      canvas: this.canvas,
      imagePath: footPath,
      parent: this.leftLeg,
      sizeScale: { x: 0.9, y: 0.35 },
      anchorPoint: { x: 1, y: 0.5 },
      positionScale: { x: 0.5, y: 1.05 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.rightLeg.getZIndex() - 1,
      rotation: 230
    });
  }

  private createShirtSprites(): void {
    const shirtColoredPath = `${this.state.shirtPath}/2.svg`;

    if (!this.torso) {
      throw new Error('torso must be created before shirt sprites');
    }

    const shirtProps = this.getShirtProps(this.state.shirtPath);

    this.shirtColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: shirtColoredPath,
      parent: this.torso,
      sizeScale: shirtProps.sizeScale,
      anchorPoint: shirtProps.anchorPoint,
      positionScale: shirtProps.positionScale,
      hsl: this.state.shirtColor,
      zIndex: this.torso.getZIndex() + 1
    });

    if (this.hasShirtNoColor(shirtColoredPath)) {
      const shirtNoColorPath = `${this.state.shirtPath}/1.svg`;
      const shirtNoColorProps = this.getShirtNoColorProps(this.state.shirtPath);
      this.shirtNoColor = new StaticSprite({
        canvas: this.canvas,
        imagePath: shirtNoColorPath,
        parent: this.shirtColored,
        sizeScale: shirtNoColorProps.sizeScale,
        anchorPoint: shirtNoColorProps.anchorPoint,
        positionScale: shirtNoColorProps.positionScale,
        zIndex: this.shirtColored.getZIndex()
      });
    }

    if (!this.rightArm || !this.leftArm) {
      throw new Error('Error: Arms must be created before sleeves');
    }

    const rightUpArmPath = `${this.state.shirtPath}/ruarm.svg`;
    const rightUpArmNoColorPath = `${this.state.shirtPath}/ruarmNoColor.svg`;
    const rightLowArmPath = `${this.state.shirtPath}/rlarm.svg`;
    const leftUpArmPath = `${this.state.shirtPath}/luarm.svg`;
    const leftUpArmNoColorPath = `${this.state.shirtPath}/luarmNoColor.svg`;
    const leftLowArmPath = `${this.state.shirtPath}/llarm.svg`;

    if (this.hasShirtSleeve(shirtColoredPath)) {
      const sleeveUpProps = this.getShirtSleeveUpProps(shirtColoredPath);

      this.rightUpArm = new StaticSprite({
        canvas: this.canvas,
        parent: this.rightArm,
        imagePath: rightUpArmPath,
        sizeScale: sleeveUpProps.sizeScale,
        anchorPoint: sleeveUpProps.anchorPoint,
        positionScale: sleeveUpProps.positionScale,
        hsl: this.state.shirtColor,
        zIndex: this.rightArm.getZIndex() + 1
      });

      this.leftUpArm = new StaticSprite({
        canvas: this.canvas,
        parent: this.leftArm,
        imagePath: leftUpArmPath,
        sizeScale: sleeveUpProps.sizeScale,
        anchorPoint: sleeveUpProps.anchorPoint,
        positionScale: sleeveUpProps.positionScale,
        hsl: this.state.shirtColor,
        zIndex: this.leftArm.getZIndex() + 1
      });

      if (this.hasShirtSleeveNoColor(shirtColoredPath)) {
        const sleeveNoColorProps =
          this.getShirtSleeveNoColorProps(shirtColoredPath);

        this.rightUpArmNoColor = new StaticSprite({
          canvas: this.canvas,
          parent: this.rightArm,
          imagePath: rightUpArmNoColorPath,
          sizeScale: sleeveNoColorProps.sizeScale,
          anchorPoint: sleeveNoColorProps.anchorPoint,
          positionScale: sleeveNoColorProps.positionScale,
          zIndex: this.rightArm.getZIndex() + 1
        });

        this.leftUpArmNoColor = new StaticSprite({
          canvas: this.canvas,
          parent: this.leftArm,
          imagePath: leftUpArmNoColorPath,
          sizeScale: sleeveNoColorProps.sizeScale,
          anchorPoint: sleeveNoColorProps.anchorPoint,
          positionScale: sleeveNoColorProps.positionScale,
          zIndex: this.leftArm.getZIndex() + 1
        });
      }

      if (this.hasShirtSleeveLow(shirtColoredPath)) {
        const sleeveLowProps = this.getShirtSleeveLowProps(shirtColoredPath);

        this.rightLowArm = new StaticSprite({
          canvas: this.canvas,
          parent: this.rightArm,
          imagePath: rightLowArmPath,
          sizeScale: sleeveLowProps.sizeScale,
          anchorPoint: sleeveLowProps.anchorPoint,
          positionScale: sleeveLowProps.positionScale,
          hsl: this.state.shirtColor,
          zIndex: this.rightArm.getZIndex() + 1
        });

        this.leftLowArm = new StaticSprite({
          canvas: this.canvas,
          parent: this.leftArm,
          imagePath: leftLowArmPath,
          sizeScale: sleeveLowProps.sizeScale,
          anchorPoint: sleeveLowProps.anchorPoint,
          positionScale: sleeveLowProps.positionScale,
          hsl: this.state.shirtColor,
          zIndex: this.leftArm.getZIndex() + 1
        });
      }
    }
  }

  private getShirtSleeveUpProps(
    shirtPath: string
  ): Partial<SpriteConstructorOptions> {
    if (shirtPath.includes('tcloth0')) {
      return {
        sizeScale: 0.52,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: 0 }
      };
    } else if (shirtPath.includes('tcloth1')) {
      return {
        sizeScale: 0.7,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: -0.05 }
      };
    } else if (shirtPath.includes('tcloth2')) {
      return {
        sizeScale: 0.52,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: 0 }
      };
    } else if (shirtPath.includes('tcloth4')) {
      return {
        sizeScale: 0.17,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.51, y: 0.12 }
      };
    } else if (shirtPath.includes('tcloth5')) {
      return {
        sizeScale: 0.7,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: 0 }
      };
    }

    return {
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 }
    };
  }

  private hasShirtSleeve(shirtPath: string): boolean {
    return (
      shirtPath.includes('tcloth0') ||
      shirtPath.includes('tcloth1') ||
      shirtPath.includes('tcloth2') ||
      shirtPath.includes('tcloth4') ||
      shirtPath.includes('tcloth5')
    );
  }

  private getShirtSleeveNoColorProps(
    shirtPath: string
  ): Partial<SpriteConstructorOptions> {
    if (shirtPath.includes('tcloth4')) {
      return {
        sizeScale: 0.5,
        anchorPoint: { x: 0.5, y: 0 },
        positionScale: { x: 0.5, y: -0.05 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0.45,
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.5, y: -0.05 }
    };
  }

  private hasShirtSleeveNoColor(shirtPath: string): boolean {
    return shirtPath.includes('tcloth4');
  }

  private getShirtSleeveLowProps(
    shirtPath: string
  ): Partial<SpriteConstructorOptions> {
    if (shirtPath.includes('tcloth5')) {
      return {
        sizeScale: 0.5,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.5 }
      };
    }

    return {
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 }
    };
  }

  private hasShirtSleeveLow(shirtPath: string): boolean {
    return shirtPath.includes('tcloth5');
  }

  private getShirtProps(shirtPath: string): Partial<SpriteConstructorOptions> {
    if (shirtPath.includes('tcloth0')) {
      return {
        sizeScale: 1,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.45 }
      };
    } else if (shirtPath.includes('tcloth1')) {
      return {
        sizeScale: 0.57,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.53, y: 0.25 }
      };
    } else if (shirtPath.includes('tcloth2')) {
      return {
        sizeScale: 1,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.45 }
      };
    } else if (shirtPath.includes('tcloth3')) {
      return {
        sizeScale: 1,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.45 }
      };
    } else if (shirtPath.includes('tcloth4')) {
      return {
        sizeScale: 0.8,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.51 }
      };
    } else if (shirtPath.includes('tcloth5')) {
      return {
        sizeScale: 0.85,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.48, y: 0.45 }
      };
    }

    // this should never happen
    return {
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 }
    };
  }

  private getShirtNoColorProps(
    shirtPath: string
  ): Partial<SpriteConstructorOptions> {
    if (shirtPath.includes('tcloth0')) {
      return {
        sizeScale: 0.73,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.56, y: 0.65 }
      };
    } else if (shirtPath.includes('tcloth1')) {
      return {
        sizeScale: 1.2,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.48, y: 1.05 }
      };
    } else if (shirtPath.includes('tcloth3')) {
      return {
        sizeScale: 0.57,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.03, y: 0.65 }
      };
    } else if (shirtPath.includes('tcloth4')) {
      return {
        sizeScale: 1.1,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.35 }
      };
    }

    // this should never happen
    return {
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 }
    };
  }

  private hasShirtNoColor(shirtColoredPath: string): boolean {
    return (
      shirtColoredPath.includes('tcloth0') ||
      shirtColoredPath.includes('tcloth1') ||
      shirtColoredPath.includes('tcloth3') ||
      shirtColoredPath.includes('tcloth4')
    );
  }

  private createBottomsSprites(): void {
    const bottomsPath = this.state.bottomsPath;

    if (bottomsPath.includes('skirt')) {
      this.createSkirtSprites();
      return;
    }

    const rulegPath = `${bottomsPath}/ruleg.svg`;
    const rllegPath = `${bottomsPath}/rlleg.svg`;
    const lulegPath = `${bottomsPath}/luleg.svg`;
    const lllegPath = `${bottomsPath}/llleg.svg`;

    if (!this.torso) {
      throw new Error('Error: Torso must be created before bottoms');
    }

    const rightUpLegProps = this.getRightUpLegProps(bottomsPath);
    this.rightUpLegPants = new StaticSprite({
      canvas: this.canvas,
      parent: this.torso,
      imagePath: rulegPath,
      sizeScale: rightUpLegProps.sizeScale,
      anchorPoint: rightUpLegProps.anchorPoint,
      positionScale: rightUpLegProps.positionScale,
      hsl: this.state.bottomsColor,
      zIndex: this.torso.getZIndex()
    });

    const leftUpLegProps = this.getLeftUpLegProps(bottomsPath);
    this.leftUpLegPants = new StaticSprite({
      canvas: this.canvas,
      parent: this.torso,
      imagePath: lulegPath,
      sizeScale: leftUpLegProps.sizeScale,
      anchorPoint: leftUpLegProps.anchorPoint,
      positionScale: leftUpLegProps.positionScale,
      hsl: this.state.bottomsColor,
      zIndex: this.torso.getZIndex()
    });

    if (this.hasPantsLowLeg(bottomsPath)) {
      const lowLegProps = this.getLowLegProps(bottomsPath);
      this.rightLowLegPants = new StaticSprite({
        canvas: this.canvas,
        parent: this.rightUpLegPants,
        imagePath: rllegPath,
        sizeScale: lowLegProps.sizeScale,
        anchorPoint: lowLegProps.anchorPoint,
        positionScale: lowLegProps.positionScale,
        hsl: this.state.bottomsColor,
        zIndex: this.rightUpLegPants.getZIndex() - 1
      });

      this.leftLowLegPants = new StaticSprite({
        canvas: this.canvas,
        parent: this.leftUpLegPants,
        imagePath: lllegPath,
        sizeScale: lowLegProps.sizeScale,
        anchorPoint: lowLegProps.anchorPoint,
        positionScale: lowLegProps.positionScale,
        hsl: this.state.bottomsColor,
        zIndex: this.leftUpLegPants.getZIndex() - 1
      });
    }
  }

  private getRightUpLegProps(
    bottomsPath: string
  ): Partial<SpriteConstructorOptions> {
    if (bottomsPath.includes('pants0')) {
      return {
        sizeScale: 0.49,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.32, y: 0.92 }
      };
    } else if (bottomsPath.includes('pants2')) {
      return {
        sizeScale: 0.57,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.32, y: 0.92 }
      };
    } else if (bottomsPath.includes('pants3')) {
      return {
        sizeScale: 0.49,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.32, y: 0.95 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0.43,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.32, y: 0.92 }
    };
  }

  private getLeftUpLegProps(
    bottomsPath: string
  ): Partial<SpriteConstructorOptions> {
    if (bottomsPath.includes('pants0')) {
      return {
        sizeScale: 0.49,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.73, y: 1 }
      };
    } else if (bottomsPath.includes('pants2')) {
      return {
        sizeScale: 0.57,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.73, y: 1 }
      };
    } else if (bottomsPath.includes('pants3')) {
      return {
        sizeScale: 0.49,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.73, y: 1.03 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0.43,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.73, y: 1 }
    };
  }

  private getLowLegProps(
    bottomsPath: string
  ): Partial<SpriteConstructorOptions> {
    if (bottomsPath.includes('pants0')) {
      return {
        sizeScale: 1.1,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.4, y: 1.1 }
      };
    } else if (bottomsPath.includes('pants2')) {
      return {
        sizeScale: 0.6,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.45, y: 1 }
      };
    }

    // this should never happen
    return {
      sizeScale: 1.1,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.4, y: 1.1 }
    };
  }

  private createSkirtSprites(): void {
    const skirtPath = `${this.state.bottomsPath}/1.svg`;

    if (!this.torso) {
      throw new Error('Error: Torso must be created before bottoms');
    }

    const skirtProps = this.getSkirtProps(skirtPath);
    this.skirt = new StaticSprite({
      canvas: this.canvas,
      parent: this.torso,
      imagePath: skirtPath,
      sizeScale: skirtProps.sizeScale,
      anchorPoint: skirtProps.anchorPoint,
      positionScale: skirtProps.positionScale,
      hsl: this.state.bottomsColor,
      zIndex: this.torso.getZIndex()
    });
  }

  private getSkirtProps(skirtPath: string): Partial<SpriteConstructorOptions> {
    if (skirtPath.includes('skirt0')) {
      return {
        sizeScale: 0.51,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.5, y: 0.95 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0.45,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.95 }
    };
  }

  private hasPantsLowLeg(bottomsPath: string): boolean {
    return bottomsPath.includes('pants0') || bottomsPath.includes('pants2');
  }

  private createShoesSprites(): void {
    const shoeColoredPath = `${this.state.shoesPath}/2.svg`;
    const shoeNoColorPath = `${this.state.shoesPath}/1.svg`;

    if (!this.leftLeg || !this.rightLeg) {
      throw new Error('Error: Legs must be created before shoes');
    }

    const shoeProps = this.getShoeColoredProps(shoeColoredPath);
    const shoeNoColorProps = this.getShoeNoColorProps(shoeNoColorPath);

    this.rightShoeColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: shoeColoredPath,
      parent: this.rightLeg,
      sizeScale: shoeProps.sizeScale,
      anchorPoint: shoeProps.anchorPoint,
      positionScale: shoeProps.positionScale,
      hsl: this.state.shoesColor,
      zIndex: this.rightLeg.getZIndex() - 1
    });

    if (this.hasShoeNoColor(shoeColoredPath)) {
      this.rightShoeNoColor = new StaticSprite({
        canvas: this.canvas,
        imagePath: shoeNoColorPath,
        parent: this.rightShoeColored,
        sizeScale: shoeNoColorProps.sizeScale,
        anchorPoint: shoeNoColorProps.anchorPoint,
        positionScale: shoeNoColorProps.positionScale,
        hsl: { h: 0, s: 0, l: 100 },
        zIndex: this.rightShoeColored.getZIndex()
      });
    }

    this.leftShoeColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: shoeColoredPath,
      parent: this.leftLeg,
      sizeScale: shoeProps.sizeScale,
      anchorPoint: shoeProps.anchorPoint,
      positionScale: shoeProps.positionScale,
      hsl: this.state.shoesColor,
      zIndex: this.leftLeg.getZIndex() - 1
    });

    if (this.hasShoeNoColor(shoeColoredPath)) {
      this.leftShoeNoColor = new StaticSprite({
        canvas: this.canvas,
        imagePath: shoeNoColorPath,
        parent: this.leftShoeColored,
        sizeScale: shoeNoColorProps.sizeScale,
        anchorPoint: shoeNoColorProps.anchorPoint,
        positionScale: shoeNoColorProps.positionScale,
        hsl: { h: 0, s: 0, l: 100 },
        zIndex: this.leftShoeColored.getZIndex()
      });
    }
  }

  private getShoeColoredProps(
    shoeColoredPath: string
  ): Partial<SpriteConstructorOptions> {
    if (shoeColoredPath.includes('shoe1')) {
      return {
        sizeScale: 0.3,
        anchorPoint: { x: 0.7, y: 0 },
        positionScale: { x: 0.5, y: 0.93 }
      };
    } else if (shoeColoredPath.includes('shoe2')) {
      return {
        sizeScale: 0.38,
        anchorPoint: { x: 0.7, y: 0 },
        positionScale: { x: 0.6, y: 0.93 }
      };
    } else if (shoeColoredPath.includes('shoe3')) {
      return {
        sizeScale: 0.38,
        anchorPoint: { x: 0.7, y: 0 },
        positionScale: { x: 0.45, y: 0.91 }
      };
    } else if (shoeColoredPath.includes('shoe4')) {
      return {
        sizeScale: 0.32,
        anchorPoint: { x: 0.7, y: 0 },
        positionScale: { x: 0.5, y: 0.92 }
      };
    } else if (shoeColoredPath.includes('shoe5')) {
      return {
        sizeScale: 0.18,
        anchorPoint: { x: 0.7, y: 0 },
        positionScale: { x: 0.51, y: 0.98 }
      };
    } else if (shoeColoredPath.includes('shoe6')) {
      return {
        sizeScale: 0.28,
        anchorPoint: { x: 0.7, y: 0 },
        positionScale: { x: 0.33, y: 0.93 }
      };
    }

    // this should never happen
    return {
      sizeScale: 0.3,
      anchorPoint: { x: 0.7, y: 0 },
      positionScale: { x: 0.5, y: 0.93 }
    };
  }

  private getShoeNoColorProps(
    shoeNoColorPath: string
  ): Partial<SpriteConstructorOptions> {
    if (shoeNoColorPath.includes('shoe1')) {
      return {
        sizeScale: 1.07,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.49, y: 0.75 }
      };
    } else if (shoeNoColorPath.includes('shoe2')) {
      return {
        sizeScale: 0.83,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.51, y: 0.68 }
      };
    } else if (shoeNoColorPath.includes('shoe3')) {
      return {
        sizeScale: 0.48,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.49, y: 0.8 }
      };
    }

    // this should never happen
    return {
      sizeScale: 1.07,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.49, y: 0.75 }
    };
  }

  private hasShoeNoColor(shoeColoredPath: string): boolean {
    return (
      shoeColoredPath.includes('shoe1') ||
      shoeColoredPath.includes('shoe2') ||
      shoeColoredPath.includes('shoe3')
    );
  }

  public destroy(): void {
    this.state.removeObserver(this);

    this.headNoColor?.destroy();
    this.headColored?.destroy();
    this.eyes?.destroy();
    this.hairNoColor?.destroy();
    this.hairColored?.destroy();
    this.torso?.destroy();
    this.rightArm?.destroy();
    this.leftArm?.destroy();
    this.rightHand?.destroy();
    this.leftHand?.destroy();
    this.rightLeg?.destroy();
    this.rightFoot?.destroy();
    this.leftLeg?.destroy();
    this.leftFoot?.destroy();

    this.shirtColored?.destroy();
    this.shirtNoColor?.destroy();
    this.rightUpArm?.destroy();
    this.rightUpArmNoColor?.destroy();
    this.rightLowArm?.destroy();
    this.leftUpArm?.destroy();
    this.leftUpArmNoColor?.destroy();
    this.leftLowArm?.destroy();

    this.rightUpLegPants?.destroy();
    this.rightLowLegPants?.destroy();
    this.leftUpLegPants?.destroy();
    this.leftLowLegPants?.destroy();
    this.skirt?.destroy();

    this.rightShoeColored?.destroy();
    this.rightShoeNoColor?.destroy();
    this.leftShoeColored?.destroy();
    this.leftShoeNoColor?.destroy();
  }
}

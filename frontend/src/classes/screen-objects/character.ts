// Character instance

import StaticSprite from '../rendering/sprite/static-sprite.ts';
import type { SpriteParent } from '../../types/rendering.ts';
import CharacterState from '../../modules/character-state.ts';
import { Observer } from '../../types/observer.ts';
import { basePath, EyeColor, SkinColor } from '../../types/character.ts';
import { SpriteConstructorOptions } from '../../types/common.ts';
import Clickable from '../rendering/sprite/clickable.ts';

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
  public leftLeg?: StaticSprite;

  public shirtColored?: StaticSprite;
  public shirtNoColor?: StaticSprite;

  private _clickable?: Clickable;

  constructor(canvas: HTMLCanvasElement, parent: SpriteParent) {
    this.canvas = canvas;
    this.parent = parent;

    this.state = CharacterState.getInstance();
    this.state.addObserver(this);

    // Do not call createSprites
    // Adding the observer will trigger onSubjectUpdate already
  }

  onSubjectUpdate(): void {
    this.removeSprites();
    this.createSprites();
    this.bindEvents();
  }

  private removeSprites(): void {
    this.headNoColor?.removeFromScreen();
    this.headColored?.removeFromScreen();
    this.eyes?.removeFromScreen();
    this.hairNoColor?.removeFromScreen();
    this.hairColored?.removeFromScreen();
    this.torso?.removeFromScreen();
    this.rightArm?.removeFromScreen();
    this.leftArm?.removeFromScreen();
    this.rightHand?.removeFromScreen();
    this.leftHand?.removeFromScreen();
    this.rightLeg?.removeFromScreen();
    this.leftLeg?.removeFromScreen();

    this.shirtColored?.removeFromScreen();
    this.shirtNoColor?.removeFromScreen();
  }

  private bindEvents(): void {
    this._clickable?.destroy();
    this._clickable = new Clickable();

    if (this.hairNoColor) {
      this._clickable.onClick(this.hairNoColor, () => {
        console.log('hair clicked');
        // TODO: update color
      });
    }

    if (this.hairColored) {
      this._clickable.onClick(this.hairColored, () => {
        console.log('hair secondary clicked');
        // TODO: update color
      })
    }

    // TODO: create clickables for clothing items
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
      zIndex: 15
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

  private getHeadColoredProps(headNoColorPath: string): Partial<SpriteConstructorOptions> {
    if (headNoColorPath.includes('head4')) {
      return {
        sizeScale: 0.57,
        anchorPoint: { x: 0.8, y: 0.25 },
        positionScale: { x: 0.5, y: 0.5 },
      };
    } else if (headNoColorPath.includes('head18')) {
      return {
        sizeScale: 0.63,
        anchorPoint: { x: 0.8, y: 0.3 },
        positionScale: { x: 0.52, y: 0.5 },
      }
    } else {
      return {
        sizeScale: 0.58,
        anchorPoint: { x: 0.8, y: 0.3 },
        positionScale: { x: 0.52, y: 0.5 },
      }
    }
  }

  private getEyesProps(headNoColorPath: string): Partial<SpriteConstructorOptions> {
    if (headNoColorPath.includes('head4')) {
      return {
        sizeScale: 0.135,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.07, y: 0.59 }
      }
    } else if (headNoColorPath.includes('head1')) {
      return {
        sizeScale: 0.235,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.05, y: 0.56 }
      }
    } else {
      return {
        sizeScale: 0.235,
        anchorPoint: { x: 0, y: 0.5 },
        positionScale: { x: 0.04, y: 0.56 }
      }
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

  private getHairColoredProps(hairPath: string): Partial<SpriteConstructorOptions> {
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

    if (!this.headNoColor) {
      throw new Error('headNoColor must be created before body sprites');
    }

    this.torso = new StaticSprite({
      canvas: this.canvas,
      imagePath: torsoPath,
      parent: this.headNoColor,
      sizeScale: 1.7,
      anchorPoint: { x: 0.5, y: 0.11 },
      positionScale: { x: 0.5, y: 1 },
      // hsl: {h:0,s:0,l:0},
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.headNoColor.getZIndex() - 4
    });

    this.rightArm = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: { x: 0.3, y: 0.7 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.2, y: 0.1 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() - 1
    });

    this.leftArm = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: { x: 0.3, y: 0.7 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.85, y: 0.18 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() + 2
    });

    this.rightHand = new StaticSprite({
      canvas: this.canvas,
      imagePath: handPath,
      parent: this.torso, // parent is torso because arm is unevenly scaled
      sizeScale: { x: 0.5, y: 0.25 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.1, y: 0.7 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.rightArm.getZIndex()
    });

    this.leftHand = new StaticSprite({
      canvas: this.canvas,
      imagePath: handPath,
      parent: this.torso, // parent is torso because arm is unevenly scaled
      sizeScale: { x: 0.5, y: 0.25 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.8, y: 0.78 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.leftArm.getZIndex()
    });

    this.leftLeg = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: {x: 0.3, y: 0.7 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.3, y: 0.72 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() - 1
    });

    this.rightLeg = new StaticSprite({
      canvas: this.canvas,
      imagePath: armLegPath,
      parent: this.torso,
      sizeScale: {x: 0.3, y: 0.7 },
      anchorPoint: { x: 0.5, y: 0 },
      positionScale: { x: 0.7, y: 0.8 },
      hsl: SkinColor[this.state.skinColorId].hsl,
      zIndex: this.torso.getZIndex() - 1
    });

    // TODO: find a foot sprite (for shoes that show feet)
  }

  private createClothingSprites(): void {
    const shirtColoredPath = `${this.state.shirtPath}/2.svg`;

    if (!this.torso) {
      throw new Error('torso must be created before clothing sprites');
    }

    this.shirtColored = new StaticSprite({
      canvas: this.canvas,
      imagePath: shirtColoredPath,
      parent: this.torso,
      sizeScale: 1,
      anchorPoint: { x: 0.5, y: 0.5 },
      positionScale: { x: 0.5, y: 0.5 },
      hsl: this.state.shirtColor,
      zIndex: this.torso.getZIndex() + 1
    });

    // TODO: import shirt sleeve sprites

    if (this.hasShirtNoColor(shirtColoredPath)) {
      const shirtNoColorPath = `${this.state.shirtPath}/1.svg`;
      this.shirtNoColor = new StaticSprite({
        canvas: this.canvas,
        imagePath: shirtNoColorPath,
        parent: this.shirtColored,
        sizeScale: 0.73,
        anchorPoint: { x: 0.5, y: 0.5 },
        positionScale: { x: 0.56, y: 0.65 },
        zIndex: this.shirtColored.getZIndex()
      });
    }

    // TODO: import pants sprites

    // <cargopants id="1" gender="m" xml="6" itemid="7"/>
		// <jeans id="2" gender="f" xml="7" itemid="8"/>
		// <bermudas id="3" gender="f" xml="8" itemid="37"/>
		// <shortskirt id="4" gender="f" xml="11" itemid="40"/>
		// <shorts id="5" gender="f" xml="9" itemid="38"/>
		// <sportpants id="6" gender="m" xml="10" itemid="39"/>

    // TODO: import shoes sprites

    // <skateshoes id="1" gender="x" xml="12" itemid="41"/>
		// <runningshoes id="2" gender="x" xml="13" itemid="42"/>
		// <comfortshoes id="3" gender="x" xml="14" itemid="43"/>
		// <cocktailshoes id="4" gender="f" xml="15" itemid="44"/>
		// <tongs id="5" gender="x" xml="16" itemid="45"/>
		// <clogs id="6" gender="x" xml="17" itemid="18"/>
  }

  private hasShirtNoColor(shirtColoredPath: string): boolean {
    return shirtColoredPath.includes('tcloth0') || shirtColoredPath.includes('tcloth1') || shirtColoredPath.includes('tcloth3') || shirtColoredPath.includes('tcloth4');
  }

  /**
   * Creates all character sprites
   * @returns Promise that resolves when all sprites are created
   */
  private createSprites(): void {
    this.createHeadSprites();
    this.createHairSprites();
    this.createBodySprites();
    this.createClothingSprites();
  }

  public destroy(): void {
    this.state.removeObserver(this);
    this._clickable?.destroy();
  }
}

import { Subject } from "../types/observer";
import { basePath, clothingPaths, EyeColorId, Gender, headPaths, SkinColorId } from "../types/character";
import { HSL } from "../types/common";

export default class CharacterState extends Subject {
  private static _instance: CharacterState;

  private _eyeColorId: EyeColorId;
  private _skinColorId: SkinColorId;
  private _gender: Gender;

  private _headPath: string;
  private _hairPath: string;

  private _hairColorHsl: HSL;
  private _hairSecondColorHsl: HSL;

  private _shirtPath: string;
  private _bottomsPath: string;
  private _shoesPath: string;

  private _shirtColorHsl: HSL;
  private _bottomsColorHsl: HSL;
  private _shoesColorHsl: HSL;

  private constructor(){
    super();
    this._eyeColorId = 1;
    this._skinColorId = 1;
    this._gender = 'girl';
    this._headPath = this.getDefaultGenderedHeadPath();
    this._hairPath = this.getDefaultGenderedHairPath();

    this._hairColorHsl = { h: 38, s: 91, l: 78 };
    this._hairSecondColorHsl = { h: 0, s: 0, l: 0 };

    this._shirtPath = this.getDefaultShirtPath();
    this._bottomsPath = this.getDefaultBottomsPath();
    this._shoesPath = this.getDefaultShoesPath();

    this._shirtColorHsl = { h: 230, s: 100, l: 22 };
    this._bottomsColorHsl = { h: 107, s: 94, l: 20 };
    this._shoesColorHsl = { h: 360, s: 95, l: 25 };
  }

  static getInstance(): CharacterState {
    if(!CharacterState._instance) {
      this._instance = new CharacterState();
    }

    return this._instance;
  }

  public get eyeColorId(): EyeColorId {
    return this._eyeColorId;
  }

  public set eyeColorId(id: EyeColorId) {
    this._eyeColorId = id;
    this.notifyObservers();
  }

  public get skinColorId(): SkinColorId {
    return this._skinColorId;
  }

  public set skinColorId(id: SkinColorId) {
    this._skinColorId = id;
    this.notifyObservers();
  }

  public get gender(): Gender {
    return this._gender;
  }

  public set gender(gender: Gender) {
    if (this._gender !== gender) { // do not update if there is nothing to update
      this._gender = gender;
      this._headPath = this.getDefaultGenderedHeadPath();
      this._hairPath = this.getDefaultGenderedHairPath();
      this.notifyObservers();
    }
  }

  public getNewPath (item: keyof typeof headPaths, pathObject: string, direction: 'left' | 'right'): string {
    const allItemPaths = headPaths[item].gender[this.gender];
    const currentItemIndex = allItemPaths.findIndex((v) => { return pathObject.includes(v); });
    const newItemIndex = direction === 'left' ? (currentItemIndex - 1 + allItemPaths.length) % allItemPaths.length : (currentItemIndex + 1) % allItemPaths.length;
    return `${basePath}/${item}/${this.gender}/${headPaths[item].gender[this.gender][newItemIndex]}`;
  }

  public get headPath(): string {
    return this._headPath;
  }

  public set headPath(headPath: string) {
    this._headPath = headPath;
    this.notifyObservers();
  }

  private getDefaultGenderedHeadPath(): string {
    return `${basePath}/head/${this._gender}/${headPaths['head'].gender[this._gender][0]}`;
  }

  public get hairPath(): string {
    return this._hairPath;
  }

  public set hairPath(hairPath: string) {
    this._hairPath = hairPath;
    this.notifyObservers();
  }

  private getDefaultGenderedHairPath(): string {
    return `${basePath}/hair/${this._gender}/${headPaths['hair'].gender[this._gender][0]}`;
  }

  public get hairColor(): HSL {
    return this._hairColorHsl;
  }

  public set hairColor(hsl: HSL) {
    this._hairColorHsl = hsl;
    this.notifyObservers();
  }

  public get hairSecondColor(): HSL {
    return this._hairSecondColorHsl;
  }

  public set hairSecondColor(hsl: HSL) {
    this._hairSecondColorHsl = hsl;
    this.notifyObservers();
  }

  public get shirtPath(): string {
    return this._shirtPath;
  }

  public set shirtPath(shirtPath: string) {
    this._shirtPath = shirtPath;
    this.notifyObservers();
  }

  private getDefaultShirtPath(): string {
    return `${basePath}/shirt/${clothingPaths['shirt'][0]}`;
  }

  public get shirtColor(): HSL {
    return this._shirtColorHsl;
  }

  public set shirtColor(shirtColor: HSL) {
    this._shirtColorHsl = shirtColor;
    this.notifyObservers();
  }

  public get bottomsColor(): HSL {
    return this._bottomsColorHsl;
  }

  public set bottomsColor(bottomsColor: HSL) {
    this._bottomsColorHsl = bottomsColor;
    this.notifyObservers();
  }

  public get shoesColor(): HSL {
    return this._shoesColorHsl;
  }

  public set shoesColor(shoesColor: HSL) {
    this._shoesColorHsl = shoesColor;
    this.notifyObservers();
  }

  public get bottomsPath(): string {
    return this._bottomsPath;
  }

  public set bottomsPath(bottomsPath: string) {
    this._bottomsPath = bottomsPath;
    this.notifyObservers();
  }

  private getDefaultBottomsPath(): string {
    return `${basePath}/bottoms/${clothingPaths['bottoms'][0]}`;
  }

  public get shoesPath(): string {
    return this._shoesPath;
  }

  public set shoesPath(shoesPath: string) {
    this._shoesPath = shoesPath;
    this.notifyObservers();
  }

  private getDefaultShoesPath(): string {
    return `${basePath}/shoes/${clothingPaths['shoes'][0]}`;
  }
}

import { Subject } from "../types/observer";
import { basePath, EyeColorId, Gender, paths, SkinColorId } from "../types/character";

export default class CharacterState extends Subject {
  private static _instance: CharacterState;

  private _eyeColorId: EyeColorId;
  private _skinColorId: SkinColorId;
  private _gender: Gender;

  private _headPath: string;
  private _hairPath: string;

  private constructor(){
    super();
    this._eyeColorId = 1;
    this._skinColorId = 1;
    this._gender = 'girl';
    this._headPath = this.getDefaultGenderedHeadPath();
    this._hairPath = this.getDefaultGenderedHairPath();
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

  public getNewPath (item: keyof typeof paths, pathObject: string, direction: 'left' | 'right'): string {
    const allItemPaths = paths[item].gender[this.gender];
    const currentItemIndex = allItemPaths.findIndex((v) => { return pathObject.includes(v); });
    const newItemIndex = direction === 'left' ? (currentItemIndex - 1 + allItemPaths.length) % allItemPaths.length : (currentItemIndex + 1) % allItemPaths.length;
    return `${basePath}/${item}/${this.gender}/${paths[item].gender[this.gender][newItemIndex]}`;
  }

  public get headPath(): string {
    return this._headPath;
  }

  public set headPath(headPath: string) {
    this._headPath = headPath;
    this.notifyObservers();
  }

  private getDefaultGenderedHeadPath(): string {
    return `${basePath}/head/${this._gender}/${paths['head'].gender[this._gender][0]}`;
  }

  public get hairPath(): string {
    return this._hairPath;
  }

  public set hairPath(hairPath: string) {
    this._hairPath = hairPath;
    this.notifyObservers();
  }

  private getDefaultGenderedHairPath(): string {
    return `${basePath}/hair/${this._gender}/${paths['hair'].gender[this._gender][0]}`;
  }
}

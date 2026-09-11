import { Subject } from "../types/observer";
import { EyeColorId, Gender, SkinColorId } from "../types/character";

export default class CharacterState extends Subject {
  private static _instance: CharacterState;

  private _eyeColorId: EyeColorId;
  private _skinColorId: SkinColorId;
  private _gender: Gender;

  private constructor(){
    super();
    this._eyeColorId = 1;
    this._skinColorId = 1;
    this._gender = 'girl';
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
    this._gender = gender;
    this.notifyObservers();
  }
}

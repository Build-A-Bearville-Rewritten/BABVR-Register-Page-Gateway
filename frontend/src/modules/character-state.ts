export default class CharacterState {
  private static _instance: CharacterState;

  private constructor(){}

  static getInstance(): CharacterState {
    if(!CharacterState._instance) {
      this._instance = new CharacterState();
    }

    return this._instance;
  }
}

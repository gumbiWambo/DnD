import { CharacterConnection } from "./character-connection";

let characterManager: CharacterManager
export class CharacterManager {
  public connections: CharacterConnection[] = [];
  constructor() {}

  public static getInstance(): CharacterManager {
    if(!characterManager) {
      characterManager = new CharacterManager();
    }
    return characterManager;
  }
}
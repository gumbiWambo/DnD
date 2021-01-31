import { CreatureCoordinate } from "./creature-coordinate";
import { MapField } from "./map-field";

export class Map {
  public fields: MapField[][] = [[]];
  public creatureCoordinates: CreatureCoordinate[];
  constructor(public id: string){
    this.creatureCoordinates = [];
  }
  public addCreatureCoordinate(newCoordinate: CreatureCoordinate) {
    if(!this.creatureCoordinates.find(x => x.characterName === newCoordinate.characterName)) {
      this.creatureCoordinates.push(newCoordinate);
    }
  }
}
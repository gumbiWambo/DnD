import { BehaviorSubject } from 'rxjs';
import { CreatureCoordinate, PlayerCoordinate } from "./creature-coordinate";
import { MapDrawer } from "./map-drawer";
import { MapField } from "./map-field";

export class Map {
  public fields: MapField[][] = [];
  public creatureCoordinates: CreatureCoordinate[];
  public drawer: MapDrawer;
  public fieldUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public coordinateUpdate: BehaviorSubject<CreatureCoordinate[]> = new BehaviorSubject<CreatureCoordinate[]>([]);
  constructor(public id: string){
    this.creatureCoordinates = [];
    this.drawer = new MapDrawer(this.fields);
  }
  public addCreatureCoordinate(newCoordinate: CreatureCoordinate) {
    if(!this.creatureCoordinates.find(x => x.characterName === newCoordinate.characterName) && !!newCoordinate.characterName) {
      this.creatureCoordinates.push(newCoordinate);
    }
  }
  public removeCreatureCoordinates(characterName: string): CreatureCoordinate | null {
    const index = this.creatureCoordinates.findIndex(x => x.characterName === characterName);
    if(index > -1) {
      const coords = this.creatureCoordinates[index];
      this.creatureCoordinates.splice(index, 1);
      this.coordinateUpdate.next(this.creatureCoordinates);
      return coords;
    }
    return null;
  }
  public interact(creatureName: string, data: any) {
    const position = this.creatureCoordinates.find(x => x.characterName === creatureName);
    if(!!position) {
      const withIn5Feet = this.within5Feet(position?.x, position?.y, data.coordinates.x, data.coordinates.y);
      if(!!withIn5Feet && !!this.fields[data.coordinates.y][data.coordinates.x].interact()) {
        this.fieldUpdate.next(this.fields);
      }
    }
  }
  public walk(data: 'west' | 'east' | 'north' | 'south' | 'westNorth' | 'eastNorth' | 'westSouth' | 'eastSouth', creatureName: string) {
    if(this.checkMovementIsPossible(data, creatureName)) {
      const actualPosition = this.creatureCoordinates.find(x => x.characterName === creatureName);
      if(!!actualPosition) {
        switch(data) {
          case 'west': 
            actualPosition.x -= 1;
          break;
          case 'east': 
            actualPosition.x += 1;
          break;
          case 'north':
            actualPosition.y -= 1;
          break;
          case 'south':
            actualPosition.y += 1;
          break;
          case 'westSouth':
            actualPosition.y += 1;
            actualPosition.x -= 1;
          break;
          case 'eastSouth':
            actualPosition.y += 1;
            actualPosition.x += 1;
          break;
          case 'westNorth':
            actualPosition.y -= 1;
            actualPosition.x -= 1;
          break;
          case 'eastNorth':
            actualPosition.y -= 1;
            actualPosition.x += 1;
          break;
          default: break;
        }
      }
    }
    this.coordinateUpdate.next(this.creatureCoordinates);
  }
  private checkMovementIsPossible(data: 'west' | 'east' | 'north' | 'south' | 'westNorth' | 'eastNorth' | 'westSouth' | 'eastSouth', creatureName: string): boolean {
    const actualPosition = this.creatureCoordinates.find(x => x.characterName === creatureName);
    if(!!actualPosition) {
      switch(data) {
        case 'west':
          return !(actualPosition.x - 1 <= -1)
          && this.fields[actualPosition.y][actualPosition.x - 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x - 1) && (coord.y === actualPosition.y));
        case 'east': 
          return !(actualPosition.x + 1 >= this.fields[0].length)
          && this.fields[actualPosition.y][actualPosition.x + 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x + 1) && (coord.y === actualPosition.y));
        case 'north':
          return !(actualPosition.y - 1 <= -1)
          && !!this.fields[actualPosition.y - 1][actualPosition.x].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x) && coord.y === (actualPosition.y - 1));
        case 'south':
          return !(actualPosition.y + 1 >= this.fields.length)
          && !!this.fields[actualPosition.y + 1][actualPosition.x].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x) && coord.y === (actualPosition.y + 1));
        case 'westNorth': 
          return !(actualPosition.y - 1 <= -1)
          && !(actualPosition.x - 1 <= -1)
          && !!this.fields[actualPosition.y - 1][actualPosition.x - 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x - 1) && coord.y === (actualPosition.y - 1));
        case 'eastNorth': 
          return !(actualPosition.y - 1 <= -1)
          && !(actualPosition.x + 1 >= this.fields[0].length)
          && !!this.fields[actualPosition.y - 1][actualPosition.x + 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x + 1) && coord.y === (actualPosition.y - 1));
        case 'eastSouth': 
          return !(actualPosition.y + 1 >= this.fields.length)
          && !(actualPosition.x + 1 >= this.fields[0].length)
          && !!this.fields[actualPosition.y + 1][actualPosition.x + 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x + 1) && coord.y === (actualPosition.y + 1));
        case 'westSouth': 
          return !(actualPosition.y + 1 >= this.fields.length)
          && !(actualPosition.x - 1 <= -1)
          && !!this.fields[actualPosition.y + 1][actualPosition.x - 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x - 1) && coord.y === (actualPosition.y + 1));
        default:
          return false;
      }
    }
    return false;
  }
  private within5Feet(x1: number, y1: number, x2: number, y2: number): boolean {
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
  }
}
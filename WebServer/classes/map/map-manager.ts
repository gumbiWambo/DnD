import { CharacterManager } from '../character/character-manager';
import { DrawConnectionMagager } from '../draw/draw-connection-manager';
import { PlayerCoordinate } from './creature-coordinate';
import { MapConnection } from './map-connection';
import { MapDrawer } from './map-drawer';
import { DungonCampFire, DungonDoor, DungonGround, DungonLever, DungonWall, MapField } from './map-field';
let mapManager: MapManager;
export class MapManager {
  private draw = DrawConnectionMagager.getInstance();
  private characterManager: CharacterManager = CharacterManager.getInstance();
  private map: MapField[][] = [];
  private connections: MapConnection[] = [];
  private creatureCoordinates: PlayerCoordinate[] = [];
  private mapDrawer: MapDrawer;
  constructor(){
    this.mapDrawer = new MapDrawer(this.map);
    this.mapDrawer.initiate(31, 31);
    this.mapDrawer.drawBorder();
    this.drawContent();
  }
  public static getInstance(): MapManager {
    if(!mapManager) {
      mapManager = new MapManager();
    }
    return mapManager
  }
  
  public addConnection(connection: MapConnection) {
    const foundConnection = this.connections.find(x => x.playerName === connection.playerName);
    if(!!foundConnection) {
      connection.socket.close();
    } else {
      const characterName = this.characterManager.connections.find(x => x.playerName == connection.playerName)?.character.name ?? '';
      const coords = {x: 1, y: 1};
      this.creatureCoordinates.push(new PlayerCoordinate(connection.playerName, characterName, coords.x, coords.y, this.draw.getPlayerColor(connection.playerName)));
      this.prepareSocket(connection);
      this.connections.push(connection);
    }
    this.sendCreatureCoordinates();
    this.sendMap();
  }
  public removeConnection(playerName: string) {
    const connectionIndex = this.connections.findIndex(x => x.playerName === playerName);
    const coordinatesIndex = this.creatureCoordinates.findIndex(x => x.playerName === playerName);
    if(connectionIndex > -1) {
      this.connections[connectionIndex].socket.close();
      this.connections.splice(connectionIndex, 1);
    }
    if(coordinatesIndex > -1) {
      this.creatureCoordinates.splice(coordinatesIndex, 1);
    }
  }

  private prepareSocket(connection: MapConnection) {
    connection.socket.on('close', () => {
      this.removeConnection(connection.playerName);
    })
    connection.socket.on('message', (data: string) => {
      const parsedData = JSON.parse(data);
      if(connection.isMaster) {
        this.masterMessage(parsedData);
      } else {
        this.playerMessage(parsedData, connection);
      }
    });
  }
  private masterMessage(data: any) {

  }
  private playerMessage(data: any, connection: MapConnection) {
    switch(data.command) {
      case 'interact':
      const position = this.creatureCoordinates.find(x => x.playerName === connection.playerName);
      if(!!position) {
        const withIn5Feet = this.within5Feet(position?.x, position?.y, data.coordinates.x, data.coordinates.y);
        if(!!withIn5Feet && !!this.map[data.coordinates.y][data.coordinates.x].interact()) {
          this.sendMap();
        }
      }
      break;
      case 'walk':
        this.walk(data.direction, connection.playerName);
      break;
    }
  }
  private drawContent() {

  }
  private drawCellLeft(offsetX: number = 0, offsetY: number = 0) {
    this.mapDrawer.drawHorizontalWall(1 + offsetX, 6 + offsetX, 4 + offsetY);
    this.mapDrawer.drawHorizontalWall(1 + offsetX, 6 + offsetX, 10 + offsetY);
    this.mapDrawer.drawVerticalWall(4 + offsetY, 10 + offsetY, 6 + offsetX);
  }
  private drawCellRight(offsetX: number = 0, offsetY: number = 0) {
    this.mapDrawer.drawHorizontalWall(23 + offsetX, 28 + offsetX, 4 + offsetY)
    this.mapDrawer.drawHorizontalWall(23 + offsetX, 28 + offsetX, 10 + offsetY)
    this.mapDrawer.drawVerticalWall(4 + offsetY, 10 + offsetY, 23 + offsetX);
  }

  private sendCreatureCoordinates() {
    this.sendAll(JSON.stringify({type: 'coordinates', data: this.creatureCoordinates}))
  }
  private sendMap() {
    this.sendAll(JSON.stringify({type: 'map', data: this.map}))
  }
  private sendAll(data: string) {
    this.connections.forEach(x => {
      x.socket.send(data);
    });
  }
  private walk(data: 'west' | 'east' | 'north' | 'south' | 'westNorth' | 'eastNorth' | 'westSouth' | 'eastSouth', creatureName: string) {
    if(!this.checkMovementIsPossible(data, creatureName)) {
      return;
    }
    const connection = this.connections.find(x => x.playerName === creatureName);
    if(!!connection) {
      connection.setTemporarySpeed(connection.temporarySpeed - 5);
    }
    const actualPosition = this.creatureCoordinates.find(x => x.playerName === creatureName);
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
      this.sendCreatureCoordinates();
    }
  }
  private checkMovementIsPossible(data: 'west' | 'east' | 'north' | 'south' | 'westNorth' | 'eastNorth' | 'westSouth' | 'eastSouth', creatureName: string): boolean {
    const actualPosition = this.creatureCoordinates.find(x => x.playerName === creatureName);
    if(!!actualPosition) {
      switch(data) {
        case 'west':
          return !(actualPosition.x - 1 < -1)
          && this.map[actualPosition.y][actualPosition.x - 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x - 1) && (coord.y === actualPosition.y));
        case 'east': 
          return !(actualPosition.x + 1 > this.map[0].length)
          && this.map[actualPosition.y][actualPosition.x + 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x + 1) && (coord.y === actualPosition.y));
        case 'north':
          return !(actualPosition.y - 1 < -1)
          && !!this.map[actualPosition.y - 1][actualPosition.x].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x) && coord.y === (actualPosition.y - 1));
        case 'south':
          return !(actualPosition.y + 1 > this.map.length)
          && !!this.map[actualPosition.y + 1][actualPosition.x].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x) && coord.y === (actualPosition.y + 1));
        case 'westNorth': 
          return !(actualPosition.y - 1 < -1)
          && !(actualPosition.x - 1 < -1)
          && !!this.map[actualPosition.y - 1][actualPosition.x - 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x - 1) && coord.y === (actualPosition.y - 1));
        case 'eastNorth': 
          return !(actualPosition.y - 1 < -1)
          && !(actualPosition.x + 1 >= this.map[0].length)
          && !!this.map[actualPosition.y - 1][actualPosition.x + 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x + 1) && coord.y === (actualPosition.y - 1));
        case 'eastSouth': 
          return !(actualPosition.y + 1 > this.map.length)
          && !(actualPosition.x + 1 >= this.map[0].length)
          && !!this.map[actualPosition.y + 1][actualPosition.x + 1].passableTarain
          && !this.creatureCoordinates.find(coord => coord.x === (actualPosition.x + 1) && coord.y === (actualPosition.y + 1));
        case 'westSouth': 
          return !(actualPosition.y + 1 > this.map.length)
          && !(actualPosition.x - 1 < -1)
          && !!this.map[actualPosition.y + 1][actualPosition.x - 1].passableTarain
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
import { CharacterManager } from '../character/character-manager';
import { DrawConnectionMagager } from '../draw/draw-connection-manager';
import { CreatureCoordinate } from './creature-coordinate';
import { MapConnection } from './map-connection';
import { MapDrawer } from './map-drawer';
import { DungonCampFire, DungonDoor, DungonGround, DungonLever, DungonWall, MapField } from './map-field';
let mapManager: MapManager;
export class MapManager {
  private draw = DrawConnectionMagager.getInstance();
  private characterManager: CharacterManager = CharacterManager.getInstance();
  private map: MapField[][] = [];
  private connections: MapConnection[] = [];
  private creatureCoordinates: CreatureCoordinate[] = [];
  private mapDrawer: MapDrawer;
  constructor(){
    this.mapDrawer = new MapDrawer(this.map);
    this.mapDrawer.initiate(30, 30);
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
      this.creatureCoordinates.push(new CreatureCoordinate(connection.playerName, characterName, 1, 1, this.draw.getPlayerColor(connection.playerName)));
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
    this.drawCellEnviornment();
    this.drawTreasureEnviornment();
  }
  private drawTreasureEnviornment() {
    const treasureChamberDoors: DungonDoor[] = [];
    treasureChamberDoors.push(this.mapDrawer.setDoor(14, 24, false, false));
    treasureChamberDoors.push(this.mapDrawer.setDoor(15, 24, false, false));
    treasureChamberDoors.forEach(door => door.locked = true);
    const levers: DungonLever[] = [];
    let leverOrder: number[] = [];
    const checkOrder = (): boolean => {
      return leverOrder.length === 6
        && leverOrder[0] === 5
        && leverOrder[1] === 3
        && leverOrder[2] === 1
        && leverOrder[3] === 4
        && leverOrder[4] === 6
        && leverOrder[5] === 2
    }
    const pushNumber = (leverNumber: number): boolean => {
      leverOrder.push(leverNumber);
      if(leverOrder.length === 6) {
        if(checkOrder()) {
          treasureChamberDoors.forEach(door => {
            door.locked = false;
            if(!door.passableTarain) {
              door.interact();
            }
          })
        } else {
          leverOrder = [];
          let counter = 0;
          const interval = setInterval(() => {
            if(counter % 2 === 0) {
              treasureChamberDoors.forEach(x => x.locked = true);
            } else {
              treasureChamberDoors.forEach(x => x.locked = false);
            }
            this.sendMap();
            ++counter;
            if(counter > 10) {
              clearInterval(interval);
            }
          }, 300)
        }
      }
      return true;
    }
    const lever1 = this.mapDrawer.setLever(13, 23, () => pushNumber(1), () => pushNumber(1));
    const lever2 = this.mapDrawer.setLever(11, 23, () => pushNumber(2), () => pushNumber(2));
    const lever3 = this.mapDrawer.setLever(18, 23, () => pushNumber(3), () => pushNumber(3));
    const lever4 = this.mapDrawer.setLever(12, 23, () => pushNumber(4), () => pushNumber(4));
    const lever5 = this.mapDrawer.setLever(17, 23, () => pushNumber(5), () => pushNumber(5));
    const lever6 = this.mapDrawer.setLever(16, 23, () => pushNumber(6), () => pushNumber(6));
  }
  private drawCellEnviornment() {
    this.drawCellLeft();
    this.drawCellLeft(0, 7);
    this.drawCellLeft(0, 14);
    this.drawCellRight()
    this.drawCellRight(0, 7);
    this.drawCellRight(0, 14);
    this.mapDrawer.drawHorizontalWall(7, 22, 24);
    this.mapDrawer.setCampFire(3, 7);
    this.mapDrawer.setCampFire(3, 14);
    this.mapDrawer.setCampFire(3, 21);
    this.mapDrawer.setCampFire(26, 7);
    this.mapDrawer.setCampFire(26, 14);
    this.mapDrawer.setCampFire(26, 21);
    
    const cellDoors: DungonDoor[] = [];
    cellDoors.push(this.mapDrawer.setDoor(6, 7, false, true));
    cellDoors.push(this.mapDrawer.setDoor(6, 14, false, true));
    cellDoors.push(this.mapDrawer.setDoor(6, 21, false, true));
    cellDoors.push(this.mapDrawer.setDoor(23, 7, false, true));
    cellDoors.push(this.mapDrawer.setDoor(23, 14, false, true));
    cellDoors.push(this.mapDrawer.setDoor(23, 21, false, true));
    cellDoors.forEach(door => door.locked = true);

    const action = (x: any): boolean => {
      cellDoors.forEach(door => {
        door.locked = false;
      });
      this.mapDrawer.drawHorizontalWall(7, 22, 4);
      return true;
    }
    const reverse = (x: any): boolean => {
      cellDoors.forEach(door => {
        if(door.passableTarain) {
          door.interact();
        }
        door.locked = true;
      });
      this.mapDrawer.drawHorizontalGround(7, 22, 4);
      return true;
    }
    this.mapDrawer.setLever(14, 2, action, reverse);
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
import { CharacterManager } from '../character/character-manager';
import { DrawConnectionMagager } from '../draw/draw-connection-manager';
import { CreatureCoordinate, PlayerCoordinate } from './creature-coordinate';
import { Map } from './map';
import { MapConnection } from './map-connection';
import { MapTransition } from './map.transition';
import { filter, map } from 'rxjs/operators';
let mapManager: MapManager;
export class MapManager {
  private draw = DrawConnectionMagager.getInstance();
  private characterManager: CharacterManager = CharacterManager.getInstance();
  private maps: Map[] = [];
  private mapTransitions: MapTransition[] = [];
  private connections: MapConnection[] = [];
  private creatureCoordinates: PlayerCoordinate[] = [];
  constructor() {
    this.maps.push(new Map('main'));
    this.maps.push(new Map('Left1'));
    this.maps.push(new Map('Left2'));
    this.maps.push(new Map('Left3'));
    this.maps.push(new Map('Right1'));
    this.maps.push(new Map('Right2'));
    this.maps.push(new Map('Right3'));
    this.maps.push(new Map('Floor'));
    this.mapTransitions.push(new MapTransition('main', 9, 3,'Left1', 0, 3));
    this.mapTransitions.push(new MapTransition('main', 9, 8,'Left2', 0, 3));
    this.mapTransitions.push(new MapTransition('main', 9, 12,'Left3', 0, 3));
    this.mapTransitions.push(new MapTransition('main', 0, 3,'Right1', 9, 3));
    this.mapTransitions.push(new MapTransition('main', 0, 8,'Right2', 9, 3));
    this.mapTransitions.push(new MapTransition('main', 0, 12,'Right3', 9, 3));
    this.mapTransitions.push(new MapTransition('main', 4, 16,'Floor', 17, 0));
    this.mapTransitions.push(new MapTransition('main', 5, 16,'Floor', 18, 0));

    // this.maps[0].drawer.drawBorder();
    this.drawContent();
    this.subscribeTransitions();
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
      this.prepareSocket(connection);
      this.connections.push(connection);
    }
    const mainMap = this.maps.find(x => x.id === 'main');
    if(!!mainMap) {
      const characterName = this.characterManager.connections.find(x => x.playerName === connection.playerName)?.character.name ?? '';
      const coords = {x: 1, y: 1};
      mainMap.addCreatureCoordinate(new PlayerCoordinate(connection.playerName, characterName, coords.x, coords.y, this.draw.getPlayerColor(connection.playerName)));
      this.loadMapForConnection(connection, mainMap.id);
      this.sendCreatureCoordinates(mainMap);
      this.sendMap(mainMap);
    }
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
  private subscribeTransitions() {
    this.maps.forEach(map => {
      map.coordinateUpdate.pipe(filter(coordinates => coordinates.length > 0)).subscribe(coordinates => {
        coordinates.forEach(coordinate => {
          const firstMapTransition = this.mapTransitions.find(transition => map.id === transition.first.id && transition.first.x === coordinate.x && transition.first.y === coordinate.y);
          const secondMapTransition = this.mapTransitions.find(transition => map.id === transition.second.id && transition.second.x === coordinate.x && transition.second.y === coordinate.y);
          if(!!firstMapTransition) {
            // to Second
            this.transferFromMapToMap(coordinate, firstMapTransition, map.id, firstMapTransition.second.id);
          } else if (!!secondMapTransition) {
            // to First
            this.transferFromMapToMap(coordinate, secondMapTransition, map.id, secondMapTransition.first.id);
          }
        });
      })
    });
  }
  private transferFromMapToMap(coordinate: CreatureCoordinate, transition: MapTransition, idOld: string, idNew: string) {
    const oldMap = this.maps.find(x => x.id === idOld);
    const newMap = this.maps.find(x => x.id === idNew);
    if(oldMap) {
      const coord = oldMap.removeCreatureCoordinates(coordinate.characterName);
      if(!!coord && newMap) {
        if(transition.first.id === idNew) {
          coord.x = transition.first.x;
          coord.y = transition.first.y;
        } else {
          coord.x = transition.second.x;
          coord.y = transition.second.y;
        }
        newMap.addCreatureCoordinate(coord);
        if(coordinate instanceof PlayerCoordinate) {
          const connection = this.connections.find(x => x.playerName === coordinate.playerName);
          if(connection) {
            this.loadMapForConnection(connection, idNew);
          }
        }
      }
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
    const characterName = this.characterManager.connections.find(x => x.playerName == connection.playerName)?.character.name ?? ''
    switch(data.command) {
      case 'interact':
        connection.loadedMap?.interact(characterName, data);
      break;
      case 'walk':
        connection.loadedMap?.walk(data.direction, characterName);
      break;
    }
  }
  private loadMapForConnection(connection: MapConnection, id: string) {
    const newMap = this.maps.find(x => x.id === id);
    if(newMap) {
      connection.unsubscribe();
      connection.fieldUpdateSubscription = newMap.fieldUpdate.subscribe(() => this.sendMap(newMap))
      connection.coordinateUpdateSubscription = newMap.coordinateUpdate.subscribe(() => this.sendCreatureCoordinates(newMap))
      connection.loadNewMap(newMap);
      this.sendMap(newMap);
      this.sendCreatureCoordinates(newMap);
    }
  }
  private drawContent() {
    this.drawMainMap();
    this.drawFloor();
    this.drawLeft();
    this.drawRight();
  }
  //#region DrawMaps
  private drawMainMap() {
    const mainMap = this.maps[0];
    mainMap.drawer.initiate(17, 10);
    mainMap.drawer.drawBorder();
    mainMap.drawer.setDoor(4,0, false, false);
    mainMap.drawer.setDoor(5,0, false, false);
    mainMap.drawer.setDoor(4, 16, false, false).locked = true;
    mainMap.drawer.setDoor(5, 16, false, false).locked = true;
    mainMap.drawer.setDoor(9, 3, false, true);
    mainMap.drawer.setDoor(9, 8, false, true);
    mainMap.drawer.setDoor(9, 12, false, true);
    mainMap.drawer.setDoor(0, 3, false, true);
    mainMap.drawer.setDoor(0, 8, false, true);
    mainMap.drawer.setDoor(0, 12, false, true);
  }
  private drawLeft() {
    this.drawLeft1();
    this.drawLeft2();
    this.drawLeft3();
  }
  private drawRight() {
    this.drawRight1();
    this.drawRight2();
    this.drawRight3();
  }
  private drawLeft1() {
    const left1 = this.maps[1];
    left1.drawer.initiate(10, 10);
    left1.drawer.drawBorder();
    left1.drawer.setDoor(0, 3, false, true);
    let openTheDoors = false;
    const leverReverse = (x: any) => {
      this.maps[0].drawer.drawHorizontalGround(1, 8, 14);
      this.maps[5].drawer.drawHorizontalGround(4, 4, 5);
      return true;
    }
    const leverAction = (x: any) => {
      this.maps[0].drawer.drawHorizontalWall(1, 8, 14);
      const lever2Action = (x: any) => {
        const lever3Action = (x: any) => {
          if(!!openTheDoors) {
            this.maps[0].fields[16][4].locked = false;
            this.maps[0].fields[16][5].locked = false;
          } else {
            openTheDoors = true
          }
          return true;
        }
        const lever3Reverse = (x: any) => {
          if(!!openTheDoors && !this.maps[0].fields[16][4].locked) {
            this.maps[0].fields[16][4].locked = true;
            this.maps[0].fields[16][5].locked = true;
          } else {
            openTheDoors = false;
          }
          return true;
        }
        this.maps[4].drawer.setLever(5, 4, lever3Action, lever3Reverse);
        this.maps[6].drawer.setLever(5, 4, lever3Action, lever3Reverse);
        return true;
      }
      const lever2Reverse = (x: any) => {
        return true;
      }
      this.maps[5].drawer.setLever(4, 5, lever2Action, lever2Reverse)
      return true;
    }

    left1.drawer.setLever(5, 4, leverAction, leverReverse);
  }
  private drawLeft2() {
    const left1 = this.maps[2];
    left1.drawer.initiate(10, 10);
    left1.drawer.drawBorder();
    left1.drawer.setDoor(0, 3, false, true);

  }
  private drawLeft3() {
    const left1 = this.maps[3];
    left1.drawer.initiate(10, 10);
    left1.drawer.drawBorder();
    left1.drawer.setDoor(0, 3, false, true);

  }
  private drawRight1() {
    const right1 = this.maps[4];
    right1.drawer.initiate(10, 10);
    right1.drawer.drawBorder();
    right1.drawer.setDoor(9, 3, false, true);
  }
  private drawRight2() {
    const right2 = this.maps[5];
    right2.drawer.initiate(10, 10);
    right2.drawer.drawBorder();
    right2.drawer.setDoor(9, 3, false, true);
  }
  private drawRight3() {
    const right3 = this.maps[6];
    right3.drawer.initiate(10, 10);
    right3.drawer.drawBorder();
    right3.drawer.setDoor(9, 3, false, true);
  }
  private drawFloor() {
    const floor = this.maps[7];
    floor.drawer.initiate(30, 30);
    floor.drawer.drawBorder();
    floor.drawer.setDoor(18, 0, false, false)
    floor.drawer.setDoor(17, 0, false, false)
  }
  //#endregion DrawMaps
  private sendCreatureCoordinates(map: Map) {
    this.sendToSameMap(map, JSON.stringify({type: 'coordinates', data: map.creatureCoordinates}))
  }
  private sendMap(map: Map) {
    this.sendToSameMap(map, JSON.stringify({type: 'map', data: map.fields}))
  }
  private sendToSameMap(map: Map, data: string) {
    this.connections.filter(x => x.loadedMap?.id === map.id).forEach(connection => {
      connection.socket.send(data);
    })
  }
}
import { CreatureCoordinate, PlayerCoordinate } from './creature-coordinate';
import { Map } from './map';
import { MapConnection } from './map-connection';
import { MapTransition } from './map.transition';
import { filter, map } from 'rxjs/operators';
import { DrawConnectionMagager } from '../../draw/draw-connection-manager';
import { CharacterManager } from '../../character/character-manager';
let mapManager: MapManager;
export class MapManager {
  private draw = DrawConnectionMagager.getInstance();
  private characterManager: CharacterManager = CharacterManager.getInstance();
  private maps: Map[] = [];
  private mapTransitions: MapTransition[] = [];
  private connections: MapConnection[] = [];
  private creatureCoordinates: PlayerCoordinate[] = [];
  constructor() {
    this.maps.push(new Map('mainHall'));
    this.maps.push(new Map('mainRing'));
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
    const mainMap = this.maps.find(x => x.id === 'mainHall');
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
  }
  //#region DrawMaps
  private drawMainMap() {
    const mainMap = this.maps[0];
    mainMap.drawer.initiate(17, 10);
    mainMap.drawer.drawBorder();
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
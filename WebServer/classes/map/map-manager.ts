import * as WebSocket from 'ws';
import { MapConnection } from './map-connection';
let mapManager: MapManager;
export class MapManager {
  private map: string[][] = [['']];
  private connection: MapConnection[] = [];
  constructor(){
    const x = [];
    for(let i = 0; i < 30; ++i) {
      const y = [];
      for(let j = 0; j < 30; ++j) {
          y.push('dungonGround');
      }
      x.push(y);
    }
    this.map = x;
    this.drawBorderWalls();
    this.drawWalls();
  }
  public static getInstance(): MapManager {
    if(!mapManager) {
      mapManager = new MapManager();
    }
    return mapManager
  }
  
  public addConnection(connection: MapConnection) {
    const foundConnection = this.connection.find(x => x.playerName === connection.playerName);
    if(!!foundConnection) {
      connection.socket.close();
    } else {
      this.prepareSocket(connection);
      this.connection.push(connection);
    }
    this.sendMap();
  }
  public removeConnection(playerName: string) {
    const index = this.connection.findIndex(x => x.playerName === playerName);
    if(index > -1) {
      this.connection[index].socket.close();
      this.connection.splice(index, 1);
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
        this.playerMessage(parsedData);
      }
    });
  }
  private masterMessage(data: any) {

  }
  private playerMessage(data: any) {
    switch(data.command) {

    }
    this.sendMap();
  }
  private sendMap() {
    this.connection.forEach(x => {
      x.socket.send(JSON.stringify({type: 'map', data: this.map}));
    });
  }
  private drawBorderWalls() {
    this.map[0] = this.map[0].map(x => 'dungonWall');
    this.map[this.map.length - 1] = this.map[this.map.length - 1].map(x => 'dungonWall');
    this.map.forEach((x) => {
      x[0] = 'dungonWall';
      x[x.length - 1] = 'dungonWall';
    });
  }
  private drawWalls() {
    this.drawHorizontalWall(1, 9, 4);
    this.drawHorizontalWall(1, 9, 11);
    this.drawVerticalWall(4, 11, 9);
    this.setCampFire(3, 8);

  }
  private drawHorizontalWall(x1: number, x2: number, y: number) {
    for(let i = x1; i <= x2; ++i) {
      this.map[y][i] = 'dungonWall';
    }
  }
  private drawVerticalWall(y1: number, y2: number, x:number) {
    for(let i = y1; i <= y2; ++i) {
      this.map[i][x] = 'dungonWall';
    }
  }
  private setCampFire(x: number, y: number) {
    this.map[y][x] = 'dungonGroundCampFire';
  }
}
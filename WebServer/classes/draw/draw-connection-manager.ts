import * as WebSocket from 'ws';
import { DrawConnection } from "./draw-connection"

let manager: DrawConnectionMagager
export class DrawConnectionMagager {
  private connections: DrawConnection[] = [];

  public static getInstance(): DrawConnectionMagager {
    if(!manager) {
      manager = new DrawConnectionMagager();
    }
    return manager;
  }

  public addConnection(connection: DrawConnection) {
    if(!this.connections.find(x => x.playerName === connection.playerName)) {
      this.prepareSocket(connection.webSocket, connection.playerName);
      this.connections.push(connection);
    } else {
      connection.webSocket.close();
    }
  }
  private removeConnection(playerName: string) {
    const index = this.connections.findIndex(x => x.playerName === playerName);
    if(index > -1) {
      this.connections.splice(index, 1);
    }
  }

  private prepareSocket(socket: WebSocket, playerName: string) {
    socket.on('message', (data) => {
      this.sendToAllSockets(data, playerName);
    });
    socket.on('close', () => this.removeConnection(playerName));
  }
  private sendToAllSockets(data: any, playerName: string) {
    this.connections.forEach(x => {
      if(x.playerName !== playerName) {
        x.webSocket.send(data);
      }
    })
  }
}
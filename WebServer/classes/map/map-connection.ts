import * as WebSocket from 'ws';
export class MapConnection {
  constructor(public playerName: string, public socket: WebSocket, public isMaster: boolean = false) {}

}
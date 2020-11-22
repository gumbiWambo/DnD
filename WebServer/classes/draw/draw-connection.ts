import * as WebSocket from 'ws';
export class DrawConnection{
  constructor(public playerName: string, public color: string, public webSocket: WebSocket) {}
}
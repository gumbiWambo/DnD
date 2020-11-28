import * as WebSocket from 'ws';
export class MapConnection {
  private speed: number = 0;
  public temporarySpeed: number = 0;
  constructor(public playerName: string, public socket: WebSocket, public isMaster: boolean = false) {}
  setSpeed(speed: number) {
    this.speed = speed
  }
  setTemporarySpeed(newSpeed: number) {
    if(this.temporarySpeed > newSpeed) {
      this.temporarySpeed = newSpeed;
    }
  }
  resetTemporarySpeed() {
    this.temporarySpeed = this.speed;
  }
}
import { Subscription } from 'rxjs';
import * as WebSocket from 'ws';
import { Map } from './map';
export class MapConnection {
  private speed: number = 0;
  public temporarySpeed: number = 0;
  public loadedMap: Map | null = null;
  public fieldUpdateSubscription: Subscription | null = null;
  public coordinateUpdateSubscription: Subscription | null = null;
  constructor(public playerName: string, public socket: WebSocket, public isMaster: boolean = false) {}
  public setSpeed(speed: number) {
    this.speed = speed
  }
  public setTemporarySpeed(newSpeed: number) {
    if(this.temporarySpeed > newSpeed) {
      this.temporarySpeed = newSpeed;
    }
  }
  public resetTemporarySpeed() {
    this.temporarySpeed = this.speed;
  }
  public loadNewMap(newMap: Map) {
    this.loadedMap = newMap;
  }
  public unsubscribe() {
    if(!!this.fieldUpdateSubscription) {
      this.fieldUpdateSubscription.unsubscribe();
    }
    if(!!this.coordinateUpdateSubscription) {
      this.coordinateUpdateSubscription.unsubscribe();
    }
  }
}
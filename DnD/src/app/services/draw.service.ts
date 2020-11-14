import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  public socket: BehaviorSubject<any>;
  public color: string;
  constructor(private webSocket: WebsocketService) {
  }

  public connect(playerName, color?) {
    this.color = !!color ? color : 'fuchsia'
    this.socket = this.webSocket.connect(environment.socketUrl + '?player=' + playerName +'&color=' + this.color.replace('#', ''));
  }

  public draw(x1: number, y1: number, x2: number, y2: number, color: string) {
    this.socket.next({
      x1,
      x2,
      y1,
      y2,
      color
    })
  }
  
}

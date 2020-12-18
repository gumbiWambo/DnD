import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  public socket: BehaviorSubject<any>;
  constructor(private webSocket: WebsocketService) {

  }
  public connect(playerName: string) {
    this.socket = this.webSocket.connect(environment.socketUrl + '?player=' + playerName + '&master=true');
    this.socket.pipe(tap(console.log)).subscribe()
  }
}

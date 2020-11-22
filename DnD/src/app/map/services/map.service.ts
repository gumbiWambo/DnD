import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map = new BehaviorSubject<string[][]>([['']]);
  public creaturePositions = new BehaviorSubject([{x: 1, y: 3, color: 'fuchsia'}]);

  constructor(private socketProvider: WebsocketService) {
  }
  public connect(playerName: string, isMaster: boolean){
    this.socketProvider.connect(environment.socketUrl + '?player=' + playerName + '&map=true'+ '&master=true').pipe(map(x => JSON.parse(x.data)), filter(x => x.type === 'map'),tap(x => this.map.next(x.data))).subscribe()
  }
}

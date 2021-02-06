import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map = new BehaviorSubject<string[][]>([['']]);
  public creaturePositions = new BehaviorSubject([{x: 1, y: 3, color: 'fuchsia', playerName: '', characterName: ''}]);
  private socket: BehaviorSubject<any>
  constructor(private socketProvider: WebsocketService) {
  }
  public connect(playerName: string, isMaster: boolean){
    this.socket = this.socketProvider.connect(environment.socketUrl + '?player=' + playerName + '&map=true');
    this.subscribeToSocket();
  }
  
  public interact(x: number, y: number) {
    this.socket.next({command: 'interact', coordinates: {x, y}})
  }
  public walk(direction: 'west' | 'east' | 'north' | 'south' | 'westNorth' | 'eastNorth' | 'westSouth' | 'eastSouth') {
    this.socket.next({command: 'walk', direction});
  }

  private subscribeToSocket() {
    const dataObserver = this.socket.pipe(map(x => JSON.parse(x.data))).subscribe(x => {
      if(x.type === 'map') {
        console.log('map', x.data);
        this.map.next(x.data)
      } else if (x.type === 'coordinates') {
        this.creaturePositions.next(x.data)
 
      }
    });
  }
}

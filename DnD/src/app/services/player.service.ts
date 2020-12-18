import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CharacterService } from './character.service';
import { DrawService } from './draw.service';
import { MapService } from '../map/services/map.service';
import { MasterService } from './master.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public playerName: string;
  constructor(private http: HttpClient, private character: CharacterService, private draw: DrawService, private map: MapService, private masterProvider: MasterService) {
    this.playerName = localStorage.getItem('player');
    this.connect(this.playerName, localStorage.getItem('master') === 'true', localStorage.getItem('playerColor'));
  }

  public createNewPlayer(name: string): Promise<any> {
    return this.http.post(environment.serverUrl + '/player', {name}, {responseType: 'text'}).toPromise();
  }
  public connect(playerName, master, color?) {
    if(playerName === null || playerName === 'null') {
      return null;
    }
    this.playerName = playerName;
    localStorage.setItem('player', this.playerName);
    localStorage.setItem('master', master);
    localStorage.setItem('playerColor', color);
    if(!master) {
      this.character.connect(playerName);
    } else {
      this.masterProvider.connect(playerName);
    }
    this.draw.connect(playerName, color);
    this.map.connect(playerName, false);
  }
  public logout() {
    localStorage.removeItem('player');
    localStorage.removeItem('playerColor');
    localStorage.removeItem('master');
    window.location.reload();
  }
  public getPlayer(playerName): Promise<any> {
    return this.http.get<any>(environment.serverUrl + '/player?name=' + playerName,).toPromise();
  }
}

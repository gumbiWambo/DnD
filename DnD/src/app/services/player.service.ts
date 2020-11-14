import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CharacterService } from './character.service';
import { DrawService } from './draw.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public playerName: string;
  constructor(private http: HttpClient, private character: CharacterService, private draw: DrawService) { }

  public createNewPlayer(name: string): Promise<any> {
    return this.http.post(environment.serverUrl + '/player', {name}, {responseType: 'text'}).toPromise();
  }
  public connect(playerName, color?) {
    if(!this.playerName) {
      this.playerName = playerName;
      this.character.connect(playerName);
      this.draw.connect(playerName, color);
    }
  }
}

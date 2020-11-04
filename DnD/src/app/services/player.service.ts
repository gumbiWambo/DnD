import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private http: HttpClient) { }

  public createNewPlayer(name: string) {
    this.http.post(environment.serverUrl + '/player', {name}, {responseType: 'text'}).toPromise();
  }
}

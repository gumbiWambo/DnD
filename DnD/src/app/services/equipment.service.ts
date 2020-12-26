import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) { }

  public getEquipment(): Promise<any> {
    return this.http.get<any>(environment.serverUrl + '/equipments').toPromise();
  }
}

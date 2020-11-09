import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Spell } from '../interfaces/spell';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpellsService {
  public spells: BehaviorSubject<Spell[]> = new BehaviorSubject<Spell[]>([]);
  
  constructor(private http: HttpClient) { }

  public getSpells(): Promise<Spell[]> {
    return this.http.get<Spell[]>(environment.serverUrl + '/spells').pipe(tap((x) => this.spells.next(x))).toPromise();
  }
  public createSpell(body: any): Promise<any> {
    return this.http.post(environment.serverUrl + '/spells', body, {responseType: 'text'}).toPromise();
  }
}

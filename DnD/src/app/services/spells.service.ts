import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Spell } from '../interfaces/spell';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CharacterService } from './character.service';

@Injectable({
  providedIn: 'root'
})
export class SpellsService {
  private spellClass: string;
  public spells: BehaviorSubject<Spell[]> = new BehaviorSubject<Spell[]>([]);
  
  constructor(private http: HttpClient, private character: CharacterService) {
    this.character.character.pipe(filter(x => !!x.spellCastingClass)).subscribe(x => {
      this.spellClass = x.spellCastingClass;
      this.getSpells();
    })
  }

  public getSpells(): Promise<Spell[]> {
    const query = !!this.spellClass ? '?class=' + this.spellClass : ''
    return this.http.get<Spell[]>(environment.serverUrl + '/spells' + query).pipe(tap((x) => this.spells.next(x))).toPromise();
  }
  public createSpell(body: {name: string, level: number, type: string, castingTime: string, components: string, duration: string, discription: string, range: string}): Promise<any> {
    return this.http.post(environment.serverUrl + '/spells', body, {responseType: 'text'}).toPromise();
  }
  public createClassSpells(className: string, spells: string[]): Promise<void>{
    return this.http.put<any>(environment.serverUrl + '/spellClass', {className, spells}).toPromise();
  }
}

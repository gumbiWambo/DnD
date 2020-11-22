import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  public class = new BehaviorSubject([
    'Bard',
    'Babarian',
    'Cleric',
    'Sorcerer',
    'Rogue',
    'Ranger',
    'Paladin',
    'Fighter',
    'Druid',
    'Wizard',
    'Warlock'
  ])

  constructor() { }
}

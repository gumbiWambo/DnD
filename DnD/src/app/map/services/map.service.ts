import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map = new BehaviorSubject<string[][]>([['']]);
  public creaturePositions = new BehaviorSubject([{x: 1, y: 3, color: 'fuchsia'}]);

  constructor() {
    const x = [];
    for(let i = 0; i < 10; ++i) {
      const y = [];
      for(let j = 0; j < 10; ++j) {
          y.push('dungonGround');
      }
      x.push(y);
    }
    x[0] = x[0].map(y => 'dungonWall');
    x[9] = x[9].map(y => 'dungonWall');
    x[2][7] = 'dungonGroundColumn'
    x[7][7] = 'dungonGroundColumn'
    x[4][4] = 'dungonGroundCampFire';
    x[4][9] = 'dungonGroundDoorClosed'
    x[3][9] = 'dungonWall'
    x[2][9] = 'dungonWall'
    x[1][9] = 'dungonWall'
    x[5][9] = 'dungonWall'
    x[6][9] = 'dungonWall'
    x[7][9] = 'dungonWall'
    x[8][9] = 'dungonWall'
    this.map.next(x);
  }
}

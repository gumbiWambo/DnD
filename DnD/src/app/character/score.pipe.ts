import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'score'
})
export class ScorePipe implements PipeTransform {

  transform(value: number, proficencyBonus = 0): number {
    return Math.floor((value - 10) /2) + proficencyBonus;
  }

}

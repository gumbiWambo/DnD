import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';

@Pipe({
  name: 'spellSearch'
})
export class SpellSearchPipe implements PipeTransform {

  transform(spells: Spell[], term: string, level: number): Spell[] {
    if(!!term) {
      spells = spells.filter(x => x.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
    }
    if(!!level || level === 0) {
      spells = spells.filter(x => x.level === level);
    }
    return spells;
  }

}

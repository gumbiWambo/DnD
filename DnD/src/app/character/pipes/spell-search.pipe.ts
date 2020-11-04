import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';

@Pipe({
  name: 'spellSearch'
})
export class SpellSearchPipe implements PipeTransform {

  transform(spells: Spell[], term: string): Spell[] {
    return term ? spells.filter(x => x.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())) : spells;
  }

}

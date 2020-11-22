import { Pipe, PipeTransform } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';

@Pipe({
  name: 'spellToString'
})
export class SpellToStringPipe implements PipeTransform {

  transform(value: Spell[]): unknown {
    return value.map(x => x.name);
  }

}

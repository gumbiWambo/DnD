import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpelllistComponent } from './spelllist/spelllist.component';
import { SpellComponent } from './spell/spell.component';
import { SpellToStringPipe } from './spell/spell-to-string.pipe';
import { SpellSearchPipe } from './pipes/spell-search.pipe';



@NgModule({
  declarations: [
    SpelllistComponent,
    SpellComponent,
    SpellToStringPipe,
    SpellSearchPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpelllistComponent,
    SpellToStringPipe,
    SpellSearchPipe
  ]
})
export class SpellModule { }

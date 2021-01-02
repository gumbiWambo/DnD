import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpelllistComponent } from './spelllist/spelllist.component';
import { SpellComponent } from './spell/spell.component';
import { SpellToStringPipe } from './spell/spell-to-string.pipe';
import { SpellSearchPipe } from './pipes/spell-search.pipe';
import { CreateSpellComponent } from './create-spell/create-spell.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SpelllistComponent,
    SpellComponent,
    SpellToStringPipe,
    SpellSearchPipe,
    CreateSpellComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SpelllistComponent,
    SpellToStringPipe,
    SpellSearchPipe,
    CreateSpellComponent
  ]
})
export class SpellModule { }

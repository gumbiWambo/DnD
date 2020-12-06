import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from './character/character.component';
import { HeaderComponent } from './header/header.component';
import { AbilityComponent } from './ability/ability.component';
import { SharedModule } from '../shared/shared.module';
import { EquipmentComponent } from './equipment/equipment.component';
import { PiecesComponent } from './pieces/pieces.component';
import { SpelllistComponent } from './spelllist/spelllist.component';
import { SpellComponent } from './spell/spell.component';
import { SpellSearchPipe } from './pipes/spell-search.pipe';
import { FormsModule } from '@angular/forms';
import { SkillsComponent } from './skills/skills.component';
import { ScorePipe } from './score.pipe';
import { NumberToStringPipe } from './number-to-string.pipe';
import { SkillComponent } from './skills/skill/skill.component';
import { SavingThorwsComponent } from './saving-thorws/saving-thorws.component';
import { MapModule } from '../map/map.module';

import { SpellToStringPipe } from './spell/spell-to-string.pipe';
import { EquipmentModule } from '../equipment/equipment.module';



@NgModule({
  declarations: [
    CharacterComponent,
    HeaderComponent,
    AbilityComponent,
    EquipmentComponent,
    PiecesComponent,
    SpelllistComponent,
    SpellComponent,
    SpellSearchPipe,
    SkillsComponent,
    ScorePipe,
    NumberToStringPipe,
    SkillComponent,
    SavingThorwsComponent,
    SpellToStringPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    MapModule,
    FormsModule,
    EquipmentModule
  ],
  exports: [
    CharacterComponent
  ]
})
export class CharacterModule { }

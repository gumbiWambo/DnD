import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterComponent } from './character/character.component';
import { HeaderComponent } from './header/header.component';
import { AbilityComponent } from './ability/ability.component';
import { SharedModule } from '../shared/shared.module';
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
import { CharacterRoutingModule } from './character-routing.module';



@NgModule({
  declarations: [
    CharacterComponent,
    HeaderComponent,
    AbilityComponent,
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
    EquipmentModule,
    CharacterRoutingModule
  ],
  exports: [
    CharacterComponent
  ]
})
export class CharacterModule { }

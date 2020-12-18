import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterComponent } from './master/master.component';
import { MasterRoutingModule } from './master-routing.module';
import { SpellModule } from '../spell/spell.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MasterComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SpellModule,
    FormsModule
  ]
})
export class MasterModule { }

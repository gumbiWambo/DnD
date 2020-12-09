import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollComponent } from './scroll/scroll.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { PiecesComponent } from './pieces/pieces.component';
import { ConsumableComponent } from './consumable/consumable.component';
import { ThingComponent } from './thing/thing.component';
import { SortPipe } from './pipes/sort/sort.pipe';



@NgModule({
  declarations: [
    ScrollComponent,
    EquipmentComponent,
    PiecesComponent,
    ConsumableComponent,
    ThingComponent,
    SortPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EquipmentComponent
  ]
})
export class EquipmentModule { }

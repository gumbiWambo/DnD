import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HexComponent } from './hex/hex.component';
import { SquareComponent } from './square/square.component';
import { DrawDirective } from './draw/draw.directive';
import { InsertCreatureInSquareDirective } from './insert-creature-in-square.directive';



@NgModule({
  declarations: [MapComponent, HexComponent, SquareComponent, DrawDirective, InsertCreatureInSquareDirective],
  imports: [
    CommonModule
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }

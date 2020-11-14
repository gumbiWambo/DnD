import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { HexComponent } from './hex/hex.component';
import { SquareComponent } from './square/square.component';
import { DrawDirective } from './draw/draw.directive';



@NgModule({
  declarations: [MapComponent, HexComponent, SquareComponent, DrawDirective],
  imports: [
    CommonModule
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabControlComponent } from './tab-control/tab-control.component';
import { TabDirective } from './tab.directive';



@NgModule({
  declarations: [TabControlComponent, TabDirective],
  imports: [
    CommonModule
  ],
  exports: [TabControlComponent, TabDirective]
})
export class SharedModule { }

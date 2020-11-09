import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabControlComponent } from './tab-control/tab-control.component';
import { TabDirective } from './tab.directive';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  declarations: [TabControlComponent, TabDirective, DialogComponent],
  imports: [
    CommonModule
  ],
  exports: [TabControlComponent, TabDirective, DialogComponent]
})
export class SharedModule { }

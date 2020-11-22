import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabControlComponent } from './tab-control/tab-control.component';
import { TabDirective } from './tab.directive';
import { DialogComponent } from './dialog/dialog.component';
import { ListClassComponent } from './list-class/list-class.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './list-class/filter.pipe';




@NgModule({
  declarations: [TabControlComponent, TabDirective, DialogComponent, ListClassComponent, FilterPipe],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [TabControlComponent, TabDirective, DialogComponent, ListClassComponent]
})
export class SharedModule { }

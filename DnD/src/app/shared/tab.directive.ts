import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[dndTab]'
})
export class TabDirective {
  @Input() dndTab: string;
  constructor(public element: ElementRef) { }

}

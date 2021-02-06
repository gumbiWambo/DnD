import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

  @Input() field: {type: string; rotation: number; locked: boolean, isOn: boolean} = {type: '', rotation: 0, locked: false, isOn: false}
  @Input() x: number = 0;
  @Input() y: number = 0;

  @HostBinding('class.locked') get locked(): boolean {
    return this.field.locked
  }
  @HostBinding('class.on') get on() {
    return this.field.isOn
  }

  constructor(public element: ElementRef) { }

  ngOnInit(): void {
  }

}

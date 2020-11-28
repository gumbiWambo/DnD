import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

  @Input() field: {type: string; rotation: number; locked: boolean} = {type: '', rotation: 0, locked: false}
  @Input() x: number = 0;
  @Input() y: number = 0;

  @HostBinding('class.locked') get locked(): boolean {
    return this.field.locked
  }

  constructor(public element: ElementRef) { }

  ngOnInit(): void {
  }

}

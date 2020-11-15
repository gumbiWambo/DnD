import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

  @Input() type: string = 'dungonGround';

  constructor(public element: ElementRef) { }

  ngOnInit(): void {
  }

}

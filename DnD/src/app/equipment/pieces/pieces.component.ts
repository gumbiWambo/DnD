import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-pieces',
  templateUrl: './pieces.component.html',
  styleUrls: ['./pieces.component.scss']
})
export class PiecesComponent implements OnInit {
  @Input() type: string = '';
  @Input() amount: number = 0
  constructor() { }
  
  ngOnInit(): void {
  }

}

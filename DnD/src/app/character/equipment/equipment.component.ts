import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dnd-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {

  @Input() name: string;
  @Input() amount: number;
  @Input() description: string
  @Output() use = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

}

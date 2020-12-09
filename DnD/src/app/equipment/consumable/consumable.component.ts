import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dnd-consumable',
  templateUrl: './consumable.component.html',
  styleUrls: ['./consumable.component.scss']
})
export class ConsumableComponent implements OnInit {
  public opend = false;
  @Input() name: string;
  @Input() amount: number;
  @Input() description: string
  @Output() use = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

}

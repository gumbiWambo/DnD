import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.scss']
})
export class ThingComponent implements OnInit {
  public opend = false;
  @Input() amount: number;
  @Input() name: string;
  @Input() description: string;

  constructor() { }

  ngOnInit(): void {
  }

}

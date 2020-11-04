import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dnd-ability',
  templateUrl: './ability.component.html',
  styleUrls: ['./ability.component.scss']
})
export class AbilityComponent implements OnInit {

  constructor() { }
  @Input() abilityName: string;
  @Input() abilityScore: number;
  ngOnInit(): void {
  }
}

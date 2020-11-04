import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dnd-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent implements OnInit {

  @Input() proficencyBonus: number = 0;
  @Input() abilityScore: number = 0;
  @Input() skill: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}

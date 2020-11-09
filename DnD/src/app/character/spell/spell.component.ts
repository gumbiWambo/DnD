import { Component, OnInit, Input } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';

@Component({
  selector: 'dnd-spell',
  templateUrl: './spell.component.html',
  styleUrls: ['./spell.component.scss']
})
export class SpellComponent implements OnInit {
  @Input() spell: Spell;
  @Input() open = false;
  constructor() { }

  ngOnInit(): void {
  }

}

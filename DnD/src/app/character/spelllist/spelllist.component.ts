import { Component, OnInit, Input } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';

@Component({
  selector: 'dnd-spelllist',
  templateUrl: './spelllist.component.html',
  styleUrls: ['./spelllist.component.scss']
})
export class SpelllistComponent implements OnInit {
  @Input() spells: Spell[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}

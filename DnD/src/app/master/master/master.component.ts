import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';
import { SpellsService } from 'src/app/services/spells.service';

@Component({
  selector: 'dnd-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  public spellSearchTerm = '';
  public spells: Spell[] = [];
  constructor(private spellProvider: SpellsService) {
    this.spellProvider.spells.subscribe(x => this.spells = x);
    this.spellProvider.getSpells();
  }

  ngOnInit(): void {
  }

}

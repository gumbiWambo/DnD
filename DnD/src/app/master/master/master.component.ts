import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';
import { EquipmentService } from 'src/app/services/equipment.service';
import { SpellsService } from 'src/app/services/spells.service';

@Component({
  selector: 'dnd-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  public spellSearchTerm = '';
  public spells: Spell[] = [];
  public equipments: any[] = [];
  constructor(private spellProvider: SpellsService, private equipmentProvider: EquipmentService) {
    this.spellProvider.spells.subscribe(x => this.spells = x);
    this.spellProvider.getSpells();
    this.equipmentProvider.getEquipment().then(x => this.equipments = x);
  }

  ngOnInit(): void {
  }

}

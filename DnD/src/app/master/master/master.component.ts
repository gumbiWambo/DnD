import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Spell } from 'src/app/interfaces/spell';
import { EquipmentService } from 'src/app/services/equipment.service';
import { MasterService } from 'src/app/services/master.service';
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
  public players: string[] = [];
  constructor(private spellProvider: SpellsService, private equipmentProvider: EquipmentService, private masterSocket: MasterService) {
    this.spellProvider.spells.subscribe(x => this.spells = x);
    this.spellProvider.getSpells();
    this.equipmentProvider.getEquipment().then(x => this.equipments = x);
    this.masterSocket.players.pipe(tap(console.log)).subscribe(x => this.players = x);
    this.masterSocket.character.subscribe(x => console.log(x));
  }

  ngOnInit(): void {
  }

}

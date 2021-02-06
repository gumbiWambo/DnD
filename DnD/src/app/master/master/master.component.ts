import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { from } from 'rxjs';
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
  public selectedPlayer: string = '';
  public opend = false;
  public character = null;
  constructor(private spellProvider: SpellsService, private equipmentProvider: EquipmentService, private masterSocket: MasterService) {
    this.spellProvider.spells.subscribe(x => this.spells = x);
    this.spellProvider.getSpells();
    this.equipmentProvider.getEquipment().then(x => this.equipments = x);
    this.masterSocket.players.subscribe(x => this.players = x);
    this.masterSocket.character.pipe().subscribe(x => this.character = x);
  }

  ngOnInit(): void {
  }
  public chooseCharacter(form: NgForm) {
    if(form.valid) {
      this.character = null;
      const telegramm = {
        command: 'chooseCharacter',
        playerName: form.controls.player.value
      }
      this.masterSocket.socket.next(telegramm);
    }
  }
  public updateEquipment(form: NgForm) {
    if(form.valid && !!this.character) {
      const command = !!form.controls.remove.value ? 'decreaseEquipment' : 'addEquipment'
      const telegramm = {
        command,
        playerName: this.character.player,
        equipment: {
          name: form.controls.equipmentName.value,
          amount: form.controls.amount.value
        }
      }
      this.masterSocket.socket.next(telegramm);
    }
  }
  public updateCurrency(form: NgForm) {
    if(form.valid && !!this.character) {
      Object.keys(form.controls).forEach(x => {
        form.controls[x].value
        this.masterSocket.socket.next({
          command: 'setCurrency',
          playerName: this.character.player,
          amount: form.controls[x].value,
          currency: x
        });
      })
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';
import { Spell } from 'src/app/interfaces/spell';
import { SpellsService } from 'src/app/services/spells.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'dnd-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  public character = {
    name: '',
    player: '',
    class: '',
    race: '',
    background: '',
    alignment: '',
    experience: 0,
    armorclass: 0,
    initiative: 0,
    speed: 0,
    hitpointMaximum: 0,
    strengthScore: 0,
    dexterityScore: 0,
    constitutionScore: 0,
    intelligenceScore: 0,
    wisdomScore: 0,
    charismaScore: 0,
    copperPieces: 0,
    siverPieces: 0,
    electrumPieces: 0,
    goldPieces: 0,
    platinPieces: 0,
    inspiration: false,
    spellcastingAbility: '',
    spellAttackBonus: 0,
    proficiencyBonus: 0,
    equipment: [
      {
        name: null,
        amount: null,
        description: null
      }
    ],
    proficiencys: {
      acrobatics: false,
      animalHandling: false,
      arcana: false,
      athletics: false,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: false,
      medicine: false,
      nature: false,
      perception: false,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: false,
      survival: false
    },
    savingThrows: {
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false
    }
  }
  public spells: Spell[] = [];
  public spellSearchTerm = '';
  private socket: BehaviorSubject<any>;
  constructor(private characterProvider: CharacterService, private spellProvider: SpellsService) { 
    this.characterProvider.character.subscribe(x => {
      this.character = x;
    });
    this.spellProvider.spells.subscribe(x => this.spells = x);
    this.spellProvider.getSpells();
  }

  ngOnInit(): void {
    
  }
  public useEquipment(equipment: string) {
    this.characterProvider.socket.next({command: 'useEquipment', payload: equipment});
  }

}

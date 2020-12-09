import { Component, OnInit } from '@angular/core';
import { Spell } from 'src/app/interfaces/spell';
import { SpellsService } from 'src/app/services/spells.service';
import { CharacterService } from 'src/app/services/character.service';
import { NgForm } from '@angular/forms';
import { PlayerService } from 'src/app/services/player.service';


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
    silverPieces: 0,
    electrumPieces: 0,
    goldPieces: 0,
    platinPieces: 0,
    inspiration: false,
    spellcastingAbility: '',
    spellCastingClass: '',
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
  constructor(private characterProvider: CharacterService, private spellProvider: SpellsService, private player: PlayerService) { 
    this.characterProvider.character.subscribe(x => {
      this.character = x;
    });
    this.spellProvider.spells.subscribe(x => this.spells = x);
  }

  ngOnInit(): void {
    
  }
  public logout() {
    this.player.logout();
  }
  


}

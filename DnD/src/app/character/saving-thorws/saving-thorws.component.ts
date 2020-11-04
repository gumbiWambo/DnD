import { Component, OnInit } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'dnd-saving-thorws',
  templateUrl: './saving-thorws.component.html',
  styleUrls: ['./saving-thorws.component.scss']
})
export class SavingThorwsComponent implements OnInit {
  savingThorws = {
    strength: false,
    dexterity: false,
    constitution: false,
    intelligence: false,
    wisdom: false,
    charisma: false
  }
  proficiencyBonus = 0;
  public abilityScores = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
  }
  constructor(private characterProvider: CharacterService) {
    this.characterProvider.abilityScores.subscribe(x => this.abilityScores = x);
    this.characterProvider.proficiencyBonus.subscribe(x => this.proficiencyBonus = x);
    this.characterProvider.savingThrows.subscribe(x => this.savingThorws = x);
  }

  ngOnInit(): void {
  }

}

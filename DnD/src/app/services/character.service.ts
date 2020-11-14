import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, tap, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  public character = new BehaviorSubject<any>({
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
  });
  public abilityScores = new BehaviorSubject({
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
  })
  public savingThrows = new BehaviorSubject({
    strength: false,
    dexterity: false,
    constitution: false,
    intelligence: false,
    wisdom: false,
    charisma: false
  })
  public skills = new BehaviorSubject({
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
  })
  public proficiencyBonus = new BehaviorSubject<number>(0);
  public socket: BehaviorSubject<any>;
  private socketSubsciptions: Subscription[] = [];
  constructor(private webSocket: WebsocketService) {
  }
  public connect(playerName: string) {
    this.socket = this.webSocket.connect(environment.socketUrl + '?player=' + playerName);
    const character = this.socket.pipe(map(x => JSON.parse(x.data)), share())
    character.subscribe(
      next => {
        this.character.next(next);
      },
      error => {
        console.error(error);
      },
      () => {

        console.info('Connection Closed');
      }
    );
    const abilityScore = character.pipe(share());
    this.socketSubsciptions.push(abilityScore.pipe(map(x => ({
      strength: x.strengthScore,
      dexterity: x.dexterityScore,
      constitution: x.constitutionScore,
      intelligence: x.intelligenceScore,
      wisdom: x.wisdomScore,
      charisma: x.charismaScore}))).subscribe(x => this.abilityScores.next(x)))
    const savingThrows = character.pipe(share());
    savingThrows.pipe(map(x => x.savingThrows)).subscribe(x => this.savingThrows.next(x));
    const proficiencysSkills = character.pipe(share());
    proficiencysSkills.pipe(map(x => x.proficiencys)).subscribe(x => this.skills.next(x));
    const proficiencysBonus = character.pipe(share());
    proficiencysBonus.pipe(map(x => x.proficiencyBonus)).subscribe(x => this.proficiencyBonus.next(x));
  }
}

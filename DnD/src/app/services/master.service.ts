import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  public socket: BehaviorSubject<any>;
  public players = new BehaviorSubject<Array<string>>(['']);
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
    temporaryHitpoints: 0,
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
    languages: [],
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
  constructor(private webSocket: WebsocketService) {

  }
  public connect(playerName: string) {
    this.socket = this.webSocket.connect(environment.socketUrl + '?player=' + playerName + '&master=true');
    const playersOnline = this.socket.pipe(map(x => JSON.parse(x.data))).subscribe(x => {
      switch(x.type) {
        case 'playerList': this.players.next(x.data); break;
        case 'character': this.character.next(x.data); break;
      }
    });
    // const choosenCharacter = this.socket.pipe(share());
    // choosenCharacter.pipe(map(x => JSON.parse(x.data)), filter(x => x.type === 'character')).subscribe(x => this.character.next(x));
  }
}

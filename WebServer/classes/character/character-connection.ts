import * as WebSocket from 'ws';
import { Character } from '../../interfaces/character';
import {Equipment} from '../equipment/equipment';
import { Database } from '../database';


export class CharacterConnection{
  public playerName: string = '';
  public socket: WebSocket;
  public characterChanged: (x :Character) => void = (x: Character) => {};
  private database = Database.getInstance();
  public character: Character = {
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
    tempoaryHitpoints: 0,
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
    equipment: [],
    languages: [],
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
    },
  };
  constructor(name: string, socket: WebSocket) {
    this.playerName = name;
    this.socket = socket;
    this.socket.on('message', (data: string) => {
      const commandFromSocket = JSON.parse(data);
      switch(commandFromSocket.command) {
        case 'useEquipment': this.useEquipment(commandFromSocket.payload); break;
        case 'updateCurrency': this.updateCurrency(commandFromSocket.payload.currency, commandFromSocket.payload.value); break;
        default: break;
      }
    });
    this.loadCharacter();
    this.sendCharacter();
  }
  public addEquipment(equipment: Equipment) {
    this.database.addEquipment(this.character.player, this.character.name, equipment).then(x => {
      this.character = x;
      this.sendCharacter();
    });
  }
  public decreaseEquipment(equipment: Equipment) {
    this.database.decreaseEquipment(this.character.player, this.character.name, equipment).then(x => {
      this.character = x;
      this.sendCharacter();
    })
  }
  private loadCharacter() {
    this.database.getCharacter(this.playerName).then((x) => {
      this.character = x;
      this.sendCharacter();
    }).catch(x => console.log(x));
  }
  private useEquipment(equipmentName: string): void {
    const equipment = new Equipment(equipmentName, 1, '', '', '');
    this.decreaseEquipment(equipment);
  }
  public updateCurrency(currency: string, value: number): void {
    let currencyUpdate: Promise<Character> = Promise.reject('woops');
    switch(currency) {
      case 'gold': currencyUpdate = this.database.updateGold(this.playerName, this.character.name, value); break;
      case 'copper': currencyUpdate = this.database.updateCopper(this.playerName, this.character.name, value); break;
      case 'silver': currencyUpdate = this.database.updateSilver(this.playerName, this.character.name, value); break;
      case 'platin': currencyUpdate = this.database.updatePlatin(this.playerName, this.character.name, value); break;
      case 'electrum': currencyUpdate = this.database.updateElectrum(this.playerName, this.character.name, value); break;
      default: this.sendCharacter();
    }
    currencyUpdate.then(x => {
      this.character = x;
      this.sendCharacter();
    }).catch((x) => console.log(x));
  }
  private sendCharacter() {
    this.characterChanged(this.character);
    this.socket.send(JSON.stringify(this.character));
  }
}
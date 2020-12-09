import * as WebSocket from 'ws';
import { Character } from '../../interfaces/character';
import { Backpack, Dagger, Equipment, Net, Ration, Rope, Scroll, SendingStone } from '../equipment/equipment';
import { Database } from '../database';
import { FinsterFrucht, GiraffenFrucht, MantelFrucht, ParamesiaFrucht, SwimSwimFriut, TrennTrennFrucht } from '../equipment/devil-friutes';

export class CharacterConnection{
  public playerName: string = '';
  public socket: WebSocket;
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
    const equipments = this.character.equipment;
    const foundEquipment = equipments.find(x => x.name === equipment.name);
    if(!foundEquipment) {
      equipments.push(equipment);
    } else {
      foundEquipment.amount += equipment.amount;
    }
    this.database.updateEquipment(this.character.player, this.character.name, equipments).then(x => {
      this.character = x;
      this.sendCharacter();
    });
  }
  public decreaseEquipment(equipment: Equipment) {
    const equipments = this.character.equipment;
    const index = equipments.findIndex((x) => x.name === equipment.name);
    if(index > -1) {
      if(equipments[index].amount <= equipment.amount) {
        equipments.splice(index, 1);
      } else {
        equipments[index].amount -= equipment.amount
      }
    }
    this.database.updateEquipment(this.character.player, this.character.name, equipments).then(x => {
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
  private useEquipment(equipment: string): void {
    const foundEquipment = this.character.equipment.find(x => x.name === equipment);
    if(!!foundEquipment) {
      foundEquipment.amount -= 1;
      if(foundEquipment.amount <= 0) {
        this.character.equipment.splice(this.character.equipment.findIndex(x => x.name === equipment), 1);
      }
      this.database.updateEquipment(this.character.player, this.character.name, this.character.equipment).then(x => {
        this.character = x;
        this.sendCharacter();
      });
    }
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
    this.socket.send(JSON.stringify(this.character));
  }
}
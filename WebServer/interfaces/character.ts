import { Equipment } from "./equipment";

export interface Character{
  name: string,
  player: string,
  class: string,
  race: string,
  background: string,
  alignment: string,
  experience: number,
  armorclass: number,
  initiative: number,
  speed: number,
  hitpointMaximum: number,
  tempoaryHitpoints: number,
  strengthScore: number,
  dexterityScore: number,
  constitutionScore: number,
  intelligenceScore: number,
  wisdomScore: number,
  charismaScore: number,
  copperPieces: number,
  siverPieces: number,
  electrumPieces: number,
  goldPieces: number,
  platinPieces: number,
  inspiration: boolean,
  spellcastingAbility: string,
  spellAttackBonus: number,
  proficiencyBonus: number,
  equipment: Equipment[],
  proficiencys: {
    acrobatics: boolean;
    animalHandling: boolean;
    arcana: boolean;
    athletics: boolean;
    deception: boolean;
    history: boolean;
    insight: boolean;
    intimidation: boolean;
    investigation: boolean;
    medicine: boolean;
    nature: boolean;
    perception: boolean;
    performance: boolean;
    persuasion: boolean;
    religion: boolean;
    sleightOfHand: boolean;
    stealth: boolean;
    survival: boolean;
  };
  savingThrows: {
    strength: boolean;
    dexterity: boolean;
    constitution: boolean;
    intelligence: boolean;
    wisdom: boolean;
    charisma: boolean;
  };
}
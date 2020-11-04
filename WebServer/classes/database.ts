import { Spell } from "../interfaces/spell";
import { Character } from "../interfaces/character";
import e = require("express");

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/dnd.db', (error: any) => {
  if (error) {
    console.error('Database not connected');
  }
});
let database: Database
export class Database {
  public static getInstance() {
    if(!database) {
      database = new Database();
    }
    return database;
  }
  insertPlayer(name: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      db.run(`INSERT INTO Player (Name)
      VALUES ('${name}')`, (error: any) => {
        if(error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  getSpells(): Promise<Spell[]> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`SELECT * FROM Spells`, (error: any, row: any) => {
          if(error) {
            console.log(error);
            reject(error);
          } else {
            resolve(this.toSpells(row));
          }
        });
      });
    });
  }

  public getCharacter(playerName: string): Promise<Character> {
    return new Promise((resolve, reject) => {
      if(!this.isSecureStirng(playerName)) {
        reject('Injection warning!');
      }
      db.serialize(() => {
        db.all(`SELECT 
        Class.Name as Class,
        Race.Name as Race,
        Background.Name as Backgound,
        Player.Name as Player,
        AbilityTypes.Name as SpellcastingAbility,
        Character.Name,
        Character.Alignment,
        Character.Experience,
        Character.Armorclass,
        Character.Initiative,
        Character.Speed,
        Character.HitPointMaximum,
        Character.StrengthScore,
        Character.DexterityScore,
        Character.ConstitutionScore,
        Character.IntelligenceScore,
        Character.WisdomScore,
        Character.CharismaScore,
        Character.CopperPieces,
        Character.SilverPieces,
        Character.ElectrumPieces,
        Character.GoldPieces,
        Character.PlatinPieces,
        Character.Inspiration,
        Character.SpellAttackBonus,
        Character.ProficiencyAcrobatics,
        Character.ProficiencyAnimalHandling,
        Character.ProficiencyArcana,
        Character.ProficiencyAthletics,
        Character.ProficiencyDeception,
        Character.ProficiencyHistory,
        Character.ProficiencyInsight,
        Character.ProficiencyIntimidation,
        Character.ProficiencyInvestigation,
        Character.ProficiencyMedicine,
        Character.ProficiencyNature,
        Character.ProficiencyPerception,
        Character.ProficiencyPerformance,
        Character.ProficiencyPersuasion,
        Character.ProficiencyReligion,
        Character.ProficiencySavingCharisma,
        Character.ProficiencySavingConstitution,
        Character.ProficiencySavingDexterity,
        Character.ProficiencySavingIntelligence,
        Character.ProficiencySavingStrength,
        Character.ProficiencySavingWisdom,
        Character.ProficiencySleightOfHand,
        Character.ProficiencyStealth,
        Character.ProficiencySurvival
        FROM Character 
        INNER JOIN Class ON Class.Key = Character.Class 
        INNER JOIN Race  ON Race.Key = Character.Race
        INNER JOIN Background ON Background.Key = Character.Background
        INNER JOIN Player ON Player.Key = Character.Player
        INNER JOIN AbilityTypes ON AbilityTypes.Key = Character.SpellcastingAbility
        WHERE Player.Name = '${playerName}'`, (error: any, row: any[]) => {
          if(error) {
            console.log(error);
            reject(error);
          } else {
            resolve(this.toCharacter(row[0]))
          }
        });
      });
    });
  }

  public updateGold(playerName: string, characterName: string, gold: number): Promise<Character> {
    return this.updateCurrency(playerName, characterName, 'GoldPieces', gold);
  }

  public updateSilver(playerName: string, characterName: string, silver: number): Promise<Character> {
    return this.updateCurrency(playerName, characterName, 'SilverPieces', silver);
  }

  public updateCopper(playerName: string, characterName: string, copper: number): Promise<Character> {
    return this.updateCurrency(playerName, characterName, 'CopperPieces', copper);
  }

  public updatePlatin(playerName: string, characterName: string, platin: number): Promise<Character> {
    return this.updateCurrency(playerName, characterName, 'PlatinPieces', platin);
  }

  public updateElectrum(playerName: string, characterName: string, electrum: number): Promise<Character> {
    return this.updateCurrency(playerName, characterName, 'ElectrumPieces', electrum);
  }
  private updateCurrency(playerName: string, characterName: string, currency: string, value: number): Promise<Character> {
    return new Promise<Character>(async (resolve, reject) => {
      console.log(playerName, characterName, currency, value, this.isSecureStirng(currency), this.isSecureStirng(playerName), this.isSecureStirng(characterName));
      if(playerName && characterName && currency && !Number.isNaN(Number(value)) && this.isSecureStirng(currency) && this.isSecureStirng(playerName) && this.isSecureStirng(characterName)){
        db.run(`UPDATE Character SET ${currency} = ${Number(value)}
        WHERE Player IN ( SELECT Player.Key FROM Player WHERE Player.Name = '${playerName}') AND Character.Name = '${characterName}'`,(error: any) => {
          if(error){
            console.error(error);
            reject(!!error);
          }
          this.getCharacter(playerName).then(x => {
            resolve(x);
          });
        });
      } else {
        reject('Parameters Invalid');
      }
    });
  }
  

  private isSecureStirng(guess: string): boolean {
    return !(guess.includes(';') || guess.includes('--') || guess.includes('DROP'));
  }

  private toCharacter(row: any): Character {
    return {
      name: row.Name,
      class: row.Class,
      race: row.Race,
      background: row.Backgound,
      player: row.Player,
      alignment: row.Alignment,
      armorclass: row.Armorclass,
      spellAttackBonus: row.SpellAttackBonus,
      initiative: row.Initiative,
      inspiration: row.Inspiration,
      wisdomScore: row.WisdomScore,
      strengthScore: row.StrengthScore,
      intelligenceScore: row.IntelligenceScore,
      charismaScore: row.CharismaScore,
      dexterityScore: row.DexterityScore,
      constitutionScore: row.ConstitutionScore,
      experience: row.Experience,
      copperPieces: row.CopperPieces,
      siverPieces: row.SilverPieces,
      goldPieces: row.GoldPieces,
      electrumPieces: row.ElectrumPieces,
      platinPieces: row.PlatinPieces,
      speed: row.Speed,
      spellcastingAbility: row.SpellcastingAbility,
      hitpointMaximum: row.HitPointMaximum,
      equipment: [
        {
          name: 'Ration',
          description: 'blub',
          amount: 10
        }
      ],
      proficiencyBonus: this.getProficiencyBonus(row.Experience),
      proficiencys: {
        acrobatics: Boolean(row.ProficiencyAcrobatics),
        animalHandling: Boolean(row.ProficiencyAnimalHandling),
        arcana: Boolean(row.ProficiencyArcana),
        athletics: Boolean(row.ProficiencyAthletics),
        deception: Boolean(row.ProficiencyDeception),
        history: Boolean(row.ProficiencyHistory),
        insight: Boolean(row.ProficiencyInsight),
        intimidation: Boolean(row.ProficiencyIntimidation),
        investigation: Boolean(row.ProficiencyInvestigation),
        medicine: Boolean(row.ProficiencyMedicine),
        nature: Boolean(row.ProficiencyNature),
        perception: Boolean(row.ProficiencyPerception),
        performance: Boolean(row.ProficiencyPerformance),
        persuasion: Boolean(row.ProficiencyPersuasion),
        religion: Boolean(row.ProficiencyReligion),
        sleightOfHand: Boolean(row.ProficiencySleightOfHand),
        stealth: Boolean(row.ProficiencyStealth),
        survival: Boolean(row.ProficiencySurvival),
      },
      savingThrows: {
        strength: Boolean(row.ProficiencySavingStrength),
        dexterity: Boolean(row.ProficiencySavingDexterity),
        constitution: Boolean(row.ProficiencySavingConstitution),
        intelligence: Boolean(row.ProficiencySavingIntelligence),
        wisdom: Boolean(row.ProficiencySavingWisdom),
        charisma: Boolean(row.ProficiencySavingCharisma)
      }
    };
  }
  
  private getProficiencyBonus(experience: number): number {
    if(experience < 2700) {
      return 2;
    } else if(experience < 34000) {
      return 3;
    } else if ( experience < 48000) {
      return 4;
    } else if(experience < 195000) {
      return 5;
    } else {
      return 6;
    }
  }

  private toSpells(rows: Array<any>): Spell[] {
    return rows.map(x => ({
      name: x.Name,
      level: x.Level,
      type: x.Type,
      castingTime: x.CastingTime,
      components: x.Components,
      duration: x.Duration,
      discription: x.Discription,
      range: x.Range,
    }));
  }
  // getPlayer(username: string, password: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     db.serialize(() => {
  //       db.all(`SELECT * FROM tblProfiles WHERE szName='${username}' and nPassword='${password}'`, (error: any, row: any) => {
  //         if(error) {
  //           console.log(error);
  //         } else {
  //           resolve(row);
  //         }
  //       });
  //     });
  //   });
  // }
  // insertProfile(name: string, password: string, email: string): Promise<boolean> {
  //   return new Promise<boolean>(async (resolve, reject) => {
  //     if(!await this.checkNameAndEmail(name, email)){
  //       console.log(name, password, email);
  //       db.run(`INSERT INTO tblProfiles (szName, nPassword, szPicType, szEmail, nExperience, PicPath, LanguageLink, szSecret)
  //       VALUES ('${name}', '${password}', '.jpg', '${email}', 10, 'pic', 1, 'hdfsdfhjklasdfhjkl')`,(error: any) => {
  //         if(error){
  //           console.error(error);
  //           reject(!!error);
  //         }
  //         resolve(true);
  //       });
  //     } else {
  //       reject('Username or Email are in use!');
  //     }
  //   });
  // }
  // private checkNameAndEmail(name: string, email: string): Promise<boolean> {
  //   return new Promise<boolean>((resolve, reject) => {
  //     db.all(`SELECT * FROM tblProfiles WHERE szName='${name}' or szEmail='${email}'`, (error: any, rows: Array<any>) => {
  //       if(error) {
  //         console.log(error);
  //         reject(error);
  //       } else {
  //         if(rows.length > 0) {
  //           resolve(true)
  //         }
  //         resolve(false);
  //       }
  //     });
  //   });
  // }
}
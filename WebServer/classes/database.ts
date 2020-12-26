import { Spell } from "../interfaces/spell";
import { Character } from "../interfaces/character";
import { Language } from "../interfaces/language";
import { Equipment } from "./equipment/equipment";
import { resolve } from "path";

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
  public getEquipments(): Promise<Array<Equipment>> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`SELECT Equipment.Name, Equipment.Discription, Equipment.Weight, Equipment.Price, EquipmentTypes.Name as Type, Equipment.Properties FROM Equipment
        JOIN EquipmentTypes ON EquipmentTypes.key = Equipment.Type`, (error: any, row: Array<any>) => {
          if(error) {
            console.log('ERROR')
            reject(error);
          }
          resolve(this.toEquipment(row));
        });
      });
    });
  }
  public getPlayer(name: string): Promise<{name: string, master: boolean}> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`SELECT * FROM Player WHERE Player.Name = '${name}'`, (error: any, row: any) => {
          if(error) {
            console.log(error);
            reject(error);
          } else {
            resolve({name: row[0].Name, master: row[0].master});
          }
        });
      });
    });
  }
  public insertPlayer(name: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      db.run(`INSERT INTO Player (Name, master)
      VALUES ('${name}', 0)`, (error: any) => {
        if(error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
  public insertSpellClass(className: string, spellNames: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(className && spellNames) {
        const spellWhere = 'Name = "' + spellNames.join('" OR Name = "') + '"';
        db.serialize(() => {
          db.all(`SELECT nKey FROM Spells WHERE ` + spellWhere, (error: any, spellKeys: {nKey: number}[]) => {
            if(error) {
              console.log(error);
              reject(error);
            } else {
              db.all(`SELECT Key FROM Class WHERE Name = '${className}'`, (error: any, classKey: {Key: number}[]) => {
                if(error) {
                  console.log(error);
                  reject(error);
                } else {
                  let values: string = '';
                  spellKeys.map(x => x.nKey).forEach(x => {
                    values += `(${classKey[0].Key}, ${x}), `;
                  });
                  db.run(`INSERT INTO SpellClass (Class, Spell)
                          VALUES ` + values.substring(0, values.length - 2), (error: any) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve();
                    }
                  });
                }
              });
            }
          });
        });
      } else {
        reject('Wrong parameters')
      }
    });
  }

  public insertSpell(name: string, level: number, type: string, castingTime: string, components: string, duration: string, disctiption: string, range: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(name && type && castingTime && components && duration && disctiption && range && level >= 0 && level <= 9) {
        db.run(`INSERT INTO Spells (Name, Level, Type, CastingTime, Components, Duration, Discription, Range)
                VALUES ("${name}", ${level}, "${type}", "${castingTime}", "${components}", "${duration}", "${disctiption}", "${range}")`, (error: any) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        reject('Wrong parameters')
      }
    });
  }

  public getSpells(classDnd?: string): Promise<Spell[]> {
    const classWhere = !!classDnd ? `        JOIN SpellClass on Spells.nKey = SpellClass.Spell
    JOIN Class on Class.Key = SpellClass.Class AND Class.Name = "${classDnd}"` : ''
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`Select
        Spells.Name,
        Spells.Discription,
        Spells.Duration,
        Spells.CastingTime,
        Spells.Level,
        Spells.Range,
        Spells.Components,
        Spells.Type
        From Spells
        ${classWhere}`, (error: any, row: any) => {
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
        Character.ProficiencySurvival,
        Character.Equipment,
        SpellCastingClass.Name as SpellClass
        FROM Character 
        INNER JOIN Class ON Class.Key = Character.Class 
        INNER JOIN Race  ON Race.Key = Character.Race
        INNER JOIN Background ON Background.Key = Character.Background
        INNER JOIN Player ON Player.Key = Character.Player
        INNER JOIN AbilityTypes ON AbilityTypes.Key = Character.SpellcastingAbility
        INNER JOIN Class as SpellCastingClass on SpellCastingClass.Key = Character.SpellCastingClass
        WHERE Player.Name = '${playerName}'`, async (error: any, row: any[]) => {
          if(error) {
            console.log(error);
            reject(error);
          } else {
            resolve(await this.toCharacter(row[0]))
          }
        });
      });
    });
  }
  public async addEquipment(playerName: string,characterName: string, equipment: Equipment): Promise<Character> {
    const equipmentFromChar = await this.getEquipmentForCharacter(characterName);
    const equipmentExists: boolean = !!equipmentFromChar.find(x => x.name === equipment.name);
    const updateQuery = `UPDATE CharacterEquipment SET Amount = Amount + ${equipment.amount}
    WHERE 1 = 1
    AND equipment IN (select Equipment.key from Equipment  Where Equipment.Name = '${equipment.name}')
    AND character IN (
    SELECT Character.key from Character
    WHERE Character.Name = '${characterName}'
    );`;
    const insertQuery = `INSERT INTO characterEquipment (character, equipment, amount)
    VALUES ((SELECT Character.Key FROM Character WHERE Character.Name = '${characterName}'),
    (SELECT Equipment.key FROM Equipment WHERE Equipment.Name = '${equipment.name}'), ${equipment.amount});`;
    return new Promise((resolve, reject) => {
      db.run(!!equipmentExists? updateQuery : insertQuery, (error: any, row: any) => {
        if(error) {
          reject(error);
        }
        this.getCharacter(playerName).then(x => resolve(x));
      })
    });
  }
  public async decreaseEquipment(playerName: string, characterName: string, equipment: Equipment): Promise<Character> {
    const equipmentFromChar = await this.getEquipmentForCharacter(characterName);
    const existingEquipment = equipmentFromChar.find(x => x.name === equipment.name);
    const updateQuery = `
    UPDATE characterEquipment SET Amount = Amount - ${equipment.amount}
    WHERE 1 = 1
    AND equipment IN (select Equipment.key from Equipment  Where Equipment.Name = '${equipment.name}')
    AND character IN (
    SELECT Character.key from Character
    WHERE Character.Name = '${characterName}'
    );`;
  const deleteQuery = `
  DELETE FROM CharacterEquipment 
  WHERE character IN  (SELECT Character.Key FROM Character WHERE Character.Name = '${characterName}')
  AND equipment IN (SELECT Equipment.key FROM Equipment WHERE Equipment.Name = '${equipment.name}');`;
    return new Promise((resolve, reject) => {
      if(!!existingEquipment) {
        const deleteIt = existingEquipment.amount <= equipment.amount
        db.run(deleteIt ? deleteQuery : updateQuery, (error: any, row: any) => {
          if(error) {
            reject(error);
          }
          this.getCharacter(playerName).then(x => resolve(x))
        });
      } else {
        reject('No equipment found');
      }
    });

  }

  public updateEquipment(playerName: string, characterName: string, equipment: Equipment[]) {
    return new Promise<Character>(async (resolve, reject) => {
      if(playerName && characterName && Array.isArray(equipment) && this.isSecureStirng(playerName) && this.isSecureStirng(characterName)){
        db.run(`UPDATE Character SET Equipment = '${JSON.stringify(equipment)}'
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

  private async toCharacter(row: any): Promise<Character> {
    if(!row) {
      return {
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
        spellAttackBonus: 0,
        spellCastingClass: '',
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
    }
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
      silverPieces: row.SilverPieces,
      goldPieces: row.GoldPieces,
      electrumPieces: row.ElectrumPieces,
      platinPieces: row.PlatinPieces,
      speed: row.Speed,
      spellcastingAbility: row.SpellcastingAbility,
      spellCastingClass: row.SpellClass,
      hitpointMaximum: row.HitPointMaximum,
      tempoaryHitpoints: row.HitPointMaximum,
      equipment: await this.getEquipmentForCharacter(row.Name),
      proficiencyBonus: this.getProficiencyBonus(row.Experience),
      languages: await this.getCharacterLanguages(row.Race, row.Player),
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

  private getCharacterLanguages(race: string, playerName: string): Promise<Language[]> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`SELECT Languages.Name, Languages.TypicalSpeakers, Languages.Script, Languages.exotic FROM LanguageRace
        INNER JOIN Race on LanguageRace.race = Race.Key AND Race.Name = '${race}'
        INNER JOIN Languages on LanguageRace.language = Languages.key`, (error: any, raceLanguages: any[]) => {
          if(error) {
            console.log(error);
            reject(error);
          } else {
            db.all(`SELECT Languages.Name, Languages.TypicalSpeakers, Languages.Script, Languages.exotic FROM CharacterLanguage
            INNER JOIN Languages on CharacterLanguage.language = Languages.key
            INNER JOIN Character on CharacterLanguage.character = Character.Key
            INNER JOIN Player on Player.Key = Character.Player
            WHERE Player.Name = '${playerName}'`, (error: any, row: any[]) => {
              if(error) {
                console.log(error);
                reject(error);
              } else {
                const languages = [...raceLanguages, ...row];
                resolve(languages.map(x => ({name: x.Name, script: x.Script, typicalSpeakers: x.TypicalSpeakers, exotic: Boolean(x.exotic)})))
              }
            });
          }
        });
      });
    })
  }
  private getEquipmentForCharacter(characterName: string): Promise<Array<Equipment>> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`SELECT 
        Amount,
        Equipment.Name,
        Equipment.Discription,
        Equipment.Weight,
        Equipment.Properties,
        Equipment.Price,
        EquipmentTypes.Name as Type
        FROM CharacterEquipment
        JOIN Character on Character.Key = CharacterEquipment.character AND Character.Name = '${characterName}'
        JOIN Equipment on Equipment.key = CharacterEquipment.equipment
        JOIN EquipmentTypes on EquipmentTypes.key = Equipment.Type`, (error: any, row: any[]) => {
          if(error) {
            reject(error)
          }
          resolve(this.toEquipment(row))
        });
      });
    });
  }
  private toEquipment(rows: Array<any>): Equipment[] {
    return rows.map(x => ({
      name: x.Name,
      description: x.Discription,
      amount: x.amount,
      type: x.Type
    }));
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
      range: x.Range
    }));
  }

}
export class CreatureCoordinate {
  constructor(public characterName: string, public x: number, public y: number, public color: string) {

  }
}
export class PlayerCoordinate extends CreatureCoordinate{
  constructor(public playerName: string, characterName: string, x: number, y: number, color: string) {
    super(characterName, x, y, color);
  }
}
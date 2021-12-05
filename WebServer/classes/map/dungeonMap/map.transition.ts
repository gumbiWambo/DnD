export class MapTransition {
  public first: TransitionCoordinates;
  public second: TransitionCoordinates;
  constructor(firstId: string,firstX: number, firstY: number, secondId: string, secondX: number, secondY: number) {
    this.first = new TransitionCoordinates(firstId, firstX, firstY);
    this.second = new TransitionCoordinates(secondId, secondX, secondY);
  }
}
export class Coordinate {
  constructor(public x: number, public y: number) {}
}
export class TransitionCoordinates extends Coordinate {
  constructor(public id: string, x: number, y: number) {
    super(x, y);
  }
}
import { Geometry } from "../geometry";

export class Polygon extends Geometry<Array<number>> {
  constructor() {
    super();
    this.type = 'Polygon';
  }
}
import { Geometry } from "../geometry";

export class MultiPolygon extends Geometry<Array<Array<Array<number>>>> {
  constructor() {
    super();
    this.type = 'MultiPolygon';
  }
}
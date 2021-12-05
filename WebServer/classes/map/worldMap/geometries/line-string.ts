import { Geometry } from "../geometry";

export class LineString extends Geometry<number> {
  constructor() {
    super();
    this.type = 'LineString';
  }
}
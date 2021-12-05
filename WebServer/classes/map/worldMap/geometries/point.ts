import { Geometry } from "../geometry";

export class Point extends Geometry<number> {
  constructor() {
    super();
    this.type = 'Point';
  }
}
import { MapField } from "./map-field";

export class Map {
  public fields: MapField[][] = [[]];
  constructor(public id: string){}
}
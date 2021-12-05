import { GeoJson } from "./geo-json";

export class Geometry<T> extends GeoJson {
  public coordinates: Array<T> = [];
  public properties: {[key: string]: string | number} = {};
  constructor() {
    super();
  }
}
import { GeoJson } from "./geo-json";
import { Geometry } from "./geometry";

export class GeometryCollection extends GeoJson{
  public geometries: Array<Geometry<any>> = [];
  constructor() {
    super();
    this.type = 'GeometryCollection';
  }
}
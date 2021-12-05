import { GeoJson } from "./geo-json";
import { GeoTransform } from "./geo-transform";
import { GeometryCollection } from "./geometry-collection";

export class Topology extends GeoJson {
  private arcs: Array<Array<Array<number>>> = [];
  private transform: GeoTransform = new GeoTransform();
  private objects: {[key: string]: GeometryCollection} = {};
  constructor() {
    super();
    this.type = 'Topology';
    this.transform.scale.push(1, 1);
    this.transform.translate.push(0, 0);
  }
}
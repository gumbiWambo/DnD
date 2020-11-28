import { DungonGround, DungonWall, MapField } from "./map-field";

export class MapDrawer{
  constructor(private map: MapField[][]){}
  public initiate(height: number, length: number) {
    for(let i = 0; i < height; ++i) {
      const y = [];
      for(let j = 0; j < length; ++j) {
          y.push(new DungonGround());
      }
      this.map.push(y);
    }
  }
  public drawBorder() {
    this.map[0] = this.map[0].map(x => new DungonWall());
    this.map[this.map.length - 1] = this.map[this.map.length - 1].map(x => new DungonWall());
    this.map.forEach((x) => {
      x[0] = new DungonWall();
      x[x.length - 1] = new DungonWall();
    });
  }
  public drawHorizontalWall(x1: number, x2: number, y: number) {
    for(let i = x1; i <= x2; ++i) {
      this.map[y][i] = new DungonWall();
    }
  }
}
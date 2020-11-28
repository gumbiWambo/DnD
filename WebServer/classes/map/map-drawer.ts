import { DungonCampFire, DungonDoor, DungonGround, DungonLever, DungonWall, MapField } from "./map-field";

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
  public drawVerticalWall(y1: number, y2: number, x:number) {
    for(let i = y1; i <= y2; ++i) {
      this.map[i][x] = new DungonWall();
    }
  }
  public drawHorizontalGround(x1: number, x2: number, y: number) {
    for(let i = x1; i <= x2; ++i) {
      this.map[y][i] = new DungonGround();
    }
  }
  public drawVerticalGround(y1: number, y2: number, x:number) {
    for(let i = y1; i <= y2; ++i) {
      this.map[i][x] = new DungonGround();
    }
  }
  public setCampFire(x: number, y: number) {
    this.map[y][x] = new DungonCampFire();
  }
  public setDoor(x: number, y: number, opened = false , vertical = false): DungonDoor {
    const door = new DungonDoor(opened);
    door.rotation = vertical ? 90 : 0;
    this.map[y][x] = door;
    return door;
  }
  public setLever(x: number, y: number, action: (parameter:any) => boolean, reverse: (parameter: any) => boolean) {
    const lever = new DungonLever(action, reverse);
    this.map[y][x] = lever;
  }
}
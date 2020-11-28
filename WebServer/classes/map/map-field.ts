export abstract class  MapField {
  public rotation: number = 0;
  public locked: boolean = false;
  constructor(public type: string, public passableTarain: boolean, public speedNeeded: number) {}
  public interact(parameter?: any): boolean {return false;}
}
export class DungonGround extends MapField{
  constructor() {
    super('dungonGround', true, 5);
  }
}
export class DungonWall extends MapField{
  constructor() {
    super('dungonWall', false, 0);
  }
}
export class DungonCampFire extends MapField{
  constructor() {
    super('dungonGroundCampFire', true, 5);
  }
}

export class DungonDoor extends MapField {
  constructor(private opened = false) {
    super('dungonDoor' + (opened ? 'Opened' : 'Closed'), opened, 5);
    this.passableTarain = opened;
  }
  interact(): boolean {
    if(!this.locked) {
      this.opened = !this.opened;
      this.passableTarain = this.opened;
      this.type = 'dungonDoor' + (this.opened ? 'Opened' : 'Closed');
    }
    return !this.locked;
  }
}
export class DungonLever extends MapField {
  private isOn = false;
  constructor(private action: (...parameters: any[]) => boolean, private reverse: (...parameters: any[]) => boolean) {
    super('dungonGroundLever', true, 5);
  }
  interact(parameter?: any): boolean {
    this.isOn = !this.isOn;
    if(this.isOn) {
      return this.action(parameter);
    } else {
      return this.reverse(parameter);
    }
  }
}

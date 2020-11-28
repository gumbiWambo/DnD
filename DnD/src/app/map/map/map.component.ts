import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';

@Component({
  selector: 'dnd-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map: Array<Array<string>> = [['']];
  public isHex = false;
  public drawMode = false;
  constructor(private mapProvider: MapService) { }
  @HostBinding('class') get hostClass () {
    return this.isHex ? 'hex' : 'square'
  }
  @HostListener('window:keyup', ['$event']) walk($event: KeyboardEvent) {
    switch($event.key) {
      case 'w': this.mapProvider.walk('north'); break;
      case 'a': this.mapProvider.walk('west'); break;
      case 's': this.mapProvider.walk('south'); break;
      case 'd': this.mapProvider.walk('east'); break;
      case 'q': this.mapProvider.walk('westNorth'); break;
      case 'e': this.mapProvider.walk('eastNorth'); break;
      case 'y': this.mapProvider.walk('westSouth'); break;
      case 'x': this.mapProvider.walk('eastSouth'); break;
    }
  }

  ngOnInit(): void {
    this.mapProvider.map.subscribe(x => this.setMap(x));
  }
  public getTranslateAttribute(i: number, j: number): string {
    return `translate(${65 * i}, ${j * 85})`;
  }

  private setMap(data: Array<Array<string>>) {
    this.map = data;
    this.setCssVariable('--mapRows', data.length);
    this.setCssVariable('--mapCols', data[0].length);
  }
  private setCssVariable(variableName: string, amount: number) {
    document.documentElement.style.setProperty(variableName, `${amount}`);
  }
}

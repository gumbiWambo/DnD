import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map: Array<Array<string>> = [['']];
  public isHex = false;
  constructor() { }
  @HostBinding('class') get hostClass () {
    return this.isHex ? 'hex' : 'square'
  }

  ngOnInit(): void {
    const x = [];
    for(let i = 0; i < 10; ++i) {
      const y = [];
      for(let j = 0; j < 10; ++j) {
        if(i < 2) {
          y.push('empty')
        } else {
          y.push((j % 3) ? 'ocean' : 'grass');
        }
      }
      x.push(y);
    }
    console.log(x);
    this.setMap(x);
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
